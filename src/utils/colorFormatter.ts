import chalk from 'chalk';
import { colorConfig } from '../config/colorConfig.js';

/**
 * Formats environment variable keys with configured color
 *
 * @param key - The environment variable key to format
 * @returns The formatted key with color styling applied
 */
export function formatKey(key: string): string {
  const config = colorConfig.elements.key;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return config.bold ? chalk[config.color].bold(key) : chalk[config.color](key);
}

/**
 * Formats values with colors based on configuration
 * Supports special styling for <empty>, true, and false values
 *
 * @param value - The string value to format
 * @returns The formatted string with color styling applied if applicable
 */
export function formatValueWithColor(value: string): string {
  // Check for <empty> value
  if (value === '<empty>') {
    const config = colorConfig.specialValues.empty;
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return config.bold ? chalk[config.color].bold(value) : chalk[config.color](value);
  }

  // Check for boolean values (case-insensitive)
  const lowerValue = value.toLowerCase();
  if (lowerValue === 'true') {
    const config = colorConfig.specialValues.true;
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return config.bold ? chalk[config.color].bold(value) : chalk[config.color](value);
  }
  if (lowerValue === 'false') {
    const config = colorConfig.specialValues.false;
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return config.bold ? chalk[config.color].bold(value) : chalk[config.color](value);
  }

  return value;
}
