import { EXIT_CODES } from '../../constants/index.js';
import { createCliError, CliErrorType } from '../errors/types.js';

/**
 * Handle help command
 */
export function handleHelpCommand(helpText: string): void {
  throw createCliError(CliErrorType.SUCCESS_EXIT, helpText, EXIT_CODES.SUCCESS);
}
