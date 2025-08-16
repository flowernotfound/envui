import type { EnvironmentData, FilterConfig, FilterResult } from '../types/environment.js';
import { ERROR_MESSAGES, CLI_MESSAGES } from '../constants/index.js';

/**
 * Creates a filter function that matches environment variables by prefix
 * @param prefix - The prefix to match (case-insensitive)
 * @returns A filter function that checks if a variable starts with the prefix
 */
export function createPrefixFilter(prefix: string): (env: EnvironmentData) => boolean {
  const lowerPrefix = prefix.toLowerCase();

  return (env: EnvironmentData): boolean => {
    return env.key.toLowerCase().startsWith(lowerPrefix);
  };
}

/**
 * Filters environment variables based on the provided configuration
 * @param data - Array of environment variables
 * @param config - Filter configuration
 * @returns Filtered result with metadata
 */
export function filterEnvironmentVariables(
  data: EnvironmentData[],
  config: FilterConfig,
): FilterResult {
  const total = data.length;

  // No filter applied
  if (config.type === 'none') {
    return {
      filtered: data,
      total,
      matchCount: total,
      filterInfo: '',
    };
  }

  // Apply prefix filter (config.type is automatically narrowed to 'prefix')
  const filter = createPrefixFilter(config.value);
  const filtered = data.filter(filter);

  return {
    filtered,
    total,
    matchCount: filtered.length,
    filterInfo: generateFilterMessage(config, {
      filtered,
      total,
      matchCount: filtered.length,
      filterInfo: '',
    }),
  };
}

/**
 * Generates a filter information message
 * @param config - Filter configuration
 * @param result - Filter result
 * @returns Formatted filter message
 */
export function generateFilterMessage(config: FilterConfig, result: FilterResult): string {
  // No filter applied
  if (config.type === 'none') {
    return '';
  }

  // Prefix filter message (config.type is automatically narrowed to 'prefix')
  return CLI_MESSAGES.FILTER_INFO(config.value, result.matchCount, result.total);
}

/**
 * Generates a message when no matches are found
 * @param config - Filter configuration
 * @returns No match message
 */
export function generateNoMatchMessage(config: FilterConfig): string {
  // Generic message for no filter
  if (config.type === 'none') {
    return ERROR_MESSAGES.NO_ENVIRONMENT_VARIABLES;
  }

  // Specific message for prefix filter (config.type is automatically narrowed to 'prefix')
  return ERROR_MESSAGES.NO_MATCHING_VARIABLES(config.value);
}
