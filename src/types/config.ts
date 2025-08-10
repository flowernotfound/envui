/**
 * Color configuration types
 */
export type ColorName = 'yellow' | 'red' | 'green' | 'blue' | 'gray' | 'cyan' | 'magenta';

export type SpecialValueConfig = {
  color: ColorName;
  bold: boolean;
};
