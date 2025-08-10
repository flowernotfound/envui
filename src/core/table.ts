import type { EnvironmentData } from '../types/index.js';
import { defaultConfig } from '../config/index.js';
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
    const tableConfig = {
      ...defaultConfig.table.layout,
      ...defaultConfig.table.formatting,
    };
    const widths = calculateColumnWidths(tableConfig);
    return renderEnvironmentTable(data, tableConfig, widths);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to create table: ${message}`);
  }
}
