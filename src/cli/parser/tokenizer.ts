/**
 * Split arguments into tokens
 */
export interface Token {
  readonly type: 'option' | 'argument' | 'value';
  readonly value: string;
  readonly raw: string;
}

/**
 * Tokenize command line arguments
 */
export function tokenize(args: readonly string[]): readonly Token[] {
  const tokens: Token[] = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (!arg) continue;

    if (arg.startsWith('--')) {
      // Long options (--help, --version, etc.)
      const [optionName, optionValue] = arg.slice(2).split('=');
      if (optionName) {
        tokens.push({
          type: 'option',
          value: optionName,
          raw: arg,
        });
      }

      if (optionValue !== undefined) {
        tokens.push({
          type: 'value',
          value: optionValue,
          raw: optionValue,
        });
      }
    } else if (arg.startsWith('-') && arg.length > 1) {
      // Short options (-h, -v, etc.)
      const flags = arg.slice(1);
      for (const flag of flags) {
        tokens.push({
          type: 'option',
          value: flag,
          raw: `-${flag}`,
        });
      }
    } else {
      // Arguments or values
      tokens.push({
        type: 'argument',
        value: arg,
        raw: arg,
      });
    }
  }

  return tokens;
}

import { OPTION_ALIASES } from '../../constants/index.js';

export { OPTION_ALIASES };
