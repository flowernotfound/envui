import { describe, it, expect, afterEach, vi } from 'vitest';
import { readEnvironmentVariables } from '../../../src/core/envReader.js';

describe('readEnvironmentVariables - Basic Functionality', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it('should return array of environment variables with correct structure', () => {
    const result = readEnvironmentVariables();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);

    // Verify data structure
    result.forEach((item) => {
      expect(item).toHaveProperty('key');
      expect(item).toHaveProperty('value');
      expect(typeof item.key).toBe('string');
      expect(typeof item.value).toBe('string');
    });
  });

  it('should read environment variables correctly', () => {
    vi.stubEnv('TEST_NODE_ENV', 'test');
    vi.stubEnv('TEST_API_KEY', 'secret123');
    vi.stubEnv('TEST_PORT', '3000');

    const result = readEnvironmentVariables();

    expect(result).toContainEqual({ key: 'TEST_NODE_ENV', value: 'test' });
    expect(result).toContainEqual({ key: 'TEST_API_KEY', value: 'secret123' });
    expect(result).toContainEqual({ key: 'TEST_PORT', value: '3000' });
  });

  it('should produce consistent output for same environment', () => {
    vi.stubEnv('TEST_VAR', 'test');

    const result1 = readEnvironmentVariables();
    const result2 = readEnvironmentVariables();

    expect(result1).toEqual(result2);
  });
});

describe('readEnvironmentVariables - Value Transformation', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it('should transform empty strings to <empty> placeholder', () => {
    vi.stubEnv('EMPTY_VAR', '');
    vi.stubEnv('NORMAL_VAR', 'value');

    const result = readEnvironmentVariables();

    expect(result).toContainEqual({ key: 'EMPTY_VAR', value: '<empty>' });
    expect(result).toContainEqual({ key: 'NORMAL_VAR', value: 'value' });
  });
});

describe('readEnvironmentVariables - Edge Cases', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it('should preserve multiline values without modification', () => {
    const multilineValue = 'line1\nline2\nline3';
    vi.stubEnv('MULTILINE_VAR', multilineValue);

    const result = readEnvironmentVariables();

    expect(result).toContainEqual({ key: 'MULTILINE_VAR', value: multilineValue });
  });

  it('should handle very long values without truncation', () => {
    const longValue = 'a'.repeat(1000);
    vi.stubEnv('LONG_VAR', longValue);

    const result = readEnvironmentVariables();

    expect(result).toContainEqual({ key: 'LONG_VAR', value: longValue });
  });

  it('should handle special characters correctly', () => {
    vi.stubEnv('SPECIAL_KEY-123', 'value with spaces');
    vi.stubEnv('UNICODE_VAR', '日本語の値 🚀');
    vi.stubEnv('QUOTES_VAR', '"double" and \'single\' quotes');

    const result = readEnvironmentVariables();

    expect(result).toContainEqual({ key: 'SPECIAL_KEY-123', value: 'value with spaces' });
    expect(result).toContainEqual({ key: 'UNICODE_VAR', value: '日本語の値 🚀' });
    expect(result).toContainEqual({ key: 'QUOTES_VAR', value: '"double" and \'single\' quotes' });
  });

  it('should handle PATH-like variables with special delimiters', () => {
    const pathValue = '/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin';
    vi.stubEnv('PATH', pathValue);

    const result = readEnvironmentVariables();

    expect(result).toContainEqual({ key: 'PATH', value: pathValue });
  });

  // New edge case tests
  it('should handle special symbols in keys and values', () => {
    vi.stubEnv('KEY_WITH_$DOLLAR', 'value$with$dollar');
    vi.stubEnv('KEY_WITH_%PERCENT', 'value%with%percent');
    vi.stubEnv('KEY_WITH_&AMPERSAND', 'value&with&ampersand');
    vi.stubEnv('KEY_WITH_@AT', 'value@with@at');
    vi.stubEnv('KEY_WITH_!EXCLAMATION', 'value!with!exclamation');
    vi.stubEnv('KEY_WITH_#HASH', 'value#with#hash');

    const result = readEnvironmentVariables();

    expect(result).toContainEqual({ key: 'KEY_WITH_$DOLLAR', value: 'value$with$dollar' });
    expect(result).toContainEqual({ key: 'KEY_WITH_%PERCENT', value: 'value%with%percent' });
    expect(result).toContainEqual({ key: 'KEY_WITH_&AMPERSAND', value: 'value&with&ampersand' });
    expect(result).toContainEqual({ key: 'KEY_WITH_@AT', value: 'value@with@at' });
    expect(result).toContainEqual({
      key: 'KEY_WITH_!EXCLAMATION',
      value: 'value!with!exclamation',
    });
    expect(result).toContainEqual({ key: 'KEY_WITH_#HASH', value: 'value#with#hash' });
  });

  it('should handle very long key names', () => {
    const longKey = 'VERY_LONG_KEY_NAME_' + 'A'.repeat(200);
    vi.stubEnv(longKey, 'value');

    const result = readEnvironmentVariables();

    expect(result).toContainEqual({ key: longKey, value: 'value' });
  });

  it('should handle values with only spaces', () => {
    vi.stubEnv('SPACE_ONLY', '   ');
    vi.stubEnv('TAB_ONLY', '\t\t\t');
    vi.stubEnv('MIXED_WHITESPACE', ' \t \n ');

    const result = readEnvironmentVariables();

    expect(result).toContainEqual({ key: 'SPACE_ONLY', value: '   ' });
    expect(result).toContainEqual({ key: 'TAB_ONLY', value: '\t\t\t' });
    expect(result).toContainEqual({ key: 'MIXED_WHITESPACE', value: ' \t \n ' });
  });

  it('should handle values that are common in real environments', () => {
    vi.stubEnv('DATABASE_URL', 'postgres://user:password@localhost:5432/dbname');
    vi.stubEnv('JSON_CONFIG', '{"key":"value","nested":{"prop":123}}');
    vi.stubEnv('CSV_DATA', 'col1,col2,col3\nval1,val2,val3');
    vi.stubEnv('BOOLEAN_STRING', 'true');
    vi.stubEnv('NUMBER_STRING', '42');

    const result = readEnvironmentVariables();

    expect(result).toContainEqual({
      key: 'DATABASE_URL',
      value: 'postgres://user:password@localhost:5432/dbname',
    });
    expect(result).toContainEqual({
      key: 'JSON_CONFIG',
      value: '{"key":"value","nested":{"prop":123}}',
    });
    expect(result).toContainEqual({
      key: 'CSV_DATA',
      value: 'col1,col2,col3\nval1,val2,val3',
    });
    expect(result).toContainEqual({ key: 'BOOLEAN_STRING', value: 'true' });
    expect(result).toContainEqual({ key: 'NUMBER_STRING', value: '42' });
  });
});

describe('readEnvironmentVariables - Error Handling', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it('should throw appropriate error when environment reading fails', () => {
    const originalEntries = Object.entries;

    vi.spyOn(Object, 'entries').mockImplementationOnce(() => {
      throw new Error('Mock environment access error');
    });

    expect(() => readEnvironmentVariables()).toThrow(/Failed to read environment variables/);

    Object.entries = originalEntries;
  });

  it('should handle non-Error objects gracefully', () => {
    const originalEntries = Object.entries;

    vi.spyOn(Object, 'entries').mockImplementationOnce(() => {
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw 'String error';
    });

    expect(() => readEnvironmentVariables()).toThrow(/Failed to read environment variables/);

    Object.entries = originalEntries;
  });

  it('should handle Object.entries throwing an error', () => {
    // Mock Object.entries to throw an error
    const mockEntries = vi.spyOn(Object, 'entries').mockImplementation(() => {
      throw new Error('Mock Object.entries failure');
    });

    try {
      expect(() => readEnvironmentVariables()).toThrow(/Failed to read environment variables/);
      expect(() => readEnvironmentVariables()).toThrow(/Mock Object.entries failure/);
    } finally {
      mockEntries.mockRestore();
    }
  });

  it('should handle unexpected system errors during processing', () => {
    // This test validates that our error handling works for any unexpected error
    // during environment variable processing. We'll simulate this by temporarily
    // corrupting the process.env object.
    const originalDescriptor = Object.getOwnPropertyDescriptor(process, 'env');

    try {
      // Create a getter that throws an error
      Object.defineProperty(process, 'env', {
        get: () => {
          throw new TypeError('System error accessing environment');
        },
        configurable: true,
      });

      expect(() => readEnvironmentVariables()).toThrow(/Failed to read environment variables/);
      expect(() => readEnvironmentVariables()).toThrow(/System error accessing environment/);
    } finally {
      // Restore the original descriptor
      if (originalDescriptor) {
        Object.defineProperty(process, 'env', originalDescriptor);
      }
    }
  });
});
