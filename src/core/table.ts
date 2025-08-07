import type { EnvironmentData } from '../types/environment.js';
import { getTableConfig } from '../config/tableConfig.js';
import { calculateColumnWidths } from '../utils/columnWidthCalculator.js';
import { renderEnvironmentTable } from '../utils/tableRenderer.js';

/**
 * Creates a formatted table for environment variables
 * @param data - Array of environment variable key-value pairs
 * @returns Formatted table string
 * @throws Error if table creation fails
 */
export function createEnvironmentTable(data: EnvironmentData[] = []): string {
  try {
    const config = getTableConfig();
    const widths = calculateColumnWidths(config);
    return renderEnvironmentTable(data, config, widths);
  } catch (error) {
    throw new Error(
      `Failed to create table: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}
