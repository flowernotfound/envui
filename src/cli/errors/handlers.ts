import { createCliError, CliErrorType, type CliErrorObject } from './types.js';
import { EXIT_CODES, CLI_MESSAGES } from '../../constants/index.js';
import { logger } from '../../utils/logger.js';

/**
 * Handle CLI error and display appropriate message
 */
export function handleCliError(error: CliErrorObject): void {
  switch (error.type) {
    case CliErrorType.UNKNOWN_OPTION:
      logger.error(error.message);
      logger.error(CLI_MESSAGES.INVALID_OPTION_HELP);
      break;

    case CliErrorType.INVALID_ARGUMENT:
      logger.error(error.message);
      logger.error(CLI_MESSAGES.INVALID_OPTION_HELP);
      break;

    case CliErrorType.HELP_REQUESTED:
      // Help display handled in main logic
      break;

    case CliErrorType.VERSION_REQUESTED:
      // Version display handled in main logic
      break;

    case CliErrorType.SYSTEM_ERROR:
      logger.error(error.message);
      break;

    default:
      logger.error('An unexpected error occurred');
  }
}

/**
 * Create unknown option error
 */
export function createUnknownOptionError(option: string): CliErrorObject {
  return createCliError(
    CliErrorType.UNKNOWN_OPTION,
    `error: unknown option '${option}'`,
    EXIT_CODES.INVALID_ARGUMENT,
  );
}

/**
 * Create system error
 */
export function createSystemError(message: string): CliErrorObject {
  return createCliError(CliErrorType.SYSTEM_ERROR, message, EXIT_CODES.SYSTEM_ERROR);
}
