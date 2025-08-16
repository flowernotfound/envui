// Main library exports for envui
import pkg from '../package.json' with { type: 'json' };

// Core functionality
export { readEnvironmentVariables } from './core/envReader.js';
export { createEnvironmentTable } from './core/table.js';

// Types (only EnvironmentData is exposed as public API)
export type { EnvironmentData } from './types/index.js';

// Version information
export const version = pkg.version;
