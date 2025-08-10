import { Command } from 'commander';
import pkg from '../../package.json' with { type: 'json' };
import { CLI_MESSAGES } from '../constants/index.js';

/**
 * Create and configure Commander program with custom help messages
 */
export function createCliProgram(): Command {
  const program = new Command();

  program
    .name('envui')
    .description('Beautiful environment variable viewer')
    .version(pkg.version)
    .addHelpText('after', CLI_MESSAGES.HELP_EXAMPLES)
    .addHelpText('after', CLI_MESSAGES.HELP_DESCRIPTION);

  return program;
}
