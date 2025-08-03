#!/usr/bin/env node

import { Command } from 'commander';
import pkg from '../package.json' with { type: 'json' };
import { createEnvironmentTable } from './core/table.js';
import { logger } from './utils/logger.js';

const program = new Command();

program
  .name('envui')
  .description('Beautiful environment variable viewer')
  .version(pkg.version)
  .action(() => {
    try {
      const table = createEnvironmentTable();
      console.log(table);
    } catch (error) {
      logger.error('Failed to create table display');
      process.exit(1);
    }
  });

program.parse(process.argv);
