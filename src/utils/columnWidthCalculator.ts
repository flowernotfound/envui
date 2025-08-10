import type { TableLayoutConfig, ColumnWidths } from '../types/index.js';

/**
 * Calculates column widths based on terminal size and configuration
 * This preserves the exact calculation logic from the original implementation
 */
export function calculateColumnWidths(config: TableLayoutConfig): ColumnWidths {
  const terminalWidth = process.stdout.columns || config.defaultTerminalWidth;
  const maxTableWidth = Math.floor(terminalWidth * config.terminalWidthRatio);
  const keyWidth = Math.floor(maxTableWidth * config.keyWidthRatio);
  const valueWidth = maxTableWidth - keyWidth - config.borderSpace;

  return {
    keyWidth,
    valueWidth,
  };
}
