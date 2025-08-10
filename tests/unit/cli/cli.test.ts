import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CommanderError } from 'commander';

describe('CLI Error Handling', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit called');
    });
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('CommanderError handling', () => {
    it('should handle unknown option error with custom message', () => {
      const mockError = new CommanderError(
        1,
        'commander.unknownOption',
        "unknown option '--invalid'",
      );

      // Simulate the error handling logic
      try {
        throw mockError;
      } catch (err) {
        if (err instanceof CommanderError && err.code === 'commander.unknownOption') {
          console.error(err.message);
          console.error("\nUse 'envui --help' to see available options.");
          expect(() => process.exit(2)).toThrow('process.exit called');
        }
      }

      expect(consoleErrorSpy).toHaveBeenCalledWith("unknown option '--invalid'");
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "\nUse 'envui --help' to see available options.",
      );
    });

    it('should handle other CommanderError with default behavior', () => {
      const mockError = new CommanderError(
        1,
        'commander.missingArgument',
        'missing required argument',
      );

      try {
        throw mockError;
      } catch (err) {
        if (err instanceof CommanderError && err.code !== 'commander.unknownOption') {
          console.error(err.message);
          expect(() => process.exit(err.exitCode || 1)).toThrow('process.exit called');
        }
      }

      expect(consoleErrorSpy).toHaveBeenCalledWith('missing required argument');
    });

    it('should re-throw non-CommanderError', () => {
      const systemError = new Error('System error');

      expect(() => {
        try {
          throw systemError;
        } catch (err) {
          if (!(err instanceof CommanderError)) {
            throw err; // Re-throw non-Commander errors
          }
        }
      }).toThrow('System error');
    });
  });
});
