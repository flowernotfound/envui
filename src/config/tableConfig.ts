/**
 * Configuration interface for table layout and formatting
 */
export interface TableLayoutConfig {
  /** Ratio of terminal width to use for table (0.0-1.0) */
  terminalWidthRatio: number;

  /** Ratio of table width to use for key column (0.0-1.0) */
  keyWidthRatio: number;

  /** Space reserved for table borders and separators */
  borderSpace: number;

  /** Default terminal width when stdout.columns is undefined */
  defaultTerminalWidth: number;

  /** Enable word wrapping in cells */
  wordWrap: boolean;

  /** Wrap on word boundaries */
  wrapOnWordBoundary: boolean;

  /** String to use for truncation (empty string means no truncation) */
  truncate: string;
}

/**
 * Default table configuration that matches current implementation
 * These values preserve exact current behavior
 */
export const DEFAULT_TABLE_CONFIG: TableLayoutConfig = {
  terminalWidthRatio: 0.5, // terminalWidth / 2
  keyWidthRatio: 0.25, // maxTableWidth * 0.25
  borderSpace: 7, // Space for borders/separators
  defaultTerminalWidth: 80, // Default when process.stdout.columns is undefined
  wordWrap: true, // Current setting
  wrapOnWordBoundary: false, // Current setting
  truncate: '', // Current setting (no truncation)
};

/**
 * Get effective table configuration
 * Currently returns default config, but prepared for future overrides
 */
export function getTableConfig(): TableLayoutConfig {
  return DEFAULT_TABLE_CONFIG;
}
