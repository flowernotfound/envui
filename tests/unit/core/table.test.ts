import { describe, it, expect } from 'vitest';
import { createEnvironmentTable } from '../../../src/core/table.js';

describe('createEnvironmentTable', () => {
  it('should create an empty table with headers', () => {
    const table = createEnvironmentTable();

    // Check that the result is a string
    expect(typeof table).toBe('string');

    // Check that headers are present
    expect(table).toContain('KEY');
    expect(table).toContain('VALUE');
  });

  it('should contain table border characters', () => {
    const table = createEnvironmentTable();

    // Check for various border characters
    expect(table).toContain('┌');
    expect(table).toContain('┐');
    expect(table).toContain('│');
    expect(table).toContain('└');
    expect(table).toContain('┘');
    expect(table).toContain('─');
    expect(table).toContain('┬');
    expect(table).toContain('┴');
  });

  it('should create a table with data when provided', () => {
    const data = [
      { key: 'TEST_KEY', value: 'test_value' },
      { key: 'ANOTHER_KEY', value: 'another_value' },
    ];

    const table = createEnvironmentTable(data);

    // Check that data is included
    expect(table).toContain('TEST_KEY');
    expect(table).toContain('test_value');
    expect(table).toContain('ANOTHER_KEY');
    expect(table).toContain('another_value');
  });

  it('should handle empty array explicitly', () => {
    const table = createEnvironmentTable([]);

    // Should still have headers but no data rows
    expect(table).toContain('KEY');
    expect(table).toContain('VALUE');
    expect(typeof table).toBe('string');
  });

  it('should have consistent formatting', () => {
    const table1 = createEnvironmentTable();
    const table2 = createEnvironmentTable();

    // Same input should produce same output
    expect(table1).toBe(table2);
  });
});
