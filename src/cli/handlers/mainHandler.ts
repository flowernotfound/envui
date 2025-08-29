import { createEnvironmentTable } from '../../core/table.js';
import { readEnvironmentVariables } from '../../core/envReader.js';
import { filterEnvironmentVariables, generateNoMatchMessage } from '../../core/filter.js';
import type { FilterConfig } from '../../types/environment.js';
import type { ParsedArgs } from '../parser/types.js';
import { EXIT_CODES, ERROR_MESSAGES } from '../../constants/index.js';
import { logger } from '../../utils/logger.js';
import { createCliError, CliErrorType } from '../errors/types.js';

/**
 * Create filter configuration from parsed arguments
 */
function createFilterConfig(parsedArgs: ParsedArgs): FilterConfig {
  // Check for --filter option
  if (parsedArgs.filterValue) {
    // Check for conflict with prefix filter
    if (parsedArgs.arguments.length > 0) {
      throw createCliError(
        CliErrorType.FILTER_CONFLICT,
        'cannot use prefix filter and --filter option together',
        EXIT_CODES.INVALID_ARGUMENT,
      );
    }

    return { type: 'partial', value: parsedArgs.filterValue };
  }

  // Check for prefix filter (first argument)
  if (parsedArgs.arguments.length > 0) {
    const prefix = parsedArgs.arguments[0];
    if (prefix && prefix.trim() !== '') {
      return { type: 'prefix', value: prefix.trim() };
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
    throw createCliError(
      CliErrorType.NO_DATA_FOUND,
      ERROR_MESSAGES.NO_ENVIRONMENT_VARIABLES,
      EXIT_CODES.DATA_NOT_FOUND,
    );
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
    let message = generateNoMatchMessage(filterConfig);
    if (filterConfig.type !== 'none' && filterResult.filterInfo) {
      message = `${filterResult.filterInfo}\n${message}`;
    }
    throw createCliError(CliErrorType.NO_DATA_FOUND, message, EXIT_CODES.DATA_NOT_FOUND);
  }

  // Display filter info if filter is applied
  if (filterResult.filterInfo) {
    logger.userInfo(filterResult.filterInfo);
    logger.userInfo(''); // Empty line after filter info
  }

  // Display table
  const table = createEnvironmentTable(filterResult.filtered);
  throw createCliError(CliErrorType.SUCCESS_EXIT, table, EXIT_CODES.SUCCESS);
}
