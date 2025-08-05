#!/usr/bin/env node

import { Command } from 'commander';
import pkg from '../package.json' with { type: 'json' };
import { createEnvironmentTable } from './core/table.js';
import { readEnvironmentVariables } from './core/env-reader.js';
import { logger } from './utils/logger.js';

const program = new Command();

program
  .name('envui')
  .description('Beautiful environment variable viewer')
  .version(pkg.version)
  .action(() => {
    try {
      // Get environment data from process.env
      const environmentData = readEnvironmentVariables();
      const table = createEnvironmentTable(environmentData);
      console.log(table);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error.message);
      } else {
        logger.error('Failed to create table display');
      }
      process.exit(1);
    }
  });

program.parse(process.argv);
