import { createCliError, isCliError, CliErrorType, handleCliError } from './index.js';
import { logger } from '../../utils/logger.js';
import { EXIT_CODES } from '../../constants/index.js';

/**
 * Handle parse errors and convert to CLI error
 */
export function handleParseError(parseError: {
  type: string;
  message: string;
  code: number;
}): void {
  const error = createCliError(
    parseError.type === 'unknown_option'
      ? CliErrorType.UNKNOWN_OPTION
      : CliErrorType.INVALID_ARGUMENT,
    parseError.message,
    parseError.code,
  );
  handleCliError(error);
  process.exit(error.exitCode);
}

/**
 * Handle system errors
 */
export function handleSystemError(error: unknown): void {
  if (isCliError(error)) {
    handleCliError(error);
    process.exit(error.exitCode);
  } else if (error instanceof Error) {
    logger.error(error.message);
  } else {
    logger.error('An unexpected error occurred');
  }
  process.exit(EXIT_CODES.SYSTEM_ERROR);
}

/**
 * Unified error handler for all CLI error scenarios
 */
export function handleError(
  error: unknown,
  context?: {
    type: 'parse' | 'system';
    parseError?: { type: string; message: string; code: number };
  },
): void {
  if (context?.type === 'parse' && context.parseError) {
    handleParseError(context.parseError);
  } else {
    handleSystemError(error);
  }
}
