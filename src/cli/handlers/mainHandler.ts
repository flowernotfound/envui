import { createEnvironmentTable } from '../../core/table.js';
import { readEnvironmentVariables } from '../../core/envReader.js';
import { filterEnvironmentVariables, generateNoMatchMessage } from '../../core/filter.js';
import type { FilterConfig } from '../../types/environment.js';
import { EXIT_CODES, ERROR_MESSAGES } from '../../constants/index.js';

/**
 * Create filter configuration from arguments
 */
function createFilterConfig(args?: ReadonlyArray<string>): FilterConfig {
  if (!args || args.length === 0) {
    return { type: 'none' };
  }

  // Use the first argument as prefix
  const prefix = args[0];
  if (!prefix || prefix.trim() === '') {
    return { type: 'none' };
  }

  return { type: 'prefix', value: prefix };
}

/**
 * Handle main command (display environment variables)
 */
export function handleMainCommand(args?: ReadonlyArray<string>): void {
  // Get environment variables
  const environmentData = readEnvironmentVariables();

  // Handle case when no environment variables found
  if (environmentData.length === 0) {
    console.log(ERROR_MESSAGES.NO_ENVIRONMENT_VARIABLES);
    process.exit(EXIT_CODES.DATA_NOT_FOUND);
  }

  // Create filter configuration
  const filterConfig = createFilterConfig(args);

  // Apply filter
  const filterResult = filterEnvironmentVariables(environmentData, filterConfig);

  // Handle no matches
  if (filterResult.matchCount === 0) {
    if (filterConfig.type === 'prefix' && filterConfig.value) {
      // Show filter info even when no matches
      console.log(filterResult.filterInfo);
    }
    console.log(generateNoMatchMessage(filterConfig));
    process.exit(EXIT_CODES.DATA_NOT_FOUND);
  }

  // Display filter info if filter is applied
  if (filterResult.filterInfo) {
    console.log(filterResult.filterInfo);
    console.log(); // Empty line after filter info
  }

  // Display table
  const table = createEnvironmentTable(filterResult.filtered);
  console.log(table);
  process.exit(EXIT_CODES.SUCCESS);
}
