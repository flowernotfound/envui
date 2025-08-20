import { describe, it, expect } from 'vitest';
import type { EnvironmentData } from '../../../src/types/environment.js';
import type { FilterConfig, FilterResult } from '../../../src/types/environment.js';
import {
  createPrefixFilter,
  filterEnvironmentVariables,
  generateFilterMessage,
  generateNoMatchMessage,
} from '../../../src/core/filter.js';

describe('Prefix Filter', () => {
  const mockEnvData: EnvironmentData[] = [
    { key: 'VITE_API_URL', value: 'https://api.example.com' },
    { key: 'VITE_API_KEY', value: 'sk-1234567890' },
    { key: 'VITE_DEBUG', value: 'true' },
    { key: 'NODE_ENV', value: 'development' },
    { key: 'NODE_OPTIONS', value: '--max-old-space-size=4096' },
    { key: 'PATH', value: '/usr/local/bin:/usr/bin' },
    { key: 'HOME', value: '/home/user' },
    { key: 'EMPTY_VAR', value: '<empty>' },
  ];

  describe('createPrefixFilter', () => {
    it('should create a filter function that matches prefix case-insensitively', () => {
      const filter = createPrefixFilter('VITE_');

      expect(filter({ key: 'VITE_API_URL', value: 'test' })).toBe(true);
      expect(filter({ key: 'vite_api_url', value: 'test' })).toBe(true);
      expect(filter({ key: 'NODE_ENV', value: 'test' })).toBe(false);
    });

    it('should handle lowercase prefix input', () => {
      const filter = createPrefixFilter('vite_');

      expect(filter({ key: 'VITE_API_URL', value: 'test' })).toBe(true);
      expect(filter({ key: 'vite_debug', value: 'test' })).toBe(true);
    });

    it('should handle empty prefix', () => {
      const filter = createPrefixFilter('');

      expect(filter({ key: 'VITE_API_URL', value: 'test' })).toBe(true);
      expect(filter({ key: 'NODE_ENV', value: 'test' })).toBe(true);
      expect(filter({ key: '', value: 'test' })).toBe(true);
    });

    it('should handle special characters in prefix', () => {
      const filter = createPrefixFilter('[PROD]');

      expect(filter({ key: '[PROD]_API_URL', value: 'test' })).toBe(true);
      expect(filter({ key: '[prod]_api_url', value: 'test' })).toBe(true);
      expect(filter({ key: 'PROD_API_URL', value: 'test' })).toBe(false);
    });

    it('should handle spaces in prefix', () => {
      const filter = createPrefixFilter('MY VAR');

      expect(filter({ key: 'MY VAR_TEST', value: 'test' })).toBe(true);
      expect(filter({ key: 'my var_test', value: 'test' })).toBe(true);
      expect(filter({ key: 'MYVAR_TEST', value: 'test' })).toBe(false);
    });
  });

  describe('filterEnvironmentVariables', () => {
    it('should filter variables by prefix', () => {
      const config: FilterConfig = { type: 'prefix', value: 'VITE_' };
      const result = filterEnvironmentVariables(mockEnvData, config);

      expect(result.filtered).toHaveLength(3);
      expect(result.filtered.every((env) => env.key.startsWith('VITE_'))).toBe(true);
      expect(result.total).toBe(8);
      expect(result.matchCount).toBe(3);
    });

    it('should return all variables when no filter is applied', () => {
      const config: FilterConfig = { type: 'none' };
      const result = filterEnvironmentVariables(mockEnvData, config);

      expect(result.filtered).toEqual(mockEnvData);
      expect(result.total).toBe(8);
      expect(result.matchCount).toBe(8);
    });

    it('should return empty array when no matches found', () => {
      const config: FilterConfig = { type: 'prefix', value: 'MISSING_' };
      const result = filterEnvironmentVariables(mockEnvData, config);

      expect(result.filtered).toHaveLength(0);
      expect(result.total).toBe(8);
      expect(result.matchCount).toBe(0);
    });

    it('should handle case-insensitive filtering', () => {
      const config: FilterConfig = { type: 'prefix', value: 'vite_' };
      const result = filterEnvironmentVariables(mockEnvData, config);

      expect(result.filtered).toHaveLength(3);
      expect(result.matchCount).toBe(3);
    });

    it('should handle empty prefix as matching all variables', () => {
      const config: FilterConfig = { type: 'prefix', value: '' };
      const result = filterEnvironmentVariables(mockEnvData, config);

      expect(result.filtered).toEqual(mockEnvData);
      expect(result.matchCount).toBe(8);
    });

    it('should preserve original order of variables', () => {
      const config: FilterConfig = { type: 'prefix', value: 'VITE_' };
      const result = filterEnvironmentVariables(mockEnvData, config);

      expect(result.filtered[0]?.key).toBe('VITE_API_URL');
      expect(result.filtered[1]?.key).toBe('VITE_API_KEY');
      expect(result.filtered[2]?.key).toBe('VITE_DEBUG');
    });
  });

  describe('generateFilterMessage', () => {
    it('should generate correct filter info message for prefix filter', () => {
      const config: FilterConfig = { type: 'prefix', value: 'VITE_' };
      const result: FilterResult = {
        filtered: [],
        total: 150,
        matchCount: 3,
        filterInfo: '',
      };

      const message = generateFilterMessage(config, result);
      expect(message).toBe("Filter: Variables starting with 'VITE_' (3 of 150 displayed)");
    });

    it('should return empty string for no filter', () => {
      const config: FilterConfig = { type: 'none' };
      const result: FilterResult = {
        filtered: [],
        total: 150,
        matchCount: 150,
        filterInfo: '',
      };

      const message = generateFilterMessage(config, result);
      expect(message).toBe('');
    });

    it('should handle 0 matches correctly', () => {
      const config: FilterConfig = { type: 'prefix', value: 'MISSING_' };
      const result: FilterResult = {
        filtered: [],
        total: 150,
        matchCount: 0,
        filterInfo: '',
      };

      const message = generateFilterMessage(config, result);
      expect(message).toBe("Filter: Variables starting with 'MISSING_' (0 of 150 displayed)");
    });

    it('should handle empty prefix correctly', () => {
      const config: FilterConfig = { type: 'prefix', value: '' };
      const result: FilterResult = {
        filtered: [],
        total: 150,
        matchCount: 150,
        filterInfo: '',
      };

      const message = generateFilterMessage(config, result);
      expect(message).toBe("Filter: Variables starting with '' (150 of 150 displayed)");
    });
  });

  describe('generateNoMatchMessage', () => {
    it('should generate correct no match message for prefix filter', () => {
      const config: FilterConfig = { type: 'prefix', value: 'MISSING_' };
      const message = generateNoMatchMessage(config);

      expect(message).toBe("No environment variables found matching 'MISSING_'");
    });

    it('should return generic message for no filter', () => {
      const config: FilterConfig = { type: 'none' };
      const message = generateNoMatchMessage(config);

      expect(message).toBe('No environment variables found');
    });

    it('should handle empty prefix', () => {
      const config: FilterConfig = { type: 'prefix', value: '' };
      const message = generateNoMatchMessage(config);

      expect(message).toBe("No environment variables found matching ''");
    });
  });

  describe('Edge cases', () => {
    it('should handle empty environment data', () => {
      const config: FilterConfig = { type: 'prefix', value: 'VITE_' };
      const result = filterEnvironmentVariables([], config);

      expect(result.filtered).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(result.matchCount).toBe(0);
    });

    it('should handle variables with empty keys', () => {
      const dataWithEmptyKey: EnvironmentData[] = [
        { key: '', value: 'value' },
        { key: 'VITE_TEST', value: 'test' },
      ];

      const config: FilterConfig = { type: 'prefix', value: 'VITE_' };
      const result = filterEnvironmentVariables(dataWithEmptyKey, config);

      expect(result.filtered).toHaveLength(1);
      expect(result.filtered[0]?.key).toBe('VITE_TEST');
    });

    it('should handle <empty> values correctly', () => {
      const dataWithEmpty: EnvironmentData[] = [
        { key: 'VITE_EMPTY', value: '<empty>' },
        { key: 'NODE_EMPTY', value: '<empty>' },
      ];

      const config: FilterConfig = { type: 'prefix', value: 'VITE_' };
      const result = filterEnvironmentVariables(dataWithEmpty, config);

      expect(result.filtered).toHaveLength(1);
      expect(result.filtered[0]?.value).toBe('<empty>');
    });
  });
});
