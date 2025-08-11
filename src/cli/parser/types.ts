/**
 * Type definition for CLI parsing result
 */
export interface ParsedArgs {
  readonly command: 'main' | 'help' | 'version';
  readonly options: ReadonlyArray<string>;
  readonly flags: ReadonlySet<string>;
  readonly errors: ReadonlyArray<CliError>;
}

/**
 * Type definition for CLI error
 */
export interface CliError {
  readonly type: 'unknown_option' | 'invalid_argument' | 'system_error';
  readonly message: string;
  readonly code: number;
}

/**
 * Type definition for parse result
 */
export type ParseResult = { success: true; data: ParsedArgs } | { success: false; error: CliError };

/**
 * Type definition for CLI configuration
 */
export interface CliConfig {
  readonly name: string;
  readonly version: string;
  readonly description: string;
  readonly helpText: string;
  readonly supportedOptions: ReadonlyArray<string>;
}

/**
 * Type definition for parsed option result
 */
export interface ParsedOption {
  readonly name: string;
  readonly value?: string;
}
