import { describe, it, expect } from 'vitest';
import { createCliProgram } from '../../../src/cli/config.js';
import pkg from '../../../package.json' with { type: 'json' };

describe('CLI Config', () => {
  describe('createCliProgram', () => {
    it('should create program with correct name', () => {
      const program = createCliProgram();

      expect(program.name()).toBe('envui');
    });

    it('should create program with correct description', () => {
      const program = createCliProgram();

      expect(program.description()).toBe('Beautiful environment variable viewer');
    });

    it('should create program with version from package.json', () => {
      const program = createCliProgram();

      expect(program.version()).toBe(pkg.version);
    });
  });
});
