import chalk from 'chalk';
import { colorConfig } from '../config/colorConfig.js';

/**
 * Formats values with colors based on configuration
 * Currently supports special styling for <empty> values
 *
 * @param value - The string value to format
 * @returns The formatted string with color styling applied if applicable
 */
export function formatValueWithColor(value: string): string {
  if (value === '<empty>') {
    const config = colorConfig.specialValues.empty;
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return config.bold ? chalk[config.color].bold(value) : chalk[config.color](value);
  }
  return value;
}
