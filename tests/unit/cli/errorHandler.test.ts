import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CliErrorType, createCliError } from '../../../src/cli/errors/index.js';
import { createProcessExitMock, type ProcessExitMock } from '../../utils/testHelpers.js';

describe('Error Handler', () => {
  let processExitMock: ProcessExitMock;
  let loggerErrorMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.resetModules();
    processExitMock = createProcessExitMock();
    loggerErrorMock = vi.fn();

    vi.doMock('../../../src/utils/logger.js', () => ({
      logger: { error: loggerErrorMock },
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('handleParseError', () => {
    it('should handle unknown option parse error', async () => {
      const { handleParseError } = await import('../../../src/cli/errors/errorHandler.js');
      const parseError = { type: 'unknown_option', message: 'Unknown option', code: 2 };

      handleParseError(parseError);

      expect(loggerErrorMock).toHaveBeenCalledWith('Unknown option');
      expect(processExitMock).toHaveBeenCalledWith(2);
    });

    it('should handle invalid argument parse error', async () => {
      const { handleParseError } = await import('../../../src/cli/errors/errorHandler.js');
      const parseError = { type: 'invalid_argument', message: 'Invalid argument', code: 2 };

      handleParseError(parseError);

      expect(loggerErrorMock).toHaveBeenCalledWith('Invalid argument');
      expect(processExitMock).toHaveBeenCalledWith(2);
    });
  });

  describe('handleSystemError', () => {
    it('should handle CLI error', async () => {
      const { handleSystemError } = await import('../../../src/cli/errors/errorHandler.js');
      const cliError = createCliError(CliErrorType.SYSTEM_ERROR, 'System error', 1);

      handleSystemError(cliError);

      expect(loggerErrorMock).toHaveBeenCalledWith('System error');
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
