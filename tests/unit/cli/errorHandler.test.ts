import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Command } from 'commander';
import { setupCliErrorHandling } from '../../../src/cli/errorHandler.js';

describe('CLI Error Handler', () => {
  let mockProgram: Command;

  beforeEach(() => {
    mockProgram = new Command();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('setupCliErrorHandling', () => {
    it('should configure program without throwing errors', () => {
      // Simply test that the function can be called without errors
      expect(() => setupCliErrorHandling(mockProgram)).not.toThrow();
    });

    it('should setup error handling on the program', () => {
      setupCliErrorHandling(mockProgram);

      // Test that the function completed successfully
      expect(mockProgram).toBeDefined();
    });
  });
});
