import Table from 'cli-table3';
import type { EnvironmentData } from '../types/environment.js';

/**
 * Creates a formatted table for environment variables
 * @param data - Array of environment variable key-value pairs
 * @returns Formatted table string
 * @throws Error if table creation fails
 */
export function createEnvironmentTable(data: EnvironmentData[] = []): string {
  try {
    const terminalWidth = process.stdout.columns || 80;

    // (KEY:VALUE = 25:75)
    const keyWidth = Math.floor(terminalWidth * 0.25);
    // Subtract 7 for table borders and padding
    const valueWidth = terminalWidth - keyWidth - 7;

    const table = new Table({
      head: ['KEY', 'VALUE'],
      colWidths: [keyWidth, valueWidth],
      wordWrap: true,
    });

    data.forEach((item) => {
      table.push([item.key, item.value]);
    });

    return table.toString();
  } catch (error) {
    throw new Error(
      `Failed to create table: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}
