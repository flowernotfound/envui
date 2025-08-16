import { createEnvironmentTable } from '../../core/table.js';
import { readEnvironmentVariables } from '../../core/envReader.js';
import { EXIT_CODES, ERROR_MESSAGES } from '../../constants/index.js';

/**
 * Handle main command (display environment variables)
 */
export function handleMainCommand(): void {
  // Get environment variables
  const environmentData = readEnvironmentVariables();

  // Handle case when no environment variables found
  if (environmentData.length === 0) {
    console.log(ERROR_MESSAGES.NO_ENVIRONMENT_VARIABLES);
    process.exit(EXIT_CODES.DATA_NOT_FOUND);
  }

  // Display table
  const table = createEnvironmentTable(environmentData);
  console.log(table);
  process.exit(EXIT_CODES.SUCCESS);
}
