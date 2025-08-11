import { describe, it, expect, vi, beforeEach } from 'vitest';
import { formatValueWithColor } from '../../../src/utils/colorFormatter.js';
import { defaultConfig } from '../../../src/config/index.js';

// Mock chalk to avoid environment dependencies
vi.mock('chalk', () => ({
  default: {
    cyan: vi.fn((text: string) => `[CYAN]${text}[/CYAN]`),
    green: vi.fn((text: string) => `[GREEN]${text}[/GREEN]`),
    red: vi.fn((text: string) => `[RED]${text}[/RED]`),
    yellow: {
      bold: vi.fn((text: string) => `[YELLOW_BOLD]${text}[/YELLOW_BOLD]`),
    },
  },
}));

describe('colorFormatter - formatValueWithColor Function', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Core Logic Tests', () => {
    it('should return normal strings unchanged', () => {
      const testValues = ['normal_value', 'API_KEY_123', '/usr/local/bin', 'production'];

      testValues.forEach((value) => {
        expect(formatValueWithColor(value)).toBe(value);
      });
    });

    it('should handle empty string (not <empty> placeholder) unchanged', () => {
      const emptyString = '';
      expect(formatValueWithColor(emptyString)).toBe(emptyString);
    });

    it('should handle edge cases correctly', () => {
      const variations = ['<EMPTY>', '<Empty>', ' <empty>', '<empty> ', 'prefix<empty>suffix'];

      variations.forEach((value) => {
        expect(formatValueWithColor(value)).toBe(value);
      });
    });
  });

  describe('Chalk Integration Tests', () => {
    it('should call chalk.yellow.bold for <empty> values', () => {
      const result = formatValueWithColor('<empty>');

      expect(result).toBe('[YELLOW_BOLD]<empty>[/YELLOW_BOLD]');
    });

    it('should not modify normal values', () => {
      const testValues = ['normal_value', '', '<EMPTY>'];

      testValues.forEach((value) => {
        const result = formatValueWithColor(value);
        expect(result).toBe(value);
        expect(result).not.toContain('[YELLOW_BOLD]');
      });
    });

    it('should process <empty> values differently from normal values', () => {
      const emptyResult = formatValueWithColor('<empty>');
      const normalResult = formatValueWithColor('normal');

      expect(emptyResult).toBe('[YELLOW_BOLD]<empty>[/YELLOW_BOLD]');
      expect(normalResult).toBe('normal');
      expect(emptyResult).not.toBe('<empty>');
    });
  });

  describe('Boolean Value Color Tests', () => {
    it('should format true values with green color (case-insensitive)', () => {
      const trueVariations = ['true', 'True', 'TRUE', 'tRuE'];

      trueVariations.forEach((value) => {
        const result = formatValueWithColor(value);
        expect(result).toBe(`[GREEN]${value}[/GREEN]`);
      });
    });

    it('should format false values with red color (case-insensitive)', () => {
      const falseVariations = ['false', 'False', 'FALSE', 'fAlSe'];

      falseVariations.forEach((value) => {
        const result = formatValueWithColor(value);
        expect(result).toBe(`[RED]${value}[/RED]`);
      });
    });

    it('should not format partial boolean matches', () => {
      const nonBooleanValues = ['trueish', 'false_value', 'is_true', 'not_false'];

      nonBooleanValues.forEach((value) => {
        const result = formatValueWithColor(value);
        expect(result).toBe(value);
        expect(result).not.toContain('[GREEN]');
        expect(result).not.toContain('[RED]');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string correctly', () => {
      const result = formatValueWithColor('');
      expect(result).toBe('');
      expect(result).not.toContain('[YELLOW_BOLD]');
    });

    it('should handle values with special symbols', () => {
      const specialValues = [
        '$100.00',
        '50%',
        'user@example.com',
        '#hashtag',
        'A & B',
        '!important',
        '$#@!%&*()_+=',
      ];

      specialValues.forEach((value) => {
        const result = formatValueWithColor(value);
        expect(result).toBe(value);
        expect(result).not.toContain('[GREEN]');
        expect(result).not.toContain('[RED]');
        expect(result).not.toContain('[YELLOW_BOLD]');
      });
    });

    it('should handle whitespace-only values', () => {
      const whitespaceValues = ['   ', '\t\t', '\n\n', ' \t \n '];

      whitespaceValues.forEach((value) => {
        const result = formatValueWithColor(value);
        expect(result).toBe(value);
        expect(result).not.toContain('[YELLOW_BOLD]');
      });
    });

    it('should handle values that look like booleans but are not exact matches', () => {
      const almostBooleans = [
        ' true',
        'true ',
        ' true ',
        'true\n',
        '\ttrue',
        ' false',
        'false ',
        ' false ',
        'false\n',
        '\tfalse',
      ];

      almostBooleans.forEach((value) => {
        const result = formatValueWithColor(value);
        expect(result).toBe(value);
        expect(result).not.toContain('[GREEN]');
        expect(result).not.toContain('[RED]');
      });
    });

    it('should handle very long values without issues', () => {
      const longValue = 'a'.repeat(300);
      const result = formatValueWithColor(longValue);
      expect(result).toBe(longValue);
      expect(result.length).toBe(300);
    });

    it('should handle values with newlines', () => {
      const multilineValue = 'line1\nline2\nline3';
      const result = formatValueWithColor(multilineValue);
      expect(result).toBe(multilineValue);
    });

    it('should handle numeric strings', () => {
      const numericValues = ['0', '42', '-1', '3.14', '1e10', 'NaN', 'Infinity'];

      numericValues.forEach((value) => {
        const result = formatValueWithColor(value);
        expect(result).toBe(value);
        expect(result).not.toContain('[GREEN]');
        expect(result).not.toContain('[RED]');
      });
    });

    it('should handle URLs and paths', () => {
      const urlPaths = [
        'https://example.com',
        'http://localhost:3000',
        '/usr/local/bin',
        'C:\\Windows\\System32',
        'file:///path/to/file',
      ];

      urlPaths.forEach((value) => {
        const result = formatValueWithColor(value);
        expect(result).toBe(value);
      });
    });

    it('should handle JSON-like strings', () => {
      const jsonStrings = ['{"key":"value"}', '[1,2,3]', '{"nested":{"prop":true}}'];

      jsonStrings.forEach((value) => {
        const result = formatValueWithColor(value);
        expect(result).toBe(value);
      });
    });
  });

  describe('Configuration Tests', () => {
    it('should read configuration structure correctly', () => {
      expect(defaultConfig.color.specialValues.empty).toEqual({
        color: 'yellow',
        bold: true,
      });
      expect(defaultConfig.color.specialValues.true).toEqual({
        color: 'green',
        bold: false,
      });
      expect(defaultConfig.color.specialValues.false).toEqual({
        color: 'red',
        bold: false,
      });
    });

    it('should be a function that returns strings', () => {
      expect(typeof formatValueWithColor).toBe('function');

      const emptyResult = formatValueWithColor('<empty>');
      const normalResult = formatValueWithColor('normal');

      expect(typeof emptyResult).toBe('string');
      expect(typeof normalResult).toBe('string');
    });

    it('should use configuration to determine styling', () => {
      // Test that config.bold: true results in bold styling
      const result = formatValueWithColor('<empty>');

      expect(result).toContain('[YELLOW_BOLD]');
      expect(result).toBe('[YELLOW_BOLD]<empty>[/YELLOW_BOLD]');
    });
  });
});
