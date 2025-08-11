import type { EnvironmentData } from '../types/environment.js';

/**
 * Reads all environment variables from process.env
 * @returns Array of environment variable key-value pairs
 * @throws Error if environment variables cannot be read
 */
export function readEnvironmentVariables(): EnvironmentData[] {
  try {
    const envData: EnvironmentData[] = [];
    const env = process.env;

    for (const [key, value] of Object.entries(env)) {
      if (value === undefined) {
        continue;
      }

      const displayValue = value === '' ? '<empty>' : value;

      envData.push({
        key,
        value: displayValue,
      });
    }

    return envData;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to read environment variables: ${message}`);
  }
}
