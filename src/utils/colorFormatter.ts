import chalk from 'chalk';
import { colorConfig, type ColorName } from '../config/colorConfig.js';

/**
 * Get chalk color function based on color name
 */
function getChalkColor(color: ColorName) {
  switch (color) {
    case 'yellow':
      return chalk.yellow;
    case 'green':
      return chalk.green;
    case 'red':
      return chalk.red;
    case 'cyan':
      return chalk.cyan;
    case 'blue':
      return chalk.blue;
    case 'gray':
      return chalk.gray;
    case 'magenta':
      return chalk.magenta;
    default: {
      return chalk.white;
    }
  }
}

/**
 * Apply color and bold styling to text
 * @param color - Color name from configuration
 * @param bold - Whether to apply bold styling
 * @param text - Text to style
 * @returns Styled text
 */
export function applyColorStyle(color: ColorName, bold: boolean, text: string): string {
  const colorFn = getChalkColor(color);
  return bold ? colorFn.bold(text) : colorFn(text);
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
    return applyColorStyle(config.color, config.bold, value);
  }

  // Check for boolean values (case-insensitive)
  const lowerValue = value.toLowerCase();
  if (lowerValue === 'true') {
    const config = colorConfig.specialValues.true;
    return applyColorStyle(config.color, config.bold, value);
  }
  if (lowerValue === 'false') {
    const config = colorConfig.specialValues.false;
    return applyColorStyle(config.color, config.bold, value);
  }

  return value;
}
