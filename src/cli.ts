#!/usr/bin/env node

import { Command } from 'commander';
import pkg from '../package.json' with { type: 'json' };

const program = new Command();

program
  .name('envui')
  .description('Beautiful environment variable viewer')
  .version(pkg.version)
  .action(() => {
    console.log('init test');
    console.log('This will be a beautiful environment variable viewer.');
  });

program.parse(process.argv);
