#!/usr/bin/env node

import { createCliProgram } from './cli/config.js';
import { setupCliErrorHandling } from './cli/errorHandler.js';
import { createEnvironmentTable } from './core/table.js';
import { readEnvironmentVariables } from './core/env-reader.js';
import { logger } from './utils/logger.js';
import { EXIT_CODES, ERROR_MESSAGES } from './constants/index.js';

// Create and configure CLI program
const program = createCliProgram();
setupCliErrorHandling(program);

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

program.parse(process.argv);
