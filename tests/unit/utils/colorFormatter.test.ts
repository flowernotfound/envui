import { describe, it, expect } from 'vitest';
import { formatValueWithColor } from '../../../src/utils/colorFormatter.js';
import { colorConfig } from '../../../src/config/colorConfig.js';

describe('colorFormatter - formatValueWithColor Function', () => {
  describe('Core Functionality - Most Critical Tests', () => {
    it('should apply yellow bold styling to <empty> value based on config', () => {
      const result = formatValueWithColor('<empty>');

      // Verify ANSI escape sequences are present (forced color mode)
      // eslint-disable-next-line no-control-regex
      expect(result).toContain('\u001b['); // ANSI escape start
      expect(result.length).toBeGreaterThan('<empty>'.length);
    });

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

    it('should correctly read configuration from colorConfig', () => {
      // Verify that our config structure is correct
      expect(colorConfig.specialValues.empty).toEqual({
        color: 'yellow',
        bold: true,
      });

      // Verify the function uses the config
      const result = formatValueWithColor('<empty>');
      expect(result).not.toBe('<empty>'); // Should be styled
    });

    it('should produce string containing basic ANSI escape sequences for <empty>', () => {
      const result = formatValueWithColor('<empty>');

      // Check for basic ANSI structure (color codes and reset codes)
      // eslint-disable-next-line no-control-regex
      expect(result).toMatch(/\u001b\[\d+m.*\u001b\[\d+m/);

      // Verify original text is preserved when ANSI codes are stripped
      // eslint-disable-next-line no-control-regex
      const strippedResult = result.replace(/\u001b\[\d+m/g, '');
      expect(strippedResult).toBe('<empty>');
    });
  });
});
