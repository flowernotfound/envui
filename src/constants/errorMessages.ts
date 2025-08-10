/**
 * Standard error messages for envui CLI application
 * All messages are in English for consistency
 */
export const ERROR_MESSAGES = {
  NO_ENVIRONMENT_VARIABLES: 'No environment variables found',
  ENV_READ_FAILED: 'Error: Failed to read environment variables',
  TABLE_CREATE_FAILED: 'Error: Failed to create table',
  GENERAL_ERROR: 'Error: An unexpected error occurred',
  PERMISSION_DENIED: 'Error: Permission denied while accessing environment variables',
} as const;

export type ErrorMessage = (typeof ERROR_MESSAGES)[keyof typeof ERROR_MESSAGES];
