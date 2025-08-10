/**
 * Default configuration for envui
 */
export const defaultConfig = {
  color: {
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
  },
  table: {
    layout: {
      terminalWidthRatio: 0.5, // terminalWidth / 2
      keyWidthRatio: 0.25, // maxTableWidth * 0.25
      borderSpace: 7, // Space for borders/separators
      defaultTerminalWidth: 80, // Default when process.stdout.columns is undefined
    },
    formatting: {
      wordWrap: true, // Current setting
      wrapOnWordBoundary: false, // Current setting
      truncate: '', // Current setting (no truncation)
    },
  },
} as const;
