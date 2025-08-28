import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CliErrorType, createCliError } from '../../../src/cli/errors/index.js';
import {
  createProcessExitMock,
  createLoggerUserErrorMock,
  type ProcessExitMock,
  type LoggerUserErrorMock,
} from '../../utils/testHelpers.js';

describe('Error Handler', () => {
  let processExitMock: ProcessExitMock;
  let loggerErrorMock: ReturnType<typeof vi.fn>;
  let loggerUserErrorMock: LoggerUserErrorMock;

  beforeEach(() => {
    vi.resetModules();
    processExitMock = createProcessExitMock();
    loggerErrorMock = vi.fn();
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
  });

  describe('handleParseError', () => {
    it('should handle unknown option parse error', async () => {
      const { handleParseError } = await import('../../../src/cli/errors/errorHandler.js');
      const parseError = { type: 'unknown_option', message: "unknown option '--invalid'", code: 2 };

      handleParseError(parseError);

      expect(loggerUserErrorMock).toHaveBeenCalledWith("unknown option '--invalid'", {
        hint: "Try 'envui --help' for more information.",
      });
      expect(processExitMock).toHaveBeenCalledWith(2);
    });

    it('should handle invalid argument parse error (non-filter)', async () => {
      const { handleParseError } = await import('../../../src/cli/errors/errorHandler.js');
      const parseError = { type: 'invalid_argument', message: 'Invalid argument', code: 2 };

      handleParseError(parseError);

      expect(loggerUserErrorMock).toHaveBeenCalledWith('Invalid argument', {
        hint: "Try 'envui --help' for more information.",
      });
      expect(processExitMock).toHaveBeenCalledWith(2);
    });

    it('should handle invalid argument parse error (--filter)', async () => {
      const { handleParseError } = await import('../../../src/cli/errors/errorHandler.js');
      const parseError = {
        type: 'filter_requires_value',
        message: '--filter option requires a search text',
        code: 1,
      };

      handleParseError(parseError);

      expect(loggerUserErrorMock).toHaveBeenCalledWith('--filter option requires a search text', {
        usage:
          '  envui [PREFIX]        # Filter by prefix\n  envui --filter TEXT   # Filter by partial match',
      });
      expect(processExitMock).toHaveBeenCalledWith(1);
    });
  });

  describe('handleSystemError', () => {
    it('should handle CLI error', async () => {
      const { handleSystemError } = await import('../../../src/cli/errors/errorHandler.js');
      const cliError = createCliError(CliErrorType.SYSTEM_ERROR, 'System error', 1);

      handleSystemError(cliError);

      expect(loggerUserErrorMock).toHaveBeenCalledWith('System error');
      expect(processExitMock).toHaveBeenCalledWith(1);
    });

    it('should handle standard Error', async () => {
      const { handleSystemError } = await import('../../../src/cli/errors/errorHandler.js');
      const error = new Error('Standard error');

      handleSystemError(error);

      expect(loggerErrorMock).toHaveBeenCalledWith('Standard error');
      expect(processExitMock).toHaveBeenCalledWith(1);
    });

    it('should handle unknown error', async () => {
      const { handleSystemError } = await import('../../../src/cli/errors/errorHandler.js');

      handleSystemError('unknown error');

      expect(loggerErrorMock).toHaveBeenCalledWith('An unexpected error occurred');
      expect(processExitMock).toHaveBeenCalledWith(1);
    });
  });
});
