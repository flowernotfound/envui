import { describe, it, expect } from 'vitest';
import { generateDummyEnvironmentData } from '../../src/utils/dummyData.js';
import { createEnvironmentTable } from '../../src/core/table.js';

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

    // Check that dummy data appears in table output
    expect(table).toContain('NORMAL_VAR');
    expect(table).toContain('normal_value');
    expect(table).toContain('EMPTY_VAR');
    expect(table).toContain('SPACE_VAR');
    expect(table).toContain('MULTILINE_VAR');
    expect(table).toContain('SPECIAL_CHARS');
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
    expect(table).toContain('EMPTY_VAR');

    // The table should contain the key even when value is empty
    const lines = table.split('\n');
    const emptyVarLine = lines.find((line) => line.includes('EMPTY_VAR'));
    expect(emptyVarLine).toBeDefined();
  });

  it('should handle special characters in table display', () => {
    const dummyData = generateDummyEnvironmentData();
    const table = createEnvironmentTable(dummyData);

    // Check that special characters are displayed correctly
    expect(table).toContain('test@#$%^&*()');
  });
});
