/**
 * Extract error message from unknown error type
 * @param error - Error of unknown type
 * @returns Error message string
 */
export function extractErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error';
}

/**
 * Wrap error with additional context
 * @param context - Context message to prepend
 * @param originalError - Original error
 * @returns New Error with context
 */
export function wrapError(context: string, originalError: unknown): Error {
  const message = extractErrorMessage(originalError);
  return new Error(`${context}: ${message}`);
}
