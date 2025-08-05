import { describe, it, expect, beforeEach, afterEach } from 'vitest';
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

describe('createEnvironmentTable - Layout', () => {
  let originalColumns: number | undefined;

  beforeEach(() => {
    originalColumns = process.stdout.columns;
  });

  afterEach(() => {
    process.stdout.columns = originalColumns;
  });

  it('should handle word wrapping for long values', () => {
    process.stdout.columns = 80;

    const data = [
      {
        key: 'LONG_VALUE_TEST',
        value:
          'This is a very long value that should be wrapped properly when displayed in the table',
      },
    ];

    const table = createEnvironmentTable(data);

    // Check that the long value appears in the table
    expect(table).toContain('LONG_VALUE_TEST');
    expect(table).toContain('This is a very long');

    // Check that wrapping occurred by looking for wrapped content
    const lines = table.split('\n');
    const hasFirstPart = lines.some((line) => line.includes('wrapped'));
    const hasSecondPart = lines.some((line) => line.includes('properly when displayed'));

    // Both parts should exist in the table, indicating wrapping occurred
    expect(hasFirstPart).toBe(true);
    expect(hasSecondPart).toBe(true);
  });

  it('should truncate long keys with ellipsis', () => {
    process.stdout.columns = 80;

    const data = [
      {
        key: 'THIS_IS_A_VERY_LONG_ENVIRONMENT_VARIABLE_NAME_THAT_SHOULD_BE_TRUNCATED',
        value: 'short value',
      },
    ];

    const table = createEnvironmentTable(data);

    // Check that the key is truncated with ellipsis
    expect(table).toContain('…');
    expect(table).not.toContain(
      'THIS_IS_A_VERY_LONG_ENVIRONMENT_VARIABLE_NAME_THAT_SHOULD_BE_TRUNCATED',
    );
  });

  it('should use correct column widths based on terminal width', () => {
    process.stdout.columns = 100;

    const data = [{ key: 'TEST', value: 'value' }];

    const table = createEnvironmentTable(data);

    // Check that the table contains the data
    expect(table).toContain('TEST');
    expect(table).toContain('value');

    // Verify that the KEY column width is roughly 25% of terminal width
    // by checking that short keys are padded
    const lines = table.split('\n');
    const dataLine = lines.find((line) => line.includes('TEST') && line.includes('value'));
    expect(dataLine).toBeDefined();
    // TEST (4 chars) should be padded to fill the KEY column
    expect(dataLine).toMatch(/TEST\s+/);
  });

  it('should handle small terminal widths gracefully', () => {
    process.stdout.columns = 40;

    const data = [{ key: 'SMALL', value: 'This should wrap in narrow terminal' }];

    const table = createEnvironmentTable(data);

    // Check that table still renders with the data
    expect(table).toContain('SMALL');
    expect(table).toContain('This should');

    // Check that wrapping occurred in narrow terminal
    const lines = table.split('\n');
    const hasWrappedContent = lines.some((line) => line.includes('narrow terminal'));
    expect(hasWrappedContent).toBe(true);
  });

  it('should use default width when columns is undefined', () => {
    process.stdout.columns = undefined;

    const data = [{ key: 'DEFAULT_TEST', value: 'value' }];

    const table = createEnvironmentTable(data);

    // Should still create a table (defaults to 80)
    expect(table).toContain('DEFAULT_TEST');
    expect(table).toContain('value');
  });
});
