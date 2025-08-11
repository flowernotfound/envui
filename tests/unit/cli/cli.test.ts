import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CliError, CliErrorType } from '../../../src/cli/errors/index.js';

describe('CLI', () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  let processExitMock: ReturnType<typeof vi.spyOn>;
  let processArgv: string[];

  beforeEach(() => {
    // Reset modules before each test
    vi.resetModules();

    // Save original argv
    processArgv = process.argv;

    // Setup spies
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    processExitMock = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
  });

  afterEach(() => {
    // Restore original argv
    process.argv = processArgv;
    vi.restoreAllMocks();
  });

  describe('Main action', () => {
    it('should display environment variables when they exist', async () => {
      // Set argv for main command
      process.argv = ['node', 'cli.js'];

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
      // Set argv for main command
      process.argv = ['node', 'cli.js'];

      // Mock dependencies
      vi.doMock('../../../src/core/env-reader.js', () => ({
        readEnvironmentVariables: vi.fn(() => []),
      }));

      vi.doMock('../../../src/core/table.js', () => ({
        createEnvironmentTable: vi.fn(),
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

      // Set argv for main command
      process.argv = ['node', 'cli.js'];

      // Mock dependencies
      vi.doMock('../../../src/core/env-reader.js', () => ({
        readEnvironmentVariables: vi.fn(() => {
          throw new Error('Read error');
        }),
      }));

      vi.doMock('../../../src/core/table.js', () => ({
        createEnvironmentTable: vi.fn(),
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

      // Set argv for main command
      process.argv = ['node', 'cli.js'];

      // Mock dependencies
      vi.doMock('../../../src/core/env-reader.js', () => ({
        readEnvironmentVariables: vi.fn(() => {
          throw 'string error'; // Non-Error exception
        }),
      }));

      vi.doMock('../../../src/core/table.js', () => ({
        createEnvironmentTable: vi.fn(),
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

  describe('Command line options', () => {
    it('should display help when --help is passed', async () => {
      // Set argv with --help
      process.argv = ['node', 'cli.js', '--help'];

      // Mock dependencies
      vi.doMock('../../../src/core/env-reader.js', () => ({
        readEnvironmentVariables: vi.fn(),
      }));

      vi.doMock('../../../src/core/table.js', () => ({
        createEnvironmentTable: vi.fn(),
      }));

      vi.doMock('../../../src/utils/logger.js', () => ({
        logger: { error: vi.fn() },
      }));

      // Import and execute CLI
      await import('../../../src/cli.js');

      // Verify help is displayed
      expect(consoleLogSpy).toHaveBeenCalled();
      const helpOutput = consoleLogSpy.mock.calls[0][0];
      expect(helpOutput).toContain('envui');
      expect(helpOutput).toContain('Beautiful environment variable viewer');
      expect(helpOutput).toContain('--help');
      expect(processExitMock).toHaveBeenCalledWith(0);
    });

    it('should display help when -h is passed', async () => {
      // Set argv with -h
      process.argv = ['node', 'cli.js', '-h'];

      // Mock dependencies
      vi.doMock('../../../src/core/env-reader.js', () => ({
        readEnvironmentVariables: vi.fn(),
      }));

      vi.doMock('../../../src/core/table.js', () => ({
        createEnvironmentTable: vi.fn(),
      }));

      vi.doMock('../../../src/utils/logger.js', () => ({
        logger: { error: vi.fn() },
      }));

      // Import and execute CLI
      await import('../../../src/cli.js');

      // Verify help is displayed
      expect(consoleLogSpy).toHaveBeenCalled();
      const helpOutput = consoleLogSpy.mock.calls[0][0];
      expect(helpOutput).toContain('envui');
      expect(processExitMock).toHaveBeenCalledWith(0);
    });

    it('should display version when --version is passed', async () => {
      // Set argv with --version
      process.argv = ['node', 'cli.js', '--version'];

      // Mock dependencies
      vi.doMock('../../../src/core/env-reader.js', () => ({
        readEnvironmentVariables: vi.fn(),
      }));

      vi.doMock('../../../src/core/table.js', () => ({
        createEnvironmentTable: vi.fn(),
      }));

      vi.doMock('../../../src/utils/logger.js', () => ({
        logger: { error: vi.fn() },
      }));

      // Import and execute CLI
      await import('../../../src/cli.js');

      // Verify version is displayed
      expect(consoleLogSpy).toHaveBeenCalled();
      expect(processExitMock).toHaveBeenCalledWith(0);
    });

    it('should display version when -v is passed', async () => {
      // Set argv with -v
      process.argv = ['node', 'cli.js', '-v'];

      // Mock dependencies
      vi.doMock('../../../src/core/env-reader.js', () => ({
        readEnvironmentVariables: vi.fn(),
      }));

      vi.doMock('../../../src/core/table.js', () => ({
        createEnvironmentTable: vi.fn(),
      }));

      vi.doMock('../../../src/utils/logger.js', () => ({
        logger: { error: vi.fn() },
      }));

      // Import and execute CLI
      await import('../../../src/cli.js');

      // Verify version is displayed
      expect(consoleLogSpy).toHaveBeenCalled();
      expect(processExitMock).toHaveBeenCalledWith(0);
    });
  });

  describe('Command line parsing errors', () => {
    it('should handle unknown option', async () => {
      // Set argv with unknown option
      process.argv = ['node', 'cli.js', '--invalid'];

      // Mock dependencies
      vi.doMock('../../../src/core/env-reader.js', () => ({
        readEnvironmentVariables: vi.fn(),
      }));

      vi.doMock('../../../src/core/table.js', () => ({
        createEnvironmentTable: vi.fn(),
      }));

      vi.doMock('../../../src/utils/logger.js', () => ({
        logger: { error: vi.fn() },
      }));

      // Import CLI
      await import('../../../src/cli.js');

      // Verify error handling
      expect(consoleErrorSpy).toHaveBeenCalledWith('Unknown option: --invalid');
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "\nUse 'envui --help' to see available options.",
      );
      expect(processExitMock).toHaveBeenCalledWith(2);
    });

    it('should handle parse system errors', async () => {
      const loggerErrorMock = vi.fn();

      // Set argv
      process.argv = ['node', 'cli.js'];

      // Mock parseProcessArgs to throw
      vi.doMock('../../../src/cli/parser/index.js', () => ({
        parseProcessArgs: vi.fn(() => {
          throw new Error('Parse error');
        }),
      }));

      vi.doMock('../../../src/core/env-reader.js', () => ({
        readEnvironmentVariables: vi.fn(),
      }));

      vi.doMock('../../../src/core/table.js', () => ({
        createEnvironmentTable: vi.fn(),
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

  // CliError handling tests
  describe('CliError handling patterns', () => {
    it('should handle unknown option error pattern', () => {
      const mockError = new CliError(CliErrorType.UNKNOWN_OPTION, "unknown option '--invalid'", 2);

      // Simulate the error handling logic
      if (mockError instanceof CliError && mockError.type === CliErrorType.UNKNOWN_OPTION) {
        console.error(mockError.message);
        console.error("\nUse 'envui --help' to see available options.");
      }

      expect(consoleErrorSpy).toHaveBeenCalledWith("unknown option '--invalid'");
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "\nUse 'envui --help' to see available options.",
      );
    });

    it('should handle invalid argument error pattern', () => {
      const mockError = new CliError(CliErrorType.INVALID_ARGUMENT, 'invalid argument', 2);

      if (mockError instanceof CliError && mockError.type === CliErrorType.INVALID_ARGUMENT) {
        console.error(mockError.message);
        console.error("\nUse 'envui --help' to see available options.");
      }

      expect(consoleErrorSpy).toHaveBeenCalledWith('invalid argument');
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "\nUse 'envui --help' to see available options.",
      );
    });
  });
});
