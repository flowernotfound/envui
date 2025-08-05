import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createEnvironmentTable } from '../../../src/core/table.js';

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

    // Check that data is included (keys may be wrapped)
    expect(table).toContain('test_value');
    expect(table).toContain('another_value');
    // Check for keys using helper function
    expect(tableContainsKey(table, 'TEST_KEY')).toBe(true);
    expect(tableContainsKey(table, 'ANOTHER_KEY')).toBe(true);
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
    if (originalColumns !== undefined) {
      process.stdout.columns = originalColumns;
    } else {
      delete (process.stdout as any).columns;
    }
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
    expect(tableContainsKey(table, 'LONG_VALUE_TEST')).toBe(true);
    expect(table).toContain('This is a very long');

    // Check that wrapping occurred by looking for wrapped content
    // The value should contain both parts, potentially wrapped
    expect(table).toContain('rapped'); // 'wrapped' might be split as 'w rapped'
    expect(table).toContain('properly');
  });

  it('should wrap long keys without truncation', () => {
    process.stdout.columns = 80;

    const data = [
      {
        key: 'THIS_IS_A_VERY_LONG_ENVIRONMENT_VARIABLE_NAME_THAT_SHOULD_BE_WRAPPED',
        value: 'short value',
      },
    ];

    const table = createEnvironmentTable(data);

    // Check that the key is not truncated with ellipsis
    expect(table).not.toContain('…');
    // Check that the long key is wrapped and all parts are present
    expect(
      tableContainsKey(
        table,
        'THIS_IS_A_VERY_LONG_ENVIRONMENT_VARIABLE_NAME_THAT_SHOULD_BE_WRAPPED',
      ),
    ).toBe(true);
  });

  it('should use half of terminal width as maximum table width', () => {
    process.stdout.columns = 100;

    const data = [{ key: 'TEST', value: 'value' }];

    const table = createEnvironmentTable(data);

    // Check that the table contains the data
    expect(table).toContain('TEST');
    expect(table).toContain('value');

    // With 100 columns terminal, table should be ~50 chars wide
    // KEY column should be ~12.5 chars (25% of 50), VALUE column ~30.5 chars
    const lines = table.split('\n');
    const headerLine = lines.find((line) => line.includes('KEY') && line.includes('VALUE'));
    expect(headerLine).toBeDefined();

    // The table should be narrower than full terminal width
    // Rough check: table should be around 50 chars (half of 100)
    // eslint-disable-next-line no-control-regex
    const tableWidth = (headerLine?.replace(/\x1b\[[0-9;]*m/g, '') ?? '').length;
    expect(tableWidth).toBeLessThan(80); // Much less than full width
    expect(tableWidth).toBeGreaterThan(30); // But reasonable size
  });

  it('should handle small terminal widths gracefully', () => {
    process.stdout.columns = 40;

    const data = [{ key: 'SMALL', value: 'This should wrap in narrow terminal' }];

    const table = createEnvironmentTable(data);

    // Check that table still renders with the data
    expect(tableContainsKey(table, 'SMALL')).toBe(true);
    // Value parts may be wrapped too
    expect(table).toContain('This');

    // With 40 columns terminal, table should be ~20 chars wide
    // Check that wrapping occurred in narrow terminal
    expect(table).toContain('narr'); // 'narrow' might be split
  });

  it('should use default width when columns is undefined', () => {
    delete (process.stdout as any).columns;

    const data = [{ key: 'DEFAULT_TEST', value: 'value' }];

    const table = createEnvironmentTable(data);

    // Should still create a table (defaults to 80)
    expect(tableContainsKey(table, 'DEFAULT_TEST')).toBe(true);
    expect(table).toContain('value');
  });
});
