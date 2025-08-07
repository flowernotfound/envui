/**
 * Color configuration for special values
 * Supports future extension for additional special value types
 */
export const colorConfig = {
  specialValues: {
    empty: {
      color: 'yellow' as const,
      bold: true,
    },
    // Future extensions can be added here:
    // null: { color: 'red' as const, bold: false },
    // undefined: { color: 'gray' as const, bold: true },
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
