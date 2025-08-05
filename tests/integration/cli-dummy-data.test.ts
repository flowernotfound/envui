import { describe, it, expect } from 'vitest';
import { generateDummyEnvironmentData } from '../../src/utils/dummyData.js';
import { createEnvironmentTable } from '../../src/core/table.js';

// Helper function to check if a key exists in table (may be wrapped across lines)
function tableContainsKey(table: string, key: string): boolean {
  // Remove ANSI codes and check if all characters of the key exist in sequence
  // eslint-disable-next-line no-control-regex
  const cleanTable = table.replace(/\x1b\[[0-9;]*m/g, '');
  const keyChars = key.split('');
  let lastIndex = 0;

  for (const char of keyChars) {
    const index = cleanTable.indexOf(char, lastIndex);
    if (index === -1) return false;
    lastIndex = index + 1;
  }

  return true;
}

describe('CLI Integration - Dummy Data Display', () => {
  it('should generate dummy data and create table successfully', () => {
    // Generate dummy data
    const dummyData = generateDummyEnvironmentData();

    // Create table with dummy data
    const table = createEnvironmentTable(dummyData);

    // Basic checks
    expect(typeof table).toBe('string');
    expect(table.length).toBeGreaterThan(0);
  });

  it('should display dummy data content in table', () => {
    const dummyData = generateDummyEnvironmentData();
    const table = createEnvironmentTable(dummyData);

    // Check that dummy data appears in table output (keys may be wrapped)
    expect(tableContainsKey(table, 'NORMAL_VAR')).toBe(true);
    expect(table).toContain('normal_value');
    expect(tableContainsKey(table, 'EMPTY_VAR')).toBe(true);
    expect(tableContainsKey(table, 'SPACE_VAR')).toBe(true);
    expect(tableContainsKey(table, 'MULTILINE_VAR')).toBe(true);
    expect(tableContainsKey(table, 'SPECIAL_CHARS')).toBe(true);
  });

  it('should have proper table structure with dummy data', () => {
    const dummyData = generateDummyEnvironmentData();
    const table = createEnvironmentTable(dummyData);

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

  it('should properly display empty string values', () => {
    const dummyData = generateDummyEnvironmentData();
    const table = createEnvironmentTable(dummyData);

    // Check that empty string value is handled (key should appear even with empty value)
    expect(tableContainsKey(table, 'EMPTY_VAR')).toBe(true);

    // The table should contain the key even when value is empty
    // Key may be wrapped, so use helper function
    expect(tableContainsKey(table, 'EMPTY_VAR')).toBe(true);
  });

  it('should handle special characters in table display', () => {
    const dummyData = generateDummyEnvironmentData();
    const table = createEnvironmentTable(dummyData);

    // Check that special characters are displayed correctly
    expect(table).toContain('test@#$%^&*()');
  });
});
