/**
 * Helper function to check if a key exists in table (may be wrapped across lines)
 * @param table - The table string to search in
 * @param key - The key to search for
 * @returns True if all characters of the key exist in sequence in the table
 */
export function tableContainsKey(table: string, key: string): boolean {
  // Remove ANSI codes and check if all characters of the key exist in sequence
  // eslint-disable-next-line no-control-regex
  const cleanTable = table.replace(/\x1b\[[0-9;]*m/g, '');
  const keyChars = key.split('');
  let lastIndex = 0;

  for (const char of keyChars) {
    const index = cleanTable.indexOf(char, lastIndex);
    if (index === -1) return false;
    lastIndex = index + 1;
  }

  return true;
}

/**
 * Check if table has valid structure with headers and borders
 * @param table - The table string to check
 * @returns True if table has proper structure
 */
export function tableHasValidStructure(table: string): boolean {
  if (!table || typeof table !== 'string') return false;

  // Check for essential headers
  const hasHeaders = table.includes('KEY') && table.includes('VALUE');

  // Check for some kind of table structure (any border characters)
  const hasBorders = /[┌┐└┘├┤┬┴┼─│╭╮╰╯]/.test(table) || /[+\-|]/.test(table); // Also accept ASCII borders

  return hasHeaders && hasBorders;
}

/**
 * Check if table contains a key-value pair (both may be wrapped)
 * @param table - The table string to search in
 * @param key - The key to search for
 * @param value - The value to search for
 * @returns True if both key and value exist in the table
 */
export function tableContainsDataPair(table: string, key: string, value: string): boolean {
  return tableContainsKey(table, key) && table.includes(value);
}

/**
 * Check if table output is valid (non-empty string with content)
 * @param table - The table string to validate
 * @returns True if table is a valid output
 */
export function isValidTableOutput(table: string): boolean {
  return typeof table === 'string' && table.length > 0 && table.trim().length > 0;
}
