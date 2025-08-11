#!/usr/bin/env node

import { CommanderError } from 'commander';
import { createCliProgram } from './cli/config.js';
import { createEnvironmentTable } from './core/table.js';
import { readEnvironmentVariables } from './core/env-reader.js';
import { logger } from './utils/logger.js';
import { EXIT_CODES, ERROR_MESSAGES, CLI_MESSAGES } from './constants/index.js';

// Create and configure CLI program
const program = createCliProgram();

// Enable exit override for custom error handling
program.exitOverride();

// Set main action
program.action(() => {
  try {
    // Get environment data from process.env
    const environmentData = readEnvironmentVariables();

    // Check if no environment variables found
    if (environmentData.length === 0) {
      console.log(ERROR_MESSAGES.NO_ENVIRONMENT_VARIABLES);
      process.exit(EXIT_CODES.DATA_NOT_FOUND);
    }

    const table = createEnvironmentTable(environmentData);
    console.log(table);
    process.exit(EXIT_CODES.SUCCESS);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
    } else {
      logger.error('An unexpected error occurred');
    }
    process.exit(EXIT_CODES.SYSTEM_ERROR);
  }
});

// Parse command line arguments with type-safe error handling
try {
  program.parse(process.argv);
} catch (err) {
  if (err instanceof CommanderError && err.code === 'commander.unknownOption') {
    console.error(err.message);
    console.error(CLI_MESSAGES.INVALID_OPTION_HELP);
    process.exit(EXIT_CODES.INVALID_ARGUMENT);
  } else if (
    err instanceof CommanderError &&
    (err.code === 'commander.version' || err.code === 'commander.helpDisplayed')
  ) {
    process.exit(EXIT_CODES.SUCCESS);
  } else if (err instanceof CommanderError) {
    console.error(err.message);
    process.exit(err.exitCode || 1);
  } else {
    if (err instanceof Error) {
      logger.error(err.message);
    } else {
      logger.error('An unexpected error occurred');
    }
    process.exit(EXIT_CODES.SYSTEM_ERROR);
  }
}
