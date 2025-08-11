import { EXIT_CODES } from '../../constants/index.js';

/**
 * Handle help command
 */
export function handleHelpCommand(helpText: string): void {
  console.log(helpText);
  process.exit(EXIT_CODES.SUCCESS);
}
