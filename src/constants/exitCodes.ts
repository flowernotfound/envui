/**
 * Exit codes for envui CLI application
 * Following UNIX conventions:
 * - 0: Success
 * - 1: General system error
 * - 2: Data not found (no environment variables) or invalid argument
 */
export const EXIT_CODES = {
  SUCCESS: 0,
  SYSTEM_ERROR: 1,
  DATA_NOT_FOUND: 2,
  INVALID_ARGUMENT: 2, // UNIX convention: invalid argument uses exit code 2
} as const;

export type ExitCode = (typeof EXIT_CODES)[keyof typeof EXIT_CODES];
