import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createCliError, isCliError, CliErrorType } from '../../../src/cli/errors/index.js';
import {
  createProcessExitMock,
  createConsoleErrorSpy,
  createLoggerErrorMock,
  createLoggerUserErrorMock,
  type ProcessExitMock,
  type ConsoleErrorSpy,
  type LoggerErrorMock,
  type LoggerUserErrorMock,
} from '../../utils/testHelpers.js';

describe('CLI', () => {
  let consoleErrorSpy: ConsoleErrorSpy;
  let processExitMock: ProcessExitMock;
  let processArgv: string[];
  let loggerErrorMock: LoggerErrorMock;
  let loggerUserErrorMock: LoggerUserErrorMock;
  let loggerUserInfoMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Reset modules before each test
    vi.resetModules();

    // Save original argv
    processArgv = process.argv;

    // Setup spies
    consoleErrorSpy = createConsoleErrorSpy();
    processExitMock = createProcessExitMock();
    loggerErrorMock = createLoggerErrorMock();
    loggerUserErrorMock = createLoggerUserErrorMock();
    loggerUserInfoMock = vi.fn();
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
      vi.doMock('../../../src/core/envReader.js', () => ({
        readEnvironmentVariables: vi.fn(() => [
          { key: 'NODE_ENV', value: 'test' },
          { key: 'PORT', value: '3000' },
        ]),
      }));

      vi.doMock('../../../src/core/table.js', () => ({
        createEnvironmentTable: vi.fn(() => 'mocked table output'),
      }));

      vi.doMock('../../../src/utils/logger.js', () => ({
        logger: {
          error: loggerErrorMock,
          userError: loggerUserErrorMock,
          userInfo: loggerUserInfoMock,
        },
      }));

      // Import and execute CLI
      await import('../../../src/cli.js');

      // Verify behavior
      expect(loggerUserInfoMock).toHaveBeenCalledWith('mocked table output');
      expect(processExitMock).toHaveBeenCalledWith(0);
    });

    it('should display error message when no environment variables found', async () => {
      // Set argv for main command
      process.argv = ['node', 'cli.js'];

      // Mock dependencies
      vi.doMock('../../../src/core/envReader.js', () => ({
        readEnvironmentVariables: vi.fn(() => []),
      }));

      vi.doMock('../../../src/core/table.js', () => ({
        createEnvironmentTable: vi.fn(),
      }));

      vi.doMock('../../../src/utils/logger.js', () => ({
        logger: {
          error: loggerErrorMock,
          userError: loggerUserErrorMock,
          userInfo: loggerUserInfoMock,
        },
      }));

      // Import and execute CLI
      await import('../../../src/cli.js');

      // Verify behavior
      expect(loggerUserInfoMock).toHaveBeenCalledWith('No environment variables found');
      expect(processExitMock).toHaveBeenCalledWith(2);
    });

    it('should handle system errors gracefully', async () => {
      const localLoggerErrorMock = createLoggerErrorMock();

      // Set argv for main command
      process.argv = ['node', 'cli.js'];

      // Mock dependencies
      vi.doMock('../../../src/core/envReader.js', () => ({
        readEnvironmentVariables: vi.fn(() => {
          throw new Error('Read error');
        }),
      }));

      vi.doMock('../../../src/core/table.js', () => ({
        createEnvironmentTable: vi.fn(),
      }));

      vi.doMock('../../../src/utils/logger.js', () => ({
        logger: {
          error: localLoggerErrorMock,
          userError: vi.fn(),
          userInfo: vi.fn(),
        },
      }));

      // Import and execute CLI
      await import('../../../src/cli.js');

      // Verify behavior
      expect(localLoggerErrorMock).toHaveBeenCalledWith('Read error');
      expect(processExitMock).toHaveBeenCalledWith(1);
    });

    it('should handle non-Error exceptions', async () => {
      const localLoggerErrorMock = createLoggerErrorMock();

      // Set argv for main command
      process.argv = ['node', 'cli.js'];

      // Mock dependencies
      vi.doMock('../../../src/core/envReader.js', () => ({
        readEnvironmentVariables: vi.fn(() => {
          throw 'string error'; // Non-Error exception
        }),
      }));

      vi.doMock('../../../src/core/table.js', () => ({
        createEnvironmentTable: vi.fn(),
      }));

      vi.doMock('../../../src/utils/logger.js', () => ({
        logger: {
          error: localLoggerErrorMock,
          userError: vi.fn(),
          userInfo: vi.fn(),
        },
      }));

      // Import and execute CLI
      await import('../../../src/cli.js');

      // Verify behavior
      expect(localLoggerErrorMock).toHaveBeenCalledWith('An unexpected error occurred');
      expect(processExitMock).toHaveBeenCalledWith(1);
    });
  });

  describe('Command line options', () => {
    it('should display help when --help is passed', async () => {
      // Set argv with --help
      process.argv = ['node', 'cli.js', '--help'];

      const localLoggerUserInfoMock = vi.fn();

      // Mock dependencies
      vi.doMock('../../../src/core/envReader.js', () => ({
        readEnvironmentVariables: vi.fn(),
      }));

      vi.doMock('../../../src/core/table.js', () => ({
        createEnvironmentTable: vi.fn(),
      }));

      vi.doMock('../../../src/utils/logger.js', () => ({
        logger: {
          error: vi.fn(),
          userError: vi.fn(),
          userInfo: localLoggerUserInfoMock,
        },
      }));

      // Import and execute CLI
      await import('../../../src/cli.js');

      // Verify help is displayed through userInfo
      expect(localLoggerUserInfoMock).toHaveBeenCalled();
      const helpOutput = localLoggerUserInfoMock.mock.calls[0][0];
      expect(helpOutput).toContain('envui');
      expect(helpOutput).toContain('Beautiful environment variable viewer');
      expect(helpOutput).toContain('--help');
      expect(processExitMock).toHaveBeenCalledWith(0);
    });

    it('should display help when -h is passed', async () => {
      // Set argv with -h
      process.argv = ['node', 'cli.js', '-h'];

      const localLoggerUserInfoMock = vi.fn();

      // Mock dependencies
      vi.doMock('../../../src/core/envReader.js', () => ({
        readEnvironmentVariables: vi.fn(),
      }));

      vi.doMock('../../../src/core/table.js', () => ({
        createEnvironmentTable: vi.fn(),
      }));

      vi.doMock('../../../src/utils/logger.js', () => ({
        logger: {
          error: vi.fn(),
          userError: vi.fn(),
          userInfo: localLoggerUserInfoMock,
        },
      }));

      // Import and execute CLI
      await import('../../../src/cli.js');

      // Verify help is displayed through userInfo
      expect(localLoggerUserInfoMock).toHaveBeenCalled();
      const helpOutput = localLoggerUserInfoMock.mock.calls[0][0];
      expect(helpOutput).toContain('envui');
      expect(processExitMock).toHaveBeenCalledWith(0);
    });

    it('should display version when --version is passed', async () => {
      // Set argv with --version
      process.argv = ['node', 'cli.js', '--version'];

      const localLoggerUserInfoMock = vi.fn();

      // Mock dependencies
      vi.doMock('../../../src/core/envReader.js', () => ({
        readEnvironmentVariables: vi.fn(),
      }));

      vi.doMock('../../../src/core/table.js', () => ({
        createEnvironmentTable: vi.fn(),
      }));

      vi.doMock('../../../src/utils/logger.js', () => ({
        logger: {
          error: vi.fn(),
          userError: vi.fn(),
          userInfo: localLoggerUserInfoMock,
        },
      }));

      // Import and execute CLI
      await import('../../../src/cli.js');

      // Verify version is displayed through userInfo
      expect(localLoggerUserInfoMock).toHaveBeenCalled();
      expect(processExitMock).toHaveBeenCalledWith(0);
    });

    it('should display version when -v is passed', async () => {
      // Set argv with -v
      process.argv = ['node', 'cli.js', '-v'];

      const localLoggerUserInfoMock = vi.fn();

      // Mock dependencies
      vi.doMock('../../../src/core/envReader.js', () => ({
        readEnvironmentVariables: vi.fn(),
      }));

      vi.doMock('../../../src/core/table.js', () => ({
        createEnvironmentTable: vi.fn(),
      }));

      vi.doMock('../../../src/utils/logger.js', () => ({
        logger: {
          error: vi.fn(),
          userError: vi.fn(),
          userInfo: localLoggerUserInfoMock,
        },
      }));

      // Import and execute CLI
      await import('../../../src/cli.js');

      // Verify version is displayed through userInfo
      expect(localLoggerUserInfoMock).toHaveBeenCalled();
      expect(processExitMock).toHaveBeenCalledWith(0);
    });
  });

  describe('Command line parsing errors', () => {
    it('should handle unknown option', async () => {
      // Set argv with unknown option
      process.argv = ['node', 'cli.js', '--invalid'];

      // Mock dependencies
      vi.doMock('../../../src/core/envReader.js', () => ({
        readEnvironmentVariables: vi.fn(),
      }));

      vi.doMock('../../../src/core/table.js', () => ({
        createEnvironmentTable: vi.fn(),
      }));

      vi.doMock('../../../src/utils/logger.js', () => ({
        logger: {
          error: loggerErrorMock,
          userError: loggerUserErrorMock,
          userInfo: vi.fn(),
        },
      }));

      // Import CLI
      await import('../../../src/cli.js');

      // Verify error handling
      expect(loggerUserErrorMock).toHaveBeenCalledWith('Unknown option: --invalid', {
        hint: "Try 'envui --help' for more information.",
      });
      expect(processExitMock).toHaveBeenCalledWith(2);
    });

    it('should handle parse system errors', async () => {
      const localLoggerErrorMock = createLoggerErrorMock();

      // Set argv
      process.argv = ['node', 'cli.js'];

      // Mock parseProcessArgs to throw
      vi.doMock('../../../src/cli/parser/index.js', () => ({
        parseProcessArgs: vi.fn(() => {
          throw new Error('Parse error');
        }),
      }));

      vi.doMock('../../../src/core/envReader.js', () => ({
        readEnvironmentVariables: vi.fn(),
      }));

      vi.doMock('../../../src/core/table.js', () => ({
        createEnvironmentTable: vi.fn(),
      }));

      vi.doMock('../../../src/utils/logger.js', () => ({
        logger: { error: localLoggerErrorMock },
      }));

      // Import CLI
      await import('../../../src/cli.js');

      // Verify error handling
      expect(localLoggerErrorMock).toHaveBeenCalledWith('Parse error');
      expect(processExitMock).toHaveBeenCalledWith(1);
    });
  });

  // CliError handling tests
  describe('CliError handling patterns', () => {
    it('should handle unknown option error pattern', () => {
      const mockError = createCliError(
        CliErrorType.UNKNOWN_OPTION,
        "unknown option '--invalid'",
        2,
      );

      // Simulate the error handling logic
      if (isCliError(mockError) && mockError.type === CliErrorType.UNKNOWN_OPTION) {
        console.error(mockError.message);
        console.error("\nUse 'envui --help' to see available options.");
      }

      expect(consoleErrorSpy).toHaveBeenCalledWith("unknown option '--invalid'");
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "\nUse 'envui --help' to see available options.",
      );
    });

    it('should handle invalid argument error pattern', () => {
      const mockError = createCliError(CliErrorType.INVALID_ARGUMENT, 'invalid argument', 2);

      if (isCliError(mockError) && mockError.type === CliErrorType.INVALID_ARGUMENT) {
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
