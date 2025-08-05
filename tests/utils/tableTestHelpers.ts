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
