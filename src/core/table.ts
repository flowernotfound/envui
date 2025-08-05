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
    const maxTableWidth = Math.floor(terminalWidth / 2);
    const keyWidth = Math.floor(maxTableWidth * 0.25);
    const valueWidth = maxTableWidth - keyWidth - 7;

    const table = new Table({
      head: ['KEY', 'VALUE'],
      colWidths: [keyWidth, valueWidth],
      wordWrap: true,
      wrapOnWordBoundary: false,
      truncate: '',
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
