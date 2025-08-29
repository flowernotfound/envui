import { createCliError, CliErrorType, type CliErrorObject } from './types.js';
import { EXIT_CODES, CLI_MESSAGES } from '../../constants/index.js';
import { logger } from '../../utils/logger.js';

/**
 * Handle CLI error and display appropriate message
 */
export function handleCliError(error: CliErrorObject): void {
  switch (error.type) {
    case CliErrorType.UNKNOWN_OPTION:
      logger.userError(error.message, { hint: CLI_MESSAGES.INVALID_OPTION_HELP });
      break;

    case CliErrorType.INVALID_ARGUMENT:
      // For --filter errors, show detailed usage; for others, show hint
      if (error.message.includes('--filter')) {
        logger.userError(error.message, {
          usage:
            '  envui [PREFIX]        # Filter by prefix\n  envui --filter TEXT   # Filter by partial match',
        });
      } else {
        logger.userError(error.message, { hint: CLI_MESSAGES.INVALID_OPTION_HELP });
      }
      break;

    case CliErrorType.HELP_REQUESTED:
      // Help display handled in main logic
      break;

    case CliErrorType.VERSION_REQUESTED:
      // Version display handled in main logic
      break;

    case CliErrorType.FILTER_CONFLICT:
      logger.userError(error.message, {
        usage:
          '  envui [PREFIX]        # Filter by prefix\n  envui --filter TEXT   # Filter by partial match',
      });
      break;

    case CliErrorType.NO_DATA_FOUND:
      logger.userInfo(error.message);
      break;

    case CliErrorType.SUCCESS_EXIT:
      logger.userInfo(error.message);
      break;

    case CliErrorType.SYSTEM_ERROR:
      logger.userError(error.message);
      break;

    default:
      logger.userError('An unexpected error occurred');
  }
}

/**
 * Create unknown option error
 */
export function createUnknownOptionError(option: string): CliErrorObject {
  return createCliError(
    CliErrorType.UNKNOWN_OPTION,
    `unknown option '${option}'`,
    EXIT_CODES.INVALID_ARGUMENT,
  );
}

/**
 * Create system error
 */
export function createSystemError(message: string): CliErrorObject {
  return createCliError(CliErrorType.SYSTEM_ERROR, message, EXIT_CODES.SYSTEM_ERROR);
}
