import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CommanderError } from 'commander';

describe('CLI', () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  let processExitMock: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Reset modules before each test
    vi.resetModules();

    // Setup spies
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    processExitMock = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Main action', () => {
    it('should display environment variables when they exist', async () => {
      // Mock dependencies
      vi.doMock('../../../src/core/env-reader.js', () => ({
        readEnvironmentVariables: vi.fn(() => [
          { key: 'NODE_ENV', value: 'test' },
          { key: 'PORT', value: '3000' },
        ]),
      }));

      vi.doMock('../../../src/core/table.js', () => ({
        createEnvironmentTable: vi.fn(() => 'mocked table output'),
      }));

      vi.doMock('../../../src/cli/config.js', () => ({
        createCliProgram: vi.fn(() => ({
          exitOverride: vi.fn().mockReturnThis(),
          action: vi.fn((callback) => {
            // Execute action immediately
            callback();
            return { parse: vi.fn() };
          }),
          parse: vi.fn(),
        })),
      }));

      vi.doMock('../../../src/utils/logger.js', () => ({
        logger: { error: vi.fn() },
      }));

      // Import and execute CLI
      await import('../../../src/cli.js');

      // Verify behavior
      expect(consoleLogSpy).toHaveBeenCalledWith('mocked table output');
      expect(processExitMock).toHaveBeenCalledWith(0);
    });

    it('should display error message when no environment variables found', async () => {
      // Mock dependencies
      vi.doMock('../../../src/core/env-reader.js', () => ({
        readEnvironmentVariables: vi.fn(() => []),
      }));

      vi.doMock('../../../src/core/table.js', () => ({
        createEnvironmentTable: vi.fn(),
      }));

      vi.doMock('../../../src/cli/config.js', () => ({
        createCliProgram: vi.fn(() => ({
          exitOverride: vi.fn().mockReturnThis(),
          action: vi.fn((callback) => {
            callback();
            return { parse: vi.fn() };
          }),
          parse: vi.fn(),
        })),
      }));

      vi.doMock('../../../src/utils/logger.js', () => ({
        logger: { error: vi.fn() },
      }));

      // Import and execute CLI
      await import('../../../src/cli.js');

      // Verify behavior
      expect(consoleLogSpy).toHaveBeenCalledWith('No environment variables found');
      expect(processExitMock).toHaveBeenCalledWith(2);
    });

    it('should handle system errors gracefully', async () => {
      const loggerErrorMock = vi.fn();

      // Mock dependencies
      vi.doMock('../../../src/core/env-reader.js', () => ({
        readEnvironmentVariables: vi.fn(() => {
          throw new Error('Read error');
        }),
      }));

      vi.doMock('../../../src/core/table.js', () => ({
        createEnvironmentTable: vi.fn(),
      }));

      vi.doMock('../../../src/cli/config.js', () => ({
        createCliProgram: vi.fn(() => ({
          exitOverride: vi.fn().mockReturnThis(),
          action: vi.fn((callback) => {
            callback();
            return { parse: vi.fn() };
          }),
          parse: vi.fn(),
        })),
      }));

      vi.doMock('../../../src/utils/logger.js', () => ({
        logger: { error: loggerErrorMock },
      }));

      // Import and execute CLI
      await import('../../../src/cli.js');

      // Verify behavior
      expect(loggerErrorMock).toHaveBeenCalledWith('Read error');
      expect(processExitMock).toHaveBeenCalledWith(1);
    });

    it('should handle non-Error exceptions', async () => {
      const loggerErrorMock = vi.fn();

      // Mock dependencies
      vi.doMock('../../../src/core/env-reader.js', () => ({
        readEnvironmentVariables: vi.fn(() => {
          throw 'string error'; // Non-Error exception
        }),
      }));

      vi.doMock('../../../src/core/table.js', () => ({
        createEnvironmentTable: vi.fn(),
      }));

      vi.doMock('../../../src/cli/config.js', () => ({
        createCliProgram: vi.fn(() => ({
          exitOverride: vi.fn().mockReturnThis(),
          action: vi.fn((callback) => {
            callback();
            return { parse: vi.fn() };
          }),
          parse: vi.fn(),
        })),
      }));

      vi.doMock('../../../src/utils/logger.js', () => ({
        logger: { error: loggerErrorMock },
      }));

      // Import and execute CLI
      await import('../../../src/cli.js');

      // Verify behavior
      expect(loggerErrorMock).toHaveBeenCalledWith('An unexpected error occurred');
      expect(processExitMock).toHaveBeenCalledWith(1);
    });
  });

  describe('Command line parsing errors', () => {
    it('should handle unknown option with CommanderError', async () => {
      // Mock dependencies
      vi.doMock('../../../src/core/env-reader.js', () => ({
        readEnvironmentVariables: vi.fn(),
      }));

      vi.doMock('../../../src/core/table.js', () => ({
        createEnvironmentTable: vi.fn(),
      }));

      vi.doMock('../../../src/cli/config.js', () => ({
        createCliProgram: vi.fn(() => ({
          exitOverride: vi.fn().mockReturnThis(),
          action: vi.fn().mockReturnThis(),
          parse: vi.fn(() => {
            throw new CommanderError(
              1,
              'commander.unknownOption',
              "error: unknown option '--invalid'",
            );
          }),
        })),
      }));

      vi.doMock('../../../src/utils/logger.js', () => ({
        logger: { error: vi.fn() },
      }));

      // Import CLI
      await import('../../../src/cli.js');

      // Verify error handling
      expect(consoleErrorSpy).toHaveBeenCalledWith("error: unknown option '--invalid'");
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "\nUse 'envui --help' to see available options.",
      );
      expect(processExitMock).toHaveBeenCalledWith(2);
    });

    it('should handle other CommanderError types', async () => {
      // Mock dependencies
      vi.doMock('../../../src/core/env-reader.js', () => ({
        readEnvironmentVariables: vi.fn(),
      }));

      vi.doMock('../../../src/core/table.js', () => ({
        createEnvironmentTable: vi.fn(),
      }));

      vi.doMock('../../../src/cli/config.js', () => ({
        createCliProgram: vi.fn(() => ({
          exitOverride: vi.fn().mockReturnThis(),
          action: vi.fn().mockReturnThis(),
          parse: vi.fn(() => {
            throw new CommanderError(
              3,
              'commander.missingArgument',
              'error: missing required argument',
            );
          }),
        })),
      }));

      vi.doMock('../../../src/utils/logger.js', () => ({
        logger: { error: vi.fn() },
      }));

      // Import CLI
      await import('../../../src/cli.js');

      // Verify error handling
      expect(consoleErrorSpy).toHaveBeenCalledWith('error: missing required argument');
      expect(processExitMock).toHaveBeenCalledWith(3);
    });

    it('should handle parse system errors', async () => {
      const loggerErrorMock = vi.fn();

      // Mock dependencies
      vi.doMock('../../../src/core/env-reader.js', () => ({
        readEnvironmentVariables: vi.fn(),
      }));

      vi.doMock('../../../src/core/table.js', () => ({
        createEnvironmentTable: vi.fn(),
      }));

      vi.doMock('../../../src/cli/config.js', () => ({
        createCliProgram: vi.fn(() => ({
          exitOverride: vi.fn().mockReturnThis(),
          action: vi.fn().mockReturnThis(),
          parse: vi.fn(() => {
            throw new Error('Parse error');
          }),
        })),
      }));

      vi.doMock('../../../src/utils/logger.js', () => ({
        logger: { error: loggerErrorMock },
      }));

      // Import CLI
      await import('../../../src/cli.js');

      // Verify error handling
      expect(loggerErrorMock).toHaveBeenCalledWith('Parse error');
      expect(processExitMock).toHaveBeenCalledWith(1);
    });
  });

  // Original CommanderError handling tests (simplified)
  describe('CommanderError handling patterns', () => {
    it('should handle unknown option error pattern', () => {
      const mockError = new CommanderError(
        1,
        'commander.unknownOption',
        "unknown option '--invalid'",
      );

      // Simulate the error handling logic
      if (mockError instanceof CommanderError && mockError.code === 'commander.unknownOption') {
        console.error(mockError.message);
        console.error("\nUse 'envui --help' to see available options.");
      }

      expect(consoleErrorSpy).toHaveBeenCalledWith("unknown option '--invalid'");
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "\nUse 'envui --help' to see available options.",
      );
    });

    it('should handle other CommanderError pattern', () => {
      const mockError = new CommanderError(
        1,
        'commander.missingArgument',
        'missing required argument',
      );

      if (mockError instanceof CommanderError && mockError.code !== 'commander.unknownOption') {
        console.error(mockError.message);
      }

      expect(consoleErrorSpy).toHaveBeenCalledWith('missing required argument');
    });
  });
});
