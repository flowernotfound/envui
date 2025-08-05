import type { EnvironmentData } from '../types/environment.js';
import { logger } from '../utils/logger.js';

/**
 * Reads all environment variables from process.env
 * @returns Array of environment variable key-value pairs
 * @throws Error if environment variables cannot be read
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    logger.error(`Failed to read environment variables: ${errorMessage}`);
    throw new Error(`Environment variable reading failed: ${errorMessage}`);
  }
}
