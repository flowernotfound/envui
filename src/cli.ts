#!/usr/bin/env node

import { Command } from 'commander';
import pkg from '../package.json' with { type: 'json' };
import { createEnvironmentTable } from './core/table.js';
import { readEnvironmentVariables } from './core/env-reader.js';
import { logger } from './utils/logger.js';
import { EXIT_CODES, ERROR_MESSAGES } from './constants/index.js';

const program = new Command();

program
  .name('envui')
  .description('Beautiful environment variable viewer')
  .version(pkg.version)
  .action(() => {
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
        if (
          error.message.includes('permission') ||
          error.message.includes('EPERM') ||
          error.message.includes('EACCES')
        ) {
          logger.error(ERROR_MESSAGES.PERMISSION_DENIED);
        } else {
          logger.error(error.message);
        }
      } else {
        logger.error(ERROR_MESSAGES.GENERAL_ERROR);
      }
      process.exit(EXIT_CODES.SYSTEM_ERROR);
    }
  });

program.parse(process.argv);
