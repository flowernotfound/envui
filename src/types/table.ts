/**
 * Table-related type definitions
 */

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
 * Column width configuration
 */
export interface ColumnWidths {
  keyWidth: number;
  valueWidth: number;
}
