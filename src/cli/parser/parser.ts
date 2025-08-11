import type { ParsedArgs, ParseResult, CliConfig } from './types.js';
import { tokenize } from './tokenizer.js';
import { validateTokens } from './validator.js';
import { OPTION_ALIASES } from '../../constants/index.js';

/**
 * Parse command line arguments
 */
export function parseArgs(args: readonly string[], config: CliConfig): ParseResult {
  // Remove first two arguments (node cli.js)
  const userArgs = args.slice(2);

  // Default to main command if no arguments
  if (userArgs.length === 0) {
    return {
      success: true,
      data: {
        command: 'main',
        options: [],
        flags: new Set(),
        errors: [],
      },
    };
  }

  // Tokenize
  const tokens = tokenize(userArgs);

  // Validation
  const errors = validateTokens(tokens, config);

  // Handle errors
  if (errors.length > 0) {
    const firstError = errors[0];
    if (!firstError) {
      // Handle case where error array is not empty but first element is undefined (theoretically impossible but for type safety)
      return {
        success: false,
        error: {
          type: 'system_error',
          message: 'An unexpected error occurred',
          code: 1,
        },
      };
    }
    return {
      success: false,
      error: firstError,
    };
  }

  // Build parse result
  const options: string[] = [];
  const flags = new Set<string>();
  let command: ParsedArgs['command'] = 'main';

  // Check help flag with priority
  let hasHelp = false;
  let hasVersion = false;

  for (const token of tokens) {
    if (token.type === 'option') {
      const normalizedOption = OPTION_ALIASES[token.value] ?? token.value;

      if (normalizedOption === 'help') {
        hasHelp = true;
      } else if (normalizedOption === 'version') {
        hasVersion = true;
      }

      options.push(normalizedOption);
      flags.add(normalizedOption);
    }
  }

  // Prioritize help
  if (hasHelp) {
    command = 'help';
  } else if (hasVersion) {
    command = 'version';
  }

  return {
    success: true,
    data: {
      command,
      options,
      flags,
      errors: [],
    },
  };
}

/**
 * Parse directly from process.argv
 */
export function parseProcessArgs(config: CliConfig): ParseResult {
  return parseArgs(process.argv, config);
}
