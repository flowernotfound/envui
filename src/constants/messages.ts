/**
 * CLI interface messages
 */
export const CLI_MESSAGES = {
  HELP_EXAMPLES:
    "\nExamples:\n  envui              Display all environment variables\n  envui PREFIX       Display variables starting with PREFIX\n  envui --filter API Display variables containing 'API'",
  HELP_DESCRIPTION:
    '\nDescription:\n  envui is a modern alternative to printenv that displays environment \n  variables in a clean, colorized table format for better readability.',
  INVALID_OPTION_HELP: "\nUse 'envui --help' to see available options.",
  FILTER_INFO: (prefix: string, count: number, total: number) =>
    `Filter: Variables starting with '${prefix}' (${count} of ${total} displayed)`,
  FILTER_INFO_PARTIAL: (searchText: string, count: number, total: number) =>
    `Filter: Variables containing '${searchText}' (${count} of ${total} displayed)`,
} as const;

/**
 * Error messages used in the application
 */
export const ERROR_MESSAGES = {
  NO_ENVIRONMENT_VARIABLES: 'No environment variables found',
  NO_MATCHING_VARIABLES: (prefix: string) => `No environment variables found matching '${prefix}'`,
} as const;

export type ErrorMessage = (typeof ERROR_MESSAGES)[keyof typeof ERROR_MESSAGES];
