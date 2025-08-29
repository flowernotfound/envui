import type { CliConfig } from './parser/index.js';
import pkg from '../../package.json' with { type: 'json' };
import { CLI_MESSAGES } from '../constants/index.js';

/**
 * Create CLI configuration
 */
export function createCliConfig(): CliConfig {
  return {
    name: 'envui',
    version: pkg.version,
    description: 'Beautiful environment variable viewer',
    helpText: formatHelpText(),
    supportedOptions: ['help', 'version', 'filter'],
  };
}

/**
 * Format help text
 */
function formatHelpText(): string {
  const lines = [
    `envui v${pkg.version}`,
    '',
    'Beautiful environment variable viewer',
    '',
    'Usage:',
    '  envui [options]',
    '',
    'Options:',
    '  -h, --help         display help for command',
    '  -v, --version      display version number',
    '  --filter TEXT      filter variables containing TEXT (case-insensitive)',
    '',
    CLI_MESSAGES.HELP_EXAMPLES,
    CLI_MESSAGES.HELP_DESCRIPTION,
  ];

  return lines.join('\n');
}

/**
 * Get version text for display
 */
export function getVersionText(): string {
  return pkg.version;
}
