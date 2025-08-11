/**
 * CLI error types
 */
export enum CliErrorType {
  UNKNOWN_OPTION = 'unknown_option',
  INVALID_ARGUMENT = 'invalid_argument',
  HELP_REQUESTED = 'help_requested',
  VERSION_REQUESTED = 'version_requested',
  SYSTEM_ERROR = 'system_error',
}

/**
 * CLI error object interface
 */
export interface CliErrorObject extends Error {
  readonly type: CliErrorType;
  readonly exitCode: number;
  readonly code: string;
}

/**
 * Create a CLI error object
 */
export function createCliError(
  type: CliErrorType,
  message: string,
  exitCode: number,
): CliErrorObject {
  const error = Object.assign(new Error(message), {
    type,
    exitCode,
    code: `cli.${type}`,
    name: 'CliError',
  });
  return error;
}

/**
 * Type guard for CLI error
 */
export function isCliError(error: unknown): error is CliErrorObject {
  return (
    error instanceof Error &&
    'type' in error &&
    'exitCode' in error &&
    'code' in error &&
    (error as Error).name === 'CliError'
  );
}
