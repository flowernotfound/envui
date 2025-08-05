import type { EnvironmentData } from '../types/environment.js';

/**
 * Reads all environment variables from process.env
 * @returns Array of environment variable key-value pairs
 */
export function readEnvironmentVariables(): EnvironmentData[] {
  try {
    const envData: EnvironmentData[] = [];
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const env = process.env || {};

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
    return [];
  }
}
