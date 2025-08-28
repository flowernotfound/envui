import { createEnvironmentTable } from '../../core/table.js';
import { readEnvironmentVariables } from '../../core/envReader.js';
import { filterEnvironmentVariables, generateNoMatchMessage } from '../../core/filter.js';
import type { FilterConfig } from '../../types/environment.js';
import type { ParsedArgs } from '../parser/types.js';
import { EXIT_CODES, ERROR_MESSAGES } from '../../constants/index.js';

/**
 * Create filter configuration from parsed arguments
 */
function createFilterConfig(parsedArgs: ParsedArgs): FilterConfig {
  // Check for --filter option
  if (parsedArgs.filterValue) {
    // Check for conflict with prefix filter
    if (parsedArgs.arguments.length > 0) {
      console.error('Error: Cannot use prefix filter and --filter option together');
      console.error('Usage:');
      console.error('  envui [PREFIX]        # Filter by prefix');
      console.error('  envui --filter TEXT   # Filter by partial match');
      process.exit(EXIT_CODES.INVALID_ARGUMENT);
    }

    return { type: 'partial', value: parsedArgs.filterValue };
  }

  // Check for prefix filter (first argument)
  if (parsedArgs.arguments.length > 0) {
    const prefix = parsedArgs.arguments[0];
    if (prefix && prefix.trim() !== '') {
      return { type: 'prefix', value: prefix };
    }
  }

  return { type: 'none' };
}

/**
 * Handle main command (display environment variables)
 */
export function handleMainCommand(args?: ReadonlyArray<string>, parsedArgs?: ParsedArgs): void {
  // Get environment variables
  const environmentData = readEnvironmentVariables();

  // Handle case when no environment variables found
  if (environmentData.length === 0) {
    console.log(ERROR_MESSAGES.NO_ENVIRONMENT_VARIABLES);
    process.exit(EXIT_CODES.DATA_NOT_FOUND);
  }

  // Create filter configuration
  // For backward compatibility, create a minimal ParsedArgs if not provided
  const effectiveParsedArgs = parsedArgs ?? {
    command: 'main' as const,
    options: [],
    flags: new Set<string>(),
    arguments: args ?? [],
    errors: [],
  };

  const filterConfig = createFilterConfig(effectiveParsedArgs);

  // Apply filter
  const filterResult = filterEnvironmentVariables(environmentData, filterConfig);

  // Handle no matches
  if (filterResult.matchCount === 0) {
    if (filterConfig.type !== 'none') {
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
