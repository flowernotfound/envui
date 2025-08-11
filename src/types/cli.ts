/**
 * CLI argument parsing types
 */

/**
 * Supported CLI options
 */
export type CliOption = 'help' | 'version';

/**
 * Result of argument parsing
 */
export interface ArgumentParseResult {
  /** The action to perform */
  action: 'help' | 'version' | 'main' | 'error';
  /** Error message if action is 'error' */
  errorMessage?: string;
  /** Exit code to use */
  exitCode: number;
}

/**
 * Raw command line arguments
 */
export interface RawArguments {
  /** All command line arguments */
  args: string[];
  /** Detected options */
  options: CliOption[];
  /** Unknown options that caused errors */
  unknownOptions: string[];
}
