import type { Token } from './tokenizer.js';
import type { CliConfig, CliError } from './types.js';
import { OPTION_ALIASES } from './tokenizer.js';

/**
 * Validate tokens
 */
export function validateTokens(tokens: readonly Token[], config: CliConfig): readonly CliError[] {
  const errors: CliError[] = [];
  const supportedOptionsSet = new Set(config.supportedOptions);

  for (const token of tokens) {
    if (token.type === 'option') {
      const normalizedOption = OPTION_ALIASES[token.value] ?? token.value;

      if (!supportedOptionsSet.has(normalizedOption)) {
        errors.push({
          type: 'unknown_option',
          message: `Unknown option: ${token.raw}`,
          code: 2,
        });
      }
    }
  }

  return errors;
}

/**
 * Check if option is valid
 */
export function isValidOption(option: string, config: CliConfig): boolean {
  const normalizedOption = OPTION_ALIASES[option] ?? option;
  return config.supportedOptions.includes(normalizedOption);
}
