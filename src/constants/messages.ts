/**
 * CLI interface messages
 */
export const CLI_MESSAGES = {
  HELP_EXAMPLES:
    '\nExamples:\n  envui          Display all environment variables in a beautiful table',
  HELP_DESCRIPTION:
    '\nDescription:\n  envui is a modern alternative to printenv that displays environment \n  variables in a clean, colorized table format for better readability.',
  INVALID_OPTION_HELP: "\nUse 'envui --help' to see available options.",
} as const;

/**
 * Error messages used in the application
 */
export const ERROR_MESSAGES = {
  NO_ENVIRONMENT_VARIABLES: 'No environment variables found',
} as const;

export type ErrorMessage = (typeof ERROR_MESSAGES)[keyof typeof ERROR_MESSAGES];
