/**
 * Color configuration for special values and display elements
 * Supports future extension for additional special value types
 */
export const colorConfig = {
  // Colors for table elements
  elements: {
    key: {
      color: 'cyan' as const,
      bold: false,
    },
  },
  // Colors for special values
  specialValues: {
    empty: {
      color: 'yellow' as const,
      bold: true,
    },
    true: {
      color: 'green' as const,
      bold: false,
    },
    false: {
      color: 'red' as const,
      bold: false,
    },
  },
} as const;

/**
 * Type definitions for color configuration
 */
export type ColorName = 'yellow' | 'red' | 'green' | 'blue' | 'gray' | 'cyan' | 'magenta';

export type SpecialValueConfig = {
  color: ColorName;
  bold: boolean;
};

export type SpecialValueType = keyof typeof colorConfig.specialValues;
