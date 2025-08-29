import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  createConsoleErrorSpy,
  createLoggerErrorMock,
  createLoggerUserErrorMock,
  type ConsoleErrorSpy,
  type LoggerErrorMock,
  type LoggerUserErrorMock,
} from '../../utils/testHelpers.js';
import {
  createCliError,
  isCliError,
  CliErrorType,
  createUnknownOptionError,
  createSystemError,
  type CliErrorObject,
} from '../../../src/cli/errors/index.js';

describe('CLI Errors', () => {
  let consoleErrorSpy: ConsoleErrorSpy;
  let loggerErrorMock: LoggerErrorMock;
  let loggerUserErrorMock: LoggerUserErrorMock;

  beforeEach(() => {
    consoleErrorSpy = createConsoleErrorSpy();
    loggerErrorMock = createLoggerErrorMock();
    loggerUserErrorMock = createLoggerUserErrorMock();

    vi.doMock('../../../src/utils/logger.js', () => ({
      logger: {
        error: loggerErrorMock,
        userError: loggerUserErrorMock,
      },
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.resetModules();
  });

  describe('createCliError', () => {
    it('should create error with correct properties', () => {
      const error = createCliError(CliErrorType.UNKNOWN_OPTION, 'test message', 2);

      expect(error.type).toBe(CliErrorType.UNKNOWN_OPTION);
      expect(error.message).toBe('test message');
      expect(error.exitCode).toBe(2);
      expect(error.name).toBe('CliError');
    });

    it('should have commander-compatible code property', () => {
      const error = createCliError(CliErrorType.UNKNOWN_OPTION, 'test', 2);

      expect(error.code).toBe('cli.unknown_option');
    });
  });

  describe('isCliError', () => {
    it('should return true for CLI error', () => {
      const error = createCliError(CliErrorType.UNKNOWN_OPTION, 'test', 2);
      expect(isCliError(error)).toBe(true);
    });

    it('should return false for regular Error', () => {
      const error = new Error('test');
      expect(isCliError(error)).toBe(false);
    });

    it('should return false for non-error objects', () => {
      expect(isCliError('string')).toBe(false);
      expect(isCliError(123)).toBe(false);
      expect(isCliError(null)).toBe(false);
      expect(isCliError(undefined)).toBe(false);
    });
  });

  describe('createUnknownOptionError', () => {
    it('should create unknown option error', () => {
      const error = createUnknownOptionError('--invalid');

      expect(error.type).toBe(CliErrorType.UNKNOWN_OPTION);
      expect(error.message).toBe("unknown option '--invalid'");
      expect(error.exitCode).toBe(2);
    });
  });

  describe('createSystemError', () => {
    it('should create system error', () => {
      const error = createSystemError('System failure');

      expect(error.type).toBe(CliErrorType.SYSTEM_ERROR);
      expect(error.message).toBe('System failure');
      expect(error.exitCode).toBe(1);
    });
  });

  describe('handleCliError', () => {
    it('should handle unknown option error', async () => {
      const { handleCliError } = await import('../../../src/cli/errors/handlers.js');
      const error = createCliError(CliErrorType.UNKNOWN_OPTION, "unknown option '--invalid'", 2);

      handleCliError(error);

      expect(loggerUserErrorMock).toHaveBeenCalledWith("unknown option '--invalid'", {
        hint: "Try 'envui --help' for more information.",
      });
    });

    it('should handle invalid argument error (non-filter)', async () => {
      const { handleCliError } = await import('../../../src/cli/errors/handlers.js');
      const error = createCliError(CliErrorType.INVALID_ARGUMENT, 'Invalid argument', 2);

      handleCliError(error);

      expect(loggerUserErrorMock).toHaveBeenCalledWith('Invalid argument', {
        hint: "Try 'envui --help' for more information.",
      });
    });

    it('should handle invalid argument error (--filter)', async () => {
      const { handleCliError } = await import('../../../src/cli/errors/handlers.js');
      const error = createCliError(
        CliErrorType.INVALID_ARGUMENT,
        '--filter option requires a search text',
        2,
      );

      handleCliError(error);

      expect(loggerUserErrorMock).toHaveBeenCalledWith('--filter option requires a search text', {
        usage:
          '  envui [PREFIX]        # Filter by prefix\n  envui --filter TEXT   # Filter by partial match',
      });
    });

    it('should handle system error', async () => {
      const { handleCliError } = await import('../../../src/cli/errors/handlers.js');
      const error = createCliError(CliErrorType.SYSTEM_ERROR, 'System error', 1);

      handleCliError(error);

      expect(loggerUserErrorMock).toHaveBeenCalledWith('System error');
    });

    it('should handle help requested (no output)', async () => {
      const { handleCliError } = await import('../../../src/cli/errors/handlers.js');
      const error = createCliError(CliErrorType.HELP_REQUESTED, 'Help', 0);

      handleCliError(error);

      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should handle version requested (no output)', async () => {
      const { handleCliError } = await import('../../../src/cli/errors/handlers.js');
      const error = createCliError(CliErrorType.VERSION_REQUESTED, 'Version', 0);

      handleCliError(error);

      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should handle unknown error types with default handler', async () => {
      const { handleCliError } = await import('../../../src/cli/errors/handlers.js');

      // Create an error with an unknown type by casting to unknown then to CliErrorObject
      const unknownError = {
        type: 'UNKNOWN_ERROR_TYPE' as unknown as CliErrorType,
        message: 'Unknown error',
        exitCode: 1,
        name: 'CliError',
        code: 'cli.unknown_error_type',
      } as CliErrorObject;

      handleCliError(unknownError);

      // The default case should call logger.userError with generic message
      expect(loggerUserErrorMock).toHaveBeenCalledWith('An unexpected error occurred');
    });
  });
});
