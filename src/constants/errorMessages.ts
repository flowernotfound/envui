/**
 * Standard error messages for envui CLI application
 * All messages are in English for consistency
 */
export const ERROR_MESSAGES = {
  NO_ENVIRONMENT_VARIABLES: 'No environment variables found',
} as const;

export type ErrorMessage = (typeof ERROR_MESSAGES)[keyof typeof ERROR_MESSAGES];
