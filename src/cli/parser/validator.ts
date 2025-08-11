import type { Token } from './tokenizer.js';
import type { CliConfig, ParseError } from './types.js';
import { OPTION_ALIASES } from '../../constants/index.js';

/**
 * Validate tokens
 */
export function validateTokens(tokens: readonly Token[], config: CliConfig): readonly ParseError[] {
  const errors: ParseError[] = [];
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
