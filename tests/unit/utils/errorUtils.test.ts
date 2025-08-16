import { describe, it, expect } from 'vitest';
import { extractErrorMessage, wrapError } from '../../../src/utils/errorUtils.js';

describe('extractErrorMessage', () => {
  it('should extract message from Error instance', () => {
    const error = new Error('Test error message');
    expect(extractErrorMessage(error)).toBe('Test error message');
  });

  it('should return "Unknown error" for string', () => {
    expect(extractErrorMessage('string error')).toBe('Unknown error');
  });

  it('should return "Unknown error" for null', () => {
    expect(extractErrorMessage(null)).toBe('Unknown error');
  });

  it('should return "Unknown error" for undefined', () => {
    expect(extractErrorMessage(undefined)).toBe('Unknown error');
  });

  it('should return "Unknown error" for object without message', () => {
    expect(extractErrorMessage({ code: 'ERR_TEST' })).toBe('Unknown error');
  });
});

describe('wrapError', () => {
  it('should wrap Error instance with context', () => {
    const originalError = new Error('Original message');
    const wrappedError = wrapError('Test context', originalError);

    expect(wrappedError).toBeInstanceOf(Error);
    expect(wrappedError.message).toBe('Test context: Original message');
  });

  it('should wrap unknown error with context', () => {
    const wrappedError = wrapError('Test context', 'unknown error');

    expect(wrappedError).toBeInstanceOf(Error);
    expect(wrappedError.message).toBe('Test context: Unknown error');
  });

  it('should wrap null error with context', () => {
    const wrappedError = wrapError('Test context', null);

    expect(wrappedError).toBeInstanceOf(Error);
    expect(wrappedError.message).toBe('Test context: Unknown error');
  });
});
