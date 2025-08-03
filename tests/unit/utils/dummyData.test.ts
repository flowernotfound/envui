import { describe, it, expect } from 'vitest';
import {
  generateDummyEnvironmentData,
  type EnvironmentData,
} from '../../../src/utils/dummyData.js';

describe('generateDummyEnvironmentData', () => {
  it('should return array of dummy environment data', () => {
    const data = generateDummyEnvironmentData();

    expect(Array.isArray(data)).toBe(true);
    expect(data).toHaveLength(5);
  });

  it('should return correct dummy data structure', () => {
    const data = generateDummyEnvironmentData();

    // Check that all items have key and value properties
    data.forEach((item: EnvironmentData) => {
      expect(item).toHaveProperty('key');
      expect(item).toHaveProperty('value');
      expect(typeof item.key).toBe('string');
      expect(typeof item.value).toBe('string');
      expect(item.key).toBeTruthy(); // key should never be empty
      // Note: value can be empty string, so we don't check toBeTruthy
    });
  });

  it('should return expected dummy data values', () => {
    const data = generateDummyEnvironmentData();

    expect(data).toEqual([
      { key: 'NORMAL_VAR', value: 'normal_value' },
      { key: 'EMPTY_VAR', value: '' },
      { key: 'SPACE_VAR', value: ' ' },
      { key: 'MULTILINE_VAR', value: 'line1\nline2' },
      { key: 'SPECIAL_CHARS', value: 'test@#$%^&*()' },
    ]);
  });

  it('should be compatible with createEnvironmentTable function', () => {
    const data = generateDummyEnvironmentData();

    // Ensure data format matches expected table input format
    data.forEach((item: EnvironmentData) => {
      expect(item).toMatchObject({
        key: expect.any(String),
        value: expect.any(String),
      });
    });
  });

  it('should handle empty string values correctly', () => {
    const data = generateDummyEnvironmentData();

    // Find the empty value case
    const emptyVar = data.find((item) => item.key === 'EMPTY_VAR');
    expect(emptyVar).toBeDefined();
    expect(emptyVar?.value).toBe('');
  });

  it('should handle special characters in values', () => {
    const data = generateDummyEnvironmentData();

    // Find the special characters case
    const specialVar = data.find((item) => item.key === 'SPECIAL_CHARS');
    expect(specialVar).toBeDefined();
    expect(specialVar?.value).toBe('test@#$%^&*()');
  });

  it('should handle multiline values', () => {
    const data = generateDummyEnvironmentData();

    // Find the multiline case
    const multilineVar = data.find((item) => item.key === 'MULTILINE_VAR');
    expect(multilineVar).toBeDefined();
    expect(multilineVar?.value).toBe('line1\nline2');
  });
});
