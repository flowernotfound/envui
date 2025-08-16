import type { EnvironmentData } from '../types/environment.js';
import { wrapError } from '../utils/errorUtils.js';

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
    throw wrapError('Failed to read environment variables', error);
  }
}
