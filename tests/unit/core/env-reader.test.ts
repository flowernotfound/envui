import { describe, it, expect, afterEach, vi } from 'vitest';
import { readEnvironmentVariables } from '../../../src/core/env-reader.js';
import { logger } from '../../../src/utils/logger.js';

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

  it('should log and re-throw Error instances with proper message', () => {
    const errorSpy = vi.spyOn(logger, 'error').mockImplementation(() => {});
    const originalEntries = Object.entries;

    vi.spyOn(Object, 'entries').mockImplementationOnce(() => {
      throw new Error('Mock environment access error');
    });

    expect(() => readEnvironmentVariables()).toThrow(
      'Error: Failed to read environment variables: Mock environment access error',
    );

    expect(errorSpy).toHaveBeenCalledWith(
      'Error: Failed to read environment variables: Mock environment access error',
    );

    Object.entries = originalEntries;
    errorSpy.mockRestore();
  });

  it('should handle non-Error objects gracefully', () => {
    const errorSpy = vi.spyOn(logger, 'error').mockImplementation(() => {});
    const originalEntries = Object.entries;

    vi.spyOn(Object, 'entries').mockImplementationOnce(() => {
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw 'String error';
    });

    expect(() => readEnvironmentVariables()).toThrow(
      'Error: Failed to read environment variables: Unknown error occurred',
    );

    expect(errorSpy).toHaveBeenCalledWith(
      'Error: Failed to read environment variables: Unknown error occurred',
    );

    Object.entries = originalEntries;
    errorSpy.mockRestore();
  });

  it('should handle system permission errors properly', () => {
    const errorSpy = vi.spyOn(logger, 'error').mockImplementation(() => {});
    const originalEntries = Object.entries;

    vi.spyOn(Object, 'entries').mockImplementationOnce(() => {
      const error = new Error('EPERM: operation not permitted');
      error.name = 'SystemError';
      throw error;
    });

    expect(() => readEnvironmentVariables()).toThrow(
      'Error: Failed to read environment variables: EPERM: operation not permitted',
    );

    expect(errorSpy).toHaveBeenCalledWith(
      'Error: Failed to read environment variables: EPERM: operation not permitted',
    );

    Object.entries = originalEntries;
    errorSpy.mockRestore();
  });

  it('should handle access denied errors properly', () => {
    const errorSpy = vi.spyOn(logger, 'error').mockImplementation(() => {});
    const originalEntries = Object.entries;

    vi.spyOn(Object, 'entries').mockImplementationOnce(() => {
      const error = new Error('EACCES: permission denied');
      error.name = 'SystemError';
      throw error;
    });

    expect(() => readEnvironmentVariables()).toThrow(
      'Error: Failed to read environment variables: EACCES: permission denied',
    );

    expect(errorSpy).toHaveBeenCalledWith(
      'Error: Failed to read environment variables: EACCES: permission denied',
    );

    Object.entries = originalEntries;
    errorSpy.mockRestore();
  });

  it('should handle process.env undefined edge case', () => {
    const errorSpy = vi.spyOn(logger, 'error').mockImplementation(() => {});
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

    errorSpy.mockRestore();
  });

  it('should handle process.env null edge case', () => {
    const errorSpy = vi.spyOn(logger, 'error').mockImplementation(() => {});
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

    errorSpy.mockRestore();
  });

  it('should handle memory allocation errors', () => {
    const errorSpy = vi.spyOn(logger, 'error').mockImplementation(() => {});
    const originalEntries = Object.entries;

    vi.spyOn(Object, 'entries').mockImplementationOnce(() => {
      const error = new Error('Cannot allocate memory');
      error.name = 'Error';
      throw error;
    });

    expect(() => readEnvironmentVariables()).toThrow(
      'Error: Failed to read environment variables: Cannot allocate memory',
    );

    expect(errorSpy).toHaveBeenCalledWith(
      'Error: Failed to read environment variables: Cannot allocate memory',
    );

    Object.entries = originalEntries;
    errorSpy.mockRestore();
  });

  it('should handle numeric error codes', () => {
    const errorSpy = vi.spyOn(logger, 'error').mockImplementation(() => {});
    const originalEntries = Object.entries;

    vi.spyOn(Object, 'entries').mockImplementationOnce(() => {
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw 42; // Numeric error
    });

    expect(() => readEnvironmentVariables()).toThrow(
      'Error: Failed to read environment variables: Unknown error occurred',
    );

    expect(errorSpy).toHaveBeenCalledWith(
      'Error: Failed to read environment variables: Unknown error occurred',
    );

    Object.entries = originalEntries;
    errorSpy.mockRestore();
  });

  it('should preserve original error stack trace in logged message', () => {
    const errorSpy = vi.spyOn(logger, 'error').mockImplementation(() => {});
    const originalEntries = Object.entries;

    const customError = new Error('Custom stack trace error');
    customError.stack = 'Custom Stack\n  at someFunction\n  at anotherFunction';

    vi.spyOn(Object, 'entries').mockImplementationOnce(() => {
      throw customError;
    });

    expect(() => readEnvironmentVariables()).toThrow(
      'Error: Failed to read environment variables: Custom stack trace error',
    );

    expect(errorSpy).toHaveBeenCalledWith(
      'Error: Failed to read environment variables: Custom stack trace error',
    );

    Object.entries = originalEntries;
    errorSpy.mockRestore();
  });
});
