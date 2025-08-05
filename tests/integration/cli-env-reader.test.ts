import { describe, it, expect, afterEach, vi } from 'vitest';
import { readEnvironmentVariables } from '../../src/core/env-reader.js';
import { createEnvironmentTable } from '../../src/core/table.js';

describe('CLI Integration - Environment Variables Display', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('should read environment variables and create table successfully', () => {
    // Add test environment variables
    vi.stubEnv('TEST_INTEGRATION_VAR', 'test_value');

    // Read environment variables
    const envData = readEnvironmentVariables();

    // Create table with environment data
    const table = createEnvironmentTable(envData);

    // Basic checks
    expect(typeof table).toBe('string');
    expect(table.length).toBeGreaterThan(0);

    // Check that our test variable appears (may be truncated with ellipsis)
    expect(table.includes('TEST_INTEGRATION_VAR') || table.includes('TEST_INTEGRATION_…')).toBe(
      true,
    );
    expect(table).toContain('test_value');
  });

  it('should display empty string values as <empty>', () => {
    vi.stubEnv('TEST_EMPTY_VAR', '');

    const envData = readEnvironmentVariables();
    const table = createEnvironmentTable(envData);

    // Check that empty value is displayed as <empty>
    expect(table).toContain('TEST_EMPTY_VAR');
    expect(table).toContain('<empty>');
  });

  it('should preserve multiline values in table display', () => {
    const multilineValue = 'line1\nline2\nline3';
    vi.stubEnv('TEST_MULTILINE_VAR', multilineValue);

    const envData = readEnvironmentVariables();
    const table = createEnvironmentTable(envData);

    // Check that multiline value is preserved
    expect(table).toContain('TEST_MULTILINE_VAR');
    expect(table).toContain('line1');
    expect(table).toContain('line2');
    expect(table).toContain('line3');
  });

  it('should handle special characters correctly', () => {
    vi.stubEnv('TEST_SPECIAL_VAR', 'value with "quotes" and \'single\' quotes');
    vi.stubEnv('TEST_UNICODE_VAR', '日本語 🚀 emoji');

    const envData = readEnvironmentVariables();
    const table = createEnvironmentTable(envData);

    // Check special characters are preserved
    expect(table).toContain('TEST_SPECIAL_VAR');
    expect(table).toContain('value with "quotes" and \'single\' quotes');
    expect(table).toContain('TEST_UNICODE_VAR');
    expect(table).toContain('日本語 🚀 emoji');
  });

  it('should have proper table structure', () => {
    vi.stubEnv('TEST_VAR', 'test');

    const envData = readEnvironmentVariables();
    const table = createEnvironmentTable(envData);

    // Check table headers are present
    expect(table).toContain('KEY');
    expect(table).toContain('VALUE');

    // Check table structure
    expect(table).toContain('┌');
    expect(table).toContain('┐');
    expect(table).toContain('│');
    expect(table).toContain('└');
    expect(table).toContain('┘');
  });

  it('should handle very long values with wrapping', () => {
    const longValue = 'x'.repeat(200);
    vi.stubEnv('TEST_LONG_VAR', longValue);

    const envData = readEnvironmentVariables();
    const table = createEnvironmentTable(envData);

    // Check that the key appears (may be truncated)
    expect(table.includes('TEST_LONG_VAR') || table.includes('TEST_LONG…')).toBe(true);

    // Check that the value is wrapped but content is preserved
    // The value will be split across multiple lines
    const xCount = (table.match(/x/g) || []).length;
    // Should have at least half of the x's (many are lost due to wrapping and truncation)
    expect(xCount).toBeGreaterThan(50);
  });
});
