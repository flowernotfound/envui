import { describe, it, expect } from 'vitest';
import { CLI_MESSAGES } from '../../../src/constants/index.js';

describe('CLI Messages', () => {
  describe('CLI_MESSAGES constants', () => {
    it('should have HELP_EXAMPLES with correct format', () => {
      expect(CLI_MESSAGES.HELP_EXAMPLES).toBeDefined();
      expect(CLI_MESSAGES.HELP_EXAMPLES).toContain('Examples:');
      expect(CLI_MESSAGES.HELP_EXAMPLES).toContain('envui');
      expect(CLI_MESSAGES.HELP_EXAMPLES).toContain('Display all environment variables');
    });

    it('should have HELP_DESCRIPTION with correct content', () => {
      expect(CLI_MESSAGES.HELP_DESCRIPTION).toBeDefined();
      expect(CLI_MESSAGES.HELP_DESCRIPTION).toContain('Description:');
      expect(CLI_MESSAGES.HELP_DESCRIPTION).toContain('modern alternative to printenv');
    });

    it('should have INVALID_OPTION_HELP with help guidance', () => {
      expect(CLI_MESSAGES.INVALID_OPTION_HELP).toBeDefined();
      expect(CLI_MESSAGES.INVALID_OPTION_HELP).toContain('envui --help');
      expect(CLI_MESSAGES.INVALID_OPTION_HELP).toContain('more information');
    });
  });
});
