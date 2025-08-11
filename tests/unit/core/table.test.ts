import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createEnvironmentTable } from '../../../src/core/table.js';
import {
  tableContainsKey,
  tableHasValidStructure,
  tableContainsDataPair,
  isValidTableOutput,
} from '../../utils/tableTestHelpers.js';

describe('createEnvironmentTable - Basic Structure', () => {
  it('should create a valid table with proper structure', () => {
    const table = createEnvironmentTable();

    expect(isValidTableOutput(table)).toBe(true);
    expect(tableHasValidStructure(table)).toBe(true);
  });

  it('should display environment data correctly', () => {
    const data = [
      { key: 'TEST_KEY', value: 'test_value' },
      { key: 'ANOTHER_KEY', value: 'another_value' },
    ];

    const table = createEnvironmentTable(data);

    expect(tableHasValidStructure(table)).toBe(true);
    expect(tableContainsDataPair(table, 'TEST_KEY', 'test_value')).toBe(true);
    expect(tableContainsDataPair(table, 'ANOTHER_KEY', 'another_value')).toBe(true);
  });

  it('should handle empty data gracefully', () => {
    const table = createEnvironmentTable([]);

    expect(isValidTableOutput(table)).toBe(true);
    expect(tableHasValidStructure(table)).toBe(true);
  });

  it('should produce consistent output for same input', () => {
    const table1 = createEnvironmentTable();
    const table2 = createEnvironmentTable();

    expect(table1).toBe(table2);
  });
});

describe('createEnvironmentTable - Responsive Layout', () => {
  let originalColumns: number | undefined;

  beforeEach(() => {
    originalColumns = process.stdout.columns;
  });

  afterEach(() => {
    if (originalColumns !== undefined) {
      process.stdout.columns = originalColumns;
    } else {
      delete (process.stdout as { columns?: number }).columns;
    }
  });

  it('should handle long values with appropriate wrapping', () => {
    process.stdout.columns = 80;

    const data = [
      {
        key: 'LONG_VALUE_TEST',
        value:
          'This is a very long value that should be wrapped properly when displayed in the table',
      },
    ];

    const table = createEnvironmentTable(data);

    expect(tableHasValidStructure(table)).toBe(true);
    expect(tableContainsKey(table, 'LONG_VALUE_TEST')).toBe(true);
    // Check that the value content is preserved (not checking exact wrapping)
    expect(table).toContain('This is a very long');
    expect(table).toContain('properly');
  });

  it('should handle long keys without truncation', () => {
    process.stdout.columns = 80;

    const longKey = 'THIS_IS_A_VERY_LONG_ENVIRONMENT_VARIABLE_NAME_THAT_SHOULD_BE_WRAPPED';
    const data = [
      {
        key: longKey,
        value: 'short value',
      },
    ];

    const table = createEnvironmentTable(data);

    expect(tableHasValidStructure(table)).toBe(true);
    expect(tableContainsKey(table, longKey)).toBe(true);
    expect(table).not.toContain('…'); // No truncation
    expect(table).toContain('short value');
  });

  it('should adapt to different terminal widths', () => {
    const data = [{ key: 'TEST', value: 'value' }];

    // Test with standard width
    process.stdout.columns = 100;
    const standardTable = createEnvironmentTable(data);
    expect(tableHasValidStructure(standardTable)).toBe(true);
    expect(tableContainsDataPair(standardTable, 'TEST', 'value')).toBe(true);

    // Test with narrow width
    process.stdout.columns = 40;
    const narrowTable = createEnvironmentTable(data);
    expect(tableHasValidStructure(narrowTable)).toBe(true);
    expect(tableContainsDataPair(narrowTable, 'TEST', 'value')).toBe(true);
  });

  it('should handle narrow terminals gracefully', () => {
    process.stdout.columns = 40;

    const data = [{ key: 'SMALL', value: 'This should wrap in narrow terminal' }];

    const table = createEnvironmentTable(data);

    // Verify that table renders correctly in narrow terminal
    // without checking specific word boundaries
    expect(tableHasValidStructure(table)).toBe(true);
    expect(tableContainsKey(table, 'SMALL')).toBe(true);
    expect(isValidTableOutput(table)).toBe(true);
  });

  it('should use default width when terminal width is undefined', () => {
    delete (process.stdout as { columns?: number }).columns;

    const data = [{ key: 'DEFAULT_TEST', value: 'value' }];

    const table = createEnvironmentTable(data);

    expect(tableHasValidStructure(table)).toBe(true);
    expect(tableContainsDataPair(table, 'DEFAULT_TEST', 'value')).toBe(true);
  });
});

describe('createEnvironmentTable - Edge Cases', () => {
  it('should handle very long values (200-300 characters)', () => {
    const longValue = 'a'.repeat(250);
    const data = [{ key: 'VERY_LONG_VALUE', value: longValue }];

    const table = createEnvironmentTable(data);

    expect(tableHasValidStructure(table)).toBe(true);
    expect(tableContainsKey(table, 'VERY_LONG_VALUE')).toBe(true);
    // Verify that at least part of the long value is present
    expect(table).toContain('aaa');
  });

  it('should handle multiple long values with proper width adjustment', () => {
    const longValue1 = 'This is a very long value that needs to be wrapped ' + 'x'.repeat(150);
    const longValue2 = 'Another long value with different content ' + 'y'.repeat(150);
    const data = [
      { key: 'LONG_VALUE_1', value: longValue1 },
      { key: 'LONG_VALUE_2', value: longValue2 },
      { key: 'SHORT', value: 'short' },
    ];

    const table = createEnvironmentTable(data);

    expect(tableHasValidStructure(table)).toBe(true);
    expect(tableContainsKey(table, 'LONG_VALUE_1')).toBe(true);
    expect(tableContainsKey(table, 'LONG_VALUE_2')).toBe(true);
    expect(tableContainsKey(table, 'SHORT')).toBe(true);
  });

  it('should handle special symbols in values', () => {
    const data = [
      { key: 'DOLLAR_SIGN', value: '$100.00' },
      { key: 'PERCENT', value: '50% complete' },
      { key: 'AMPERSAND', value: 'A & B' },
      { key: 'AT_SIGN', value: 'user@example.com' },
      { key: 'EXCLAMATION', value: 'Hello!' },
      { key: 'HASH', value: '#hashtag' },
      { key: 'MIXED_SYMBOLS', value: '$#@!%&*()_+=' },
    ];

    const table = createEnvironmentTable(data);

    expect(tableHasValidStructure(table)).toBe(true);
    expect(tableContainsDataPair(table, 'DOLLAR_SIGN', '$100.00')).toBe(true);
    expect(tableContainsDataPair(table, 'PERCENT', '50% complete')).toBe(true);
    expect(tableContainsDataPair(table, 'AMPERSAND', 'A & B')).toBe(true);
    expect(tableContainsDataPair(table, 'AT_SIGN', 'user@example.com')).toBe(true);
    expect(tableContainsDataPair(table, 'EXCLAMATION', 'Hello!')).toBe(true);
    expect(tableContainsDataPair(table, 'HASH', '#hashtag')).toBe(true);
    expect(tableContainsDataPair(table, 'MIXED_SYMBOLS', '$#@!%&*()_+=')).toBe(true);
  });

  it('should handle edge case values correctly', () => {
    const data = [
      { key: 'EMPTY_VALUE', value: '<empty>' },
      { key: 'SPACE_VALUE', value: '   ' },
      { key: 'TAB_VALUE', value: '\t\t' },
      { key: 'NEWLINE_VALUE', value: 'line1\nline2' },
      { key: 'BOOLEAN_TRUE', value: 'true' },
      { key: 'BOOLEAN_FALSE', value: 'false' },
      { key: 'NUMBER', value: '42' },
      { key: 'URL', value: 'https://example.com/path?query=value' },
    ];

    const table = createEnvironmentTable(data);

    expect(tableHasValidStructure(table)).toBe(true);
    // Check that all keys are present
    data.forEach(({ key }) => {
      expect(tableContainsKey(table, key)).toBe(true);
    });
  });

  it('should handle mix of very short and very long values', () => {
    const data = [
      { key: 'A', value: 'x' },
      { key: 'VERY_LONG_KEY_NAME_THAT_IS_EXTREMELY_VERBOSE', value: 'y'.repeat(200) },
      { key: 'B', value: 'z' },
    ];

    const table = createEnvironmentTable(data);

    expect(tableHasValidStructure(table)).toBe(true);
    expect(tableContainsKey(table, 'A')).toBe(true);
    expect(tableContainsKey(table, 'VERY_LONG_KEY_NAME_THAT_IS_EXTREMELY_VERBOSE')).toBe(true);
    expect(tableContainsKey(table, 'B')).toBe(true);
  });
});

describe('createEnvironmentTable - Error Handling', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it('should throw error when columnWidthCalculator fails', async () => {
    // Mock calculateColumnWidths to throw error
    const mockCalculateColumnWidths = vi
      .spyOn(await import('../../../src/utils/columnWidthCalculator.js'), 'calculateColumnWidths')
      .mockImplementation(() => {
        throw new Error('Column width calculation failed');
      });

    try {
      expect(() => createEnvironmentTable([{ key: 'TEST', value: 'value' }])).toThrow(
        /Failed to create table/,
      );
    } finally {
      mockCalculateColumnWidths.mockRestore();
    }
  });

  it('should throw error when tableRenderer fails', async () => {
    // Mock renderEnvironmentTable to throw error
    const mockRenderTable = vi
      .spyOn(await import('../../../src/utils/tableRenderer.js'), 'renderEnvironmentTable')
      .mockImplementation(() => {
        throw new Error('Table rendering failed');
      });

    try {
      expect(() => createEnvironmentTable([{ key: 'TEST', value: 'value' }])).toThrow(
        /Failed to create table/,
      );
    } finally {
      mockRenderTable.mockRestore();
    }
  });

  it('should handle non-Error objects in table creation', async () => {
    // Mock calculateColumnWidths to throw non-Error object
    const mockCalculateColumnWidths = vi
      .spyOn(await import('../../../src/utils/columnWidthCalculator.js'), 'calculateColumnWidths')
      .mockImplementation(() => {
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw 'String error in column calculation';
      });

    try {
      expect(() => createEnvironmentTable([{ key: 'TEST', value: 'value' }])).toThrow(
        /Failed to create table/,
      );
    } finally {
      mockCalculateColumnWidths.mockRestore();
    }
  });
});
