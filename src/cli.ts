#!/usr/bin/env node

import { parseProcessArgs } from './cli/parser/index.js';
import { CliError, CliErrorType, handleCliError } from './cli/errors/index.js';
import { createCliConfig, getVersionText } from './cli/config.js';
import { createEnvironmentTable } from './core/table.js';
import { readEnvironmentVariables } from './core/env-reader.js';
import { logger } from './utils/logger.js';
import { EXIT_CODES, ERROR_MESSAGES } from './constants/index.js';

// Create CLI configuration
const config = createCliConfig();

try {
  // Parse command line arguments
  const parseResult = parseProcessArgs(config);

  if (!parseResult.success) {
    // Handle parse errors
    const error = new CliError(
      parseResult.error.type === 'unknown_option'
        ? CliErrorType.UNKNOWN_OPTION
        : CliErrorType.INVALID_ARGUMENT,
      parseResult.error.message,
      parseResult.error.code,
    );
    handleCliError(error);
    process.exit(error.exitCode);
  }

  const { data } = parseResult;

  // Handle command processing
  switch (data.command) {
    case 'help':
      console.log(config.helpText);
      process.exit(EXIT_CODES.SUCCESS);
    // eslint-disable-next-line no-fallthrough
    case 'version':
      console.log(getVersionText());
      process.exit(EXIT_CODES.SUCCESS);
    // eslint-disable-next-line no-fallthrough
    case 'main': {
      // Get environment variables
      const environmentData = readEnvironmentVariables();

      // Handle case when no environment variables found
      if (environmentData.length === 0) {
        console.log(ERROR_MESSAGES.NO_ENVIRONMENT_VARIABLES);
        process.exit(EXIT_CODES.DATA_NOT_FOUND);
      }

      // Display table
      const table = createEnvironmentTable(environmentData);
      console.log(table);
      process.exit(EXIT_CODES.SUCCESS);
    }
    // eslint-disable-next-line no-fallthrough
    default:
      // Unexpected command
      logger.error('An unexpected error occurred');
      process.exit(EXIT_CODES.SYSTEM_ERROR);
  }
} catch (error) {
  // Handle system errors
  if (error instanceof CliError) {
    handleCliError(error);
    process.exit(error.exitCode);
  } else if (error instanceof Error) {
    logger.error(error.message);
  } else {
    logger.error('An unexpected error occurred');
  }
  process.exit(EXIT_CODES.SYSTEM_ERROR);
}
