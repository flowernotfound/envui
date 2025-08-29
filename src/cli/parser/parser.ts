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
        arguments: [],
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
  const parsedArguments: string[] = [];
  let command: ParsedArgs['command'] = 'main';
  let filterValue: string | undefined;

  // Check help flag with priority
  let hasHelp = false;
  let hasVersion = false;
  let skipNext = false;

  for (let i = 0; i < tokens.length; i++) {
    if (skipNext) {
      skipNext = false;
      continue;
    }

    const token = tokens[i];
    if (!token) continue;

    if (token.type === 'option') {
      const normalizedOption = OPTION_ALIASES[token.value] ?? token.value;

      if (normalizedOption === 'help') {
        hasHelp = true;
      } else if (normalizedOption === 'version') {
        hasVersion = true;
      } else if (normalizedOption === 'filter') {
        // Handle --filter option with value
        const nextToken = tokens[i + 1];
        if (!nextToken || nextToken.type !== 'argument') {
          return {
            success: false,
            error: {
              type: 'filter_requires_value',
              message: '--filter option requires a search text',
              code: 1,
            },
          };
        }

        // Check if the value is empty or whitespace only
        const value = nextToken.value.trim();
        if (value === '') {
          return {
            success: false,
            error: {
              type: 'filter_requires_value',
              message: '--filter option requires a search text',
              code: 1,
            },
          };
        }

        filterValue = value;
        skipNext = true;
      }

      options.push(normalizedOption);
      flags.add(normalizedOption);
    } else if (token.type === 'argument') {
      parsedArguments.push(token.value);
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
      arguments: parsedArguments,
      errors: [],
      filterValue,
    },
  };
}

/**
 * Parse directly from process.argv
 */
export function parseProcessArgs(config: CliConfig): ParseResult {
  return parseArgs(process.argv, config);
}
