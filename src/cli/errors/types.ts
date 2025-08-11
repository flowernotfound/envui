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
 * Custom CLI error class (replacement for CommanderError)
 */
export class CliError extends Error {
  constructor(
    public readonly type: CliErrorType,
    message: string,
    public readonly exitCode: number,
  ) {
    super(message);
    this.name = 'CliError';
  }

  /**
   * Code property for compatibility with CommanderError
   */
  get code(): string {
    return `cli.${this.type}`;
  }
}
