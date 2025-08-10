import { describe, it, expect, afterEach, vi } from 'vitest';
import { readEnvironmentVariables } from '../../../src/core/env-reader.js';

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

  it('should handle process.env undefined edge case', () => {
    const originalProcessEnv = process.env;

    // Mock process.env to be undefined
    Object.defineProperty(process, 'env', {
      value: undefined,
      writable: true,
      configurable: true,
    });

    // Function should handle undefined process.env gracefully
    const result = readEnvironmentVariables();
    expect(result).toEqual([]);

    // Restore original process.env
    Object.defineProperty(process, 'env', {
      value: originalProcessEnv,
      writable: true,
      configurable: true,
    });
  });

  it('should handle process.env null edge case', () => {
    const originalProcessEnv = process.env;

    // Mock process.env to be null
    Object.defineProperty(process, 'env', {
      value: null,
      writable: true,
      configurable: true,
    });

    // Function should handle null process.env gracefully
    const result = readEnvironmentVariables();
    expect(result).toEqual([]);

    // Restore original process.env
    Object.defineProperty(process, 'env', {
      value: originalProcessEnv,
      writable: true,
      configurable: true,
    });
  });
});
