// This file will export the main functionality of envui for library usage
import pkg from '../package.json' with { type: 'json' };

export const version = pkg.version;

// Placeholder for future exports
export function hello(): string {
  return 'Hello from envui library!';
}
