import { describe, it, expect } from 'vitest';
import { createCliConfig, getVersionText } from '../../../src/cli/config.js';
import pkg from '../../../package.json' with { type: 'json' };

describe('CLI Config', () => {
  describe('createCliConfig', () => {
    it('should create config with correct name', () => {
      const config = createCliConfig();

      expect(config.name).toBe('envui');
    });

    it('should create config with correct description', () => {
      const config = createCliConfig();

      expect(config.description).toBe('Beautiful environment variable viewer');
    });

    it('should create config with version from package.json', () => {
      const config = createCliConfig();

      expect(config.version).toBe(pkg.version);
    });

    it('should include help text', () => {
      const config = createCliConfig();

      expect(config.helpText).toContain('envui');
      expect(config.helpText).toContain('Beautiful environment variable viewer');
      expect(config.helpText).toContain('--help');
      expect(config.helpText).toContain('--version');
      expect(config.helpText).toContain('--filter');
    });

    it('should define supported options', () => {
      const config = createCliConfig();

      expect(config.supportedOptions).toEqual(['help', 'version', 'filter']);
    });
  });

  describe('getVersionText', () => {
    it('should return version from package.json', () => {
      const version = getVersionText();

      expect(version).toBe(pkg.version);
    });
  });
});
