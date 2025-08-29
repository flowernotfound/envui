import { getVersionText } from '../config.js';
import { EXIT_CODES } from '../../constants/index.js';
import { createCliError, CliErrorType } from '../errors/types.js';

/**
 * Handle version command
 */
export function handleVersionCommand(): void {
  throw createCliError(CliErrorType.SUCCESS_EXIT, getVersionText(), EXIT_CODES.SUCCESS);
}
