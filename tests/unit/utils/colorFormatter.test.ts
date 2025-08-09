import { describe, it, expect, vi, beforeEach } from 'vitest';
import { formatValueWithColor } from '../../../src/utils/colorFormatter.js';
import { colorConfig } from '../../../src/config/colorConfig.js';

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

  describe('Configuration Tests', () => {
    it('should read configuration structure correctly', () => {
      expect(colorConfig.specialValues.empty).toEqual({
        color: 'yellow',
        bold: true,
      });
      expect(colorConfig.specialValues.true).toEqual({
        color: 'green',
        bold: false,
      });
      expect(colorConfig.specialValues.false).toEqual({
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
