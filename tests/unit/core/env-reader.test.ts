import { describe, it, expect, afterEach, vi } from 'vitest';
import { readEnvironmentVariables } from '../../../src/core/env-reader.js';

describe('readEnvironmentVariables', () => {
  afterEach(() => {
    // Restore environment after each test
    vi.unstubAllEnvs();
  });

  it('should return an array containing environment variables', () => {
    const result = readEnvironmentVariables();

    // Check that it returns an array
    expect(Array.isArray(result)).toBe(true);

    // In a real environment, there should be at least some env vars
    expect(result.length).toBeGreaterThan(0);
  });

  it('should read stubbed environment variables correctly', () => {
    // Mock environment variables
    vi.stubEnv('TEST_NODE_ENV', 'test');
    vi.stubEnv('TEST_API_KEY', 'secret123');
    vi.stubEnv('TEST_PORT', '3000');

    const result = readEnvironmentVariables();

    // Check that our stubbed values are included
    expect(result).toContainEqual({ key: 'TEST_NODE_ENV', value: 'test' });
    expect(result).toContainEqual({ key: 'TEST_API_KEY', value: 'secret123' });
    expect(result).toContainEqual({ key: 'TEST_PORT', value: '3000' });
  });

  it('should handle empty string values and display as <empty>', () => {
    vi.stubEnv('EMPTY_VAR', '');
    vi.stubEnv('NORMAL_VAR', 'value');

    const result = readEnvironmentVariables();

    expect(result).toContainEqual({ key: 'EMPTY_VAR', value: '<empty>' });
    expect(result).toContainEqual({ key: 'NORMAL_VAR', value: 'value' });
  });

  it('should preserve multiline values', () => {
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

  it('should handle special characters in keys and values', () => {
    vi.stubEnv('SPECIAL_KEY-123', 'value with spaces');
    vi.stubEnv('UNICODE_VAR', '日本語の値 🚀');
    vi.stubEnv('QUOTES_VAR', '"double" and \'single\' quotes');

    const result = readEnvironmentVariables();

    expect(result).toContainEqual({ key: 'SPECIAL_KEY-123', value: 'value with spaces' });
    expect(result).toContainEqual({ key: 'UNICODE_VAR', value: '日本語の値 🚀' });
    expect(result).toContainEqual({ key: 'QUOTES_VAR', value: '"double" and \'single\' quotes' });
  });

  it('should return consistent data structure', () => {
    vi.stubEnv('TEST_VAR', 'test');

    const result = readEnvironmentVariables();

    expect(Array.isArray(result)).toBe(true);
    result.forEach((item) => {
      expect(item).toHaveProperty('key');
      expect(item).toHaveProperty('value');
      expect(typeof item.key).toBe('string');
      expect(typeof item.value).toBe('string');
    });
  });

  it('should handle PATH-like variables with colons and semicolons', () => {
    const pathValue = '/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin';
    vi.stubEnv('PATH', pathValue);

    const result = readEnvironmentVariables();

    expect(result).toContainEqual({ key: 'PATH', value: pathValue });
  });
});
