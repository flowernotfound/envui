import Table from 'cli-table3';
import type { EnvironmentData } from '../types/environment.js';
import type { TableLayoutConfig } from '../config/tableConfig.js';
import type { ColumnWidths } from './columnWidthCalculator.js';
import { formatValueWithColor } from './colorFormatter.js';

/**
 * Creates a cli-table3 instance with the specified configuration
 * This preserves the exact table configuration from the original implementation
 */
export function createTableInstance(config: TableLayoutConfig, widths: ColumnWidths) {
  return new Table({
    head: ['KEY', 'VALUE'],
    colWidths: [widths.keyWidth, widths.valueWidth],
    wordWrap: config.wordWrap,
    wrapOnWordBoundary: config.wrapOnWordBoundary,
    truncate: config.truncate,
  });
}

/**
 * Renders environment data into a formatted table string
 * This preserves the exact rendering logic from the original implementation
 */
export function renderEnvironmentTable(
  data: EnvironmentData[],
  config: TableLayoutConfig,
  widths: ColumnWidths,
): string {
  const table = createTableInstance(config, widths);

  data.forEach((item) => {
    table.push([item.key, formatValueWithColor(item.value)]);
  });

  return table.toString();
}
