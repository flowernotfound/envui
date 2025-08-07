import { describe, it, expect, afterEach, vi } from 'vitest';
import { readEnvironmentVariables } from '../../src/core/env-reader.js';
import { createEnvironmentTable } from '../../src/core/table.js';
import {
  tableContainsKey,
  tableHasValidStructure,
  tableContainsDataPair,
} from '../utils/tableTestHelpers.js';

describe('CLI Integration - End-to-End Workflow', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('should complete full workflow: read variables and display in table', () => {
    // Setup test environment
    vi.stubEnv('TEST_INTEGRATION_VAR', 'test_value');
    vi.stubEnv('ANOTHER_VAR', 'another_value');

    // Execute workflow
    const envData = readEnvironmentVariables();
    const table = createEnvironmentTable(envData);

    // Verify end result
    expect(tableHasValidStructure(table)).toBe(true);
    expect(tableContainsDataPair(table, 'TEST_INTEGRATION_VAR', 'test_value')).toBe(true);
    expect(tableContainsDataPair(table, 'ANOTHER_VAR', 'another_value')).toBe(true);
  });

  it('should handle empty values in complete workflow', () => {
    vi.stubEnv('TEST_EMPTY_VAR', '');
    vi.stubEnv('TEST_NORMAL_VAR', 'normal');

    const envData = readEnvironmentVariables();
    const table = createEnvironmentTable(envData);

    // Verify transformation is applied and displayed
    expect(tableContainsKey(table, 'TEST_EMPTY_VAR')).toBe(true);
    expect(table).toContain('<empty>');
    expect(tableContainsDataPair(table, 'TEST_NORMAL_VAR', 'normal')).toBe(true);
  });

  it('should preserve complex values through entire pipeline', () => {
    const multilineValue = 'line1\nline2\nline3';
    const unicodeValue = '日本語 🚀 emoji';

    vi.stubEnv('TEST_MULTILINE_VAR', multilineValue);
    vi.stubEnv('TEST_UNICODE_VAR', unicodeValue);

    const envData = readEnvironmentVariables();
    const table = createEnvironmentTable(envData);

    // Verify complex data is preserved
    expect(tableContainsKey(table, 'TEST_MULTILINE_VAR')).toBe(true);
    expect(table).toContain('line1');
    expect(table).toContain('line2');
    expect(table).toContain('line3');

    expect(tableContainsKey(table, 'TEST_UNICODE_VAR')).toBe(true);
    expect(table).toContain(unicodeValue);
  });

  it('should handle large datasets efficiently', () => {
    // Create multiple environment variables
    for (let i = 0; i < 20; i++) {
      vi.stubEnv(`TEST_VAR_${i}`, `value_${i}`);
    }

    const envData = readEnvironmentVariables();
    const table = createEnvironmentTable(envData);

    // Verify all data is present
    expect(tableHasValidStructure(table)).toBe(true);
    for (let i = 0; i < 20; i++) {
      expect(tableContainsKey(table, `TEST_VAR_${i}`)).toBe(true);
    }
  });

  it('should handle very long values with proper display', () => {
    const longValue = 'x'.repeat(200);
    vi.stubEnv('TEST_LONG_VAR', longValue);

    const envData = readEnvironmentVariables();
    const table = createEnvironmentTable(envData);

    // Verify long value is handled
    expect(tableContainsKey(table, 'TEST_LONG_VAR')).toBe(true);
    // Value should be present (though may be wrapped)
    const xCount = (table.match(/x/g) || []).length;
    expect(xCount).toBeGreaterThan(50); // At least some content is shown
  });
});
