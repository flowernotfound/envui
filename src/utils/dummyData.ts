import type { EnvironmentData } from '../types/environment.js';

/**
 * Generates dummy environment data for development and testing purposes
 * @returns Array of dummy environment variable key-value pairs
 * @throws Error if data generation fails
 */
export function generateDummyEnvironmentData(): EnvironmentData[] {
  try {
    const dummyData: EnvironmentData[] = [
      { key: 'NORMAL_VAR', value: 'normal_value' },
      { key: 'EMPTY_VAR', value: '' },
      { key: 'SPACE_VAR', value: ' ' },
      { key: 'MULTILINE_VAR', value: 'line1\nline2' },
      { key: 'SPECIAL_CHARS', value: 'test@#$%^&*()' },
    ];

    // Basic validation
    if (dummyData.length === 0) {
      throw new Error('No data to display');
    }

    // Validate data structure
    for (const item of dummyData) {
      if (typeof item.key !== 'string' || item.key === '') {
        throw new Error('Invalid environment variable key');
      }
      if (typeof item.value !== 'string') {
        throw new Error('Invalid environment variable value');
      }
    }

    return dummyData;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to get data');
  }
}
