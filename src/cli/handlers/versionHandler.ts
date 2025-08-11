import { getVersionText } from '../config.js';
import { EXIT_CODES } from '../../constants/index.js';

/**
 * Handle version command
 */
export function handleVersionCommand(): void {
  console.log(getVersionText());
  process.exit(EXIT_CODES.SUCCESS);
}
