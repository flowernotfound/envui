import { describe, it, expect } from 'vitest';
import {
  parseArgs,
  tokenize,
  validateTokens,
  isValidOption,
} from '../../../src/cli/parser/index.js';
import type { CliConfig } from '../../../src/cli/parser/index.js';

describe('CLI Parser', () => {
  const mockConfig: CliConfig = {
    name: 'envui',
    version: '0.1.0',
    description: 'Test description',
    helpText: 'Test help',
    supportedOptions: ['help', 'version', 'filter'],
  };

  describe('tokenize', () => {
    it('should tokenize long options', () => {
      const tokens = tokenize(['--help', '--version']);

      expect(tokens).toEqual([
        { type: 'option', value: 'help', raw: '--help' },
        { type: 'option', value: 'version', raw: '--version' },
      ]);
    });

    it('should tokenize short options', () => {
      const tokens = tokenize(['-h', '-v']);

      expect(tokens).toEqual([
        { type: 'option', value: 'h', raw: '-h' },
        { type: 'option', value: 'v', raw: '-v' },
      ]);
    });

    it('should tokenize combined short options', () => {
      const tokens = tokenize(['-hv']);

      expect(tokens).toEqual([
        { type: 'option', value: 'h', raw: '-h' },
        { type: 'option', value: 'v', raw: '-v' },
      ]);
    });

    it('should tokenize options with values', () => {
      const tokens = tokenize(['--name=value']);

      expect(tokens).toEqual([
        { type: 'option', value: 'name', raw: '--name=value' },
        { type: 'value', value: 'value', raw: 'value' },
      ]);
    });

    it('should tokenize arguments', () => {
      const tokens = tokenize(['arg1', 'arg2']);

      expect(tokens).toEqual([
        { type: 'argument', value: 'arg1', raw: 'arg1' },
        { type: 'argument', value: 'arg2', raw: 'arg2' },
      ]);
    });
  });

  describe('validateTokens', () => {
    it('should validate supported options', () => {
      const tokens = tokenize(['--help', '--version']);
      const errors = validateTokens(tokens, mockConfig);

      expect(errors).toEqual([]);
    });

    it('should detect unknown options', () => {
      const tokens = tokenize(['--unknown']);
      const errors = validateTokens(tokens, mockConfig);

      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe('unknown_option');
      expect(errors[0].message).toContain('--unknown');
    });

    it('should handle option aliases', () => {
      const tokens = tokenize(['-h', '-v']);
      const errors = validateTokens(tokens, mockConfig);

      expect(errors).toEqual([]);
    });
  });

  describe('parseArgs', () => {
    it('should parse empty arguments', () => {
      const result = parseArgs(['node', 'cli.js'], mockConfig);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.command).toBe('main');
        expect(result.data.options).toEqual([]);
        expect(result.data.flags.size).toBe(0);
      }
    });

    it('should parse help option', () => {
      const result = parseArgs(['node', 'cli.js', '--help'], mockConfig);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.command).toBe('help');
        expect(result.data.options).toContain('help');
        expect(result.data.flags.has('help')).toBe(true);
      }
    });

    it('should parse short help option', () => {
      const result = parseArgs(['node', 'cli.js', '-h'], mockConfig);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.command).toBe('help');
        expect(result.data.options).toContain('help');
        expect(result.data.flags.has('help')).toBe(true);
      }
    });

    it('should parse version option', () => {
      const result = parseArgs(['node', 'cli.js', '--version'], mockConfig);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.command).toBe('version');
        expect(result.data.options).toContain('version');
        expect(result.data.flags.has('version')).toBe(true);
      }
    });

    it('should parse short version option', () => {
      const result = parseArgs(['node', 'cli.js', '-v'], mockConfig);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.command).toBe('version');
        expect(result.data.options).toContain('version');
        expect(result.data.flags.has('version')).toBe(true);
      }
    });

    it('should handle unknown options', () => {
      const result = parseArgs(['node', 'cli.js', '--unknown'], mockConfig);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('unknown_option');
        expect(result.error.message).toContain('--unknown');
      }
    });

    it('should prioritize help over version', () => {
      const result = parseArgs(['node', 'cli.js', '--help', '--version'], mockConfig);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.command).toBe('help');
      }
    });

    it('should parse --filter option with value', () => {
      const result = parseArgs(['node', 'cli.js', '--filter', 'API'], mockConfig);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.command).toBe('main');
        expect(result.data.flags.has('filter')).toBe(true);
        expect(result.data.filterValue).toBe('API');
        expect(result.data.arguments).toEqual([]);
      }
    });

    it('should handle --filter without value', () => {
      const result = parseArgs(['node', 'cli.js', '--filter'], mockConfig);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('filter_requires_value');
        expect(result.error.message).toBe('--filter option requires a search text');
      }
    });

    it('should handle --filter with empty string value', () => {
      const result = parseArgs(['node', 'cli.js', '--filter', ''], mockConfig);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('filter_requires_value');
        expect(result.error.message).toBe('--filter option requires a search text');
      }
    });

    it('should handle --filter with whitespace only value', () => {
      const result = parseArgs(['node', 'cli.js', '--filter', '   '], mockConfig);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('filter_requires_value');
        expect(result.error.message).toBe('--filter option requires a search text');
      }
    });

    it('should trim whitespace from --filter value', () => {
      const result = parseArgs(['node', 'cli.js', '--filter', '  API  '], mockConfig);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.filterValue).toBe('API');
      }
    });

    it('should parse --filter with special characters', () => {
      const result = parseArgs(['node', 'cli.js', '--filter', '_API_'], mockConfig);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.filterValue).toBe('_API_');
      }
    });

    it('should parse --filter with case-insensitive value', () => {
      const result = parseArgs(['node', 'cli.js', '--filter', 'api'], mockConfig);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.filterValue).toBe('api');
      }
    });

    it('should not consume prefix argument when --filter is used', () => {
      const result = parseArgs(['node', 'cli.js', '--filter', 'API', 'PREFIX'], mockConfig);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.filterValue).toBe('API');
        expect(result.data.arguments).toEqual(['PREFIX']);
      }
    });

    it('should parse -f option with value', () => {
      const result = parseArgs(['node', 'cli.js', '-f', 'API'], mockConfig);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.command).toBe('main');
        expect(result.data.flags.has('filter')).toBe(true);
        expect(result.data.filterValue).toBe('API');
        expect(result.data.arguments).toEqual([]);
      }
    });

    it('should handle -f without value', () => {
      const result = parseArgs(['node', 'cli.js', '-f'], mockConfig);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.type).toBe('filter_requires_value');
        expect(result.error.message).toBe('--filter option requires a search text');
      }
    });

    it('should trim whitespace from -f value', () => {
      const result = parseArgs(['node', 'cli.js', '-f', '  API  '], mockConfig);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.filterValue).toBe('API');
      }
    });
  });

  describe('isValidOption', () => {
    it('should return true for supported options', () => {
      expect(isValidOption('help', mockConfig)).toBe(true);
      expect(isValidOption('version', mockConfig)).toBe(true);
    });

    it('should return true for aliased options', () => {
      expect(isValidOption('h', mockConfig)).toBe(true);
      expect(isValidOption('v', mockConfig)).toBe(true);
    });

    it('should return false for unsupported options', () => {
      expect(isValidOption('unknown', mockConfig)).toBe(false);
      expect(isValidOption('invalid', mockConfig)).toBe(false);
    });

    it('should handle empty option string', () => {
      expect(isValidOption('', mockConfig)).toBe(false);
    });

    it('should handle options not in aliases map', () => {
      expect(isValidOption('custom', mockConfig)).toBe(false);
    });
  });
});
