import { Command } from 'commander';
import { CLI_MESSAGES, EXIT_CODES } from '../constants/index.js';

/**
 * Setup custom error handling for CLI program
 */
export function setupCliErrorHandling(program: Command): void {
  program.configureOutput({
    writeErr: (str: string) => {
      // Check if this is an unknown option error
      if (str.includes('unknown option')) {
        // Extract and display the error message
        const lines = str.trim().split('\n');
        console.error(lines[0]); // Display the original error message
        console.error(CLI_MESSAGES.INVALID_OPTION_HELP);
        process.exit(EXIT_CODES.INVALID_ARGUMENT);
      } else {
        // For other errors, use default behavior
        console.error(str);
      }
    },
  });
}
