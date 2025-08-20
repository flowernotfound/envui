/**
 * Environment variable data structure
 */
export interface EnvironmentData {
  key: string;
  value: string;
}

/**
 * Filter configuration for environment variables
 */
export type FilterConfig =
  | {
      readonly type: 'prefix';
      readonly value: string;
    }
  | {
      readonly type: 'none';
    };

/**
 * Result of filtering environment variables
 */
export interface FilterResult {
  readonly filtered: EnvironmentData[];
  readonly total: number;
  readonly matchCount: number;
  readonly filterInfo: string;
}
