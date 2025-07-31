#!/usr/bin/env node

import { Command } from 'commander';

const program = new Command();

program
  .name('envui')
  .description('Beautiful environment variable viewer')
  .version('0.1.0')
  .action(() => {
    console.log('init test');
    console.log('This will be a beautiful environment variable viewer.');
  });

program.parse(process.argv);
