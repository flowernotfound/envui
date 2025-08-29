import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { logger } from '../../../src/utils/logger.js';

describe('logger', () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // @ts-expect-error - vitest type compatibility issue
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    // @ts-expect-error - vitest type compatibility issue
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    // @ts-expect-error - vitest type compatibility issue
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('debug', () => {
    it('should output debug message with [DEBUG] prefix using console.log', () => {
      logger.debug('debug message');

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith('[DEBUG] debug message');
    });
  });

  describe('info', () => {
    it('should output info message with [INFO] prefix using console.log', () => {
      logger.info('info message');

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith('[INFO] info message');
    });
  });

  describe('warn', () => {
    it('should output warn message with [WARN] prefix using console.warn', () => {
      logger.warn('warn message');

      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      expect(consoleWarnSpy).toHaveBeenCalledWith('[WARN] warn message');
    });
  });

  describe('error', () => {
    it('should output error message with [ERROR] prefix using console.error', () => {
      logger.error('error message');

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith('[ERROR] error message');
    });
  });

  describe('userError', () => {
    it('should output error message with Error: prefix', () => {
      logger.userError('test error');

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error: test error');
    });

    it('should output error message with usage details', () => {
      logger.userError('test error', { usage: 'usage details' });

      expect(consoleErrorSpy).toHaveBeenCalledTimes(3);
      expect(consoleErrorSpy).toHaveBeenNthCalledWith(1, 'Error: test error');
      expect(consoleErrorSpy).toHaveBeenNthCalledWith(2, 'Usage:');
      expect(consoleErrorSpy).toHaveBeenNthCalledWith(3, 'usage details');
    });

    it('should output error message with hint', () => {
      logger.userError('test error', { hint: 'helpful hint' });

      expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
      expect(consoleErrorSpy).toHaveBeenNthCalledWith(1, 'Error: test error');
      expect(consoleErrorSpy).toHaveBeenNthCalledWith(2, 'helpful hint');
    });

    it('should prioritize usage over hint when both are provided', () => {
      logger.userError('test error', { usage: 'usage details', hint: 'helpful hint' });

      expect(consoleErrorSpy).toHaveBeenCalledTimes(3);
      expect(consoleErrorSpy).toHaveBeenNthCalledWith(1, 'Error: test error');
      expect(consoleErrorSpy).toHaveBeenNthCalledWith(2, 'Usage:');
      expect(consoleErrorSpy).toHaveBeenNthCalledWith(3, 'usage details');
    });
  });

  describe('userInfo', () => {
    it('should output info message without prefix', () => {
      logger.userInfo('test info');

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith('test info');
    });
  });

  describe('all log levels', () => {
    it('should handle empty strings', () => {
      logger.debug('');
      logger.info('');
      logger.warn('');
      logger.error('');

      expect(consoleLogSpy).toHaveBeenCalledWith('[DEBUG] ');
      expect(consoleLogSpy).toHaveBeenCalledWith('[INFO] ');
      expect(consoleWarnSpy).toHaveBeenCalledWith('[WARN] ');
      expect(consoleErrorSpy).toHaveBeenCalledWith('[ERROR] ');
    });

    it('should handle messages with special characters', () => {
      const specialMessage = 'テスト\n改行\tタブ"引用符';

      logger.debug(specialMessage);
      logger.info(specialMessage);
      logger.warn(specialMessage);
      logger.error(specialMessage);

      expect(consoleLogSpy).toHaveBeenCalledWith(`[DEBUG] ${specialMessage}`);
      expect(consoleLogSpy).toHaveBeenCalledWith(`[INFO] ${specialMessage}`);
      expect(consoleWarnSpy).toHaveBeenCalledWith(`[WARN] ${specialMessage}`);
      expect(consoleErrorSpy).toHaveBeenCalledWith(`[ERROR] ${specialMessage}`);
    });
  });
});
