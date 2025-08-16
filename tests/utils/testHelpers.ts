import { vi, type MockInstance, type MockedFunction } from 'vitest';

/**
 * Creates a properly typed process.exit mock
 * This ensures type safety when testing code that calls process.exit()
 */
export const createProcessExitMock = () =>
  vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);

export type ProcessExitMock = ReturnType<typeof createProcessExitMock>;

/**
 * Console spy types for better type safety
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ConsoleLogSpy = MockInstance<[message?: any, ...optionalParams: any[]], void>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ConsoleErrorSpy = MockInstance<[message?: any, ...optionalParams: any[]], void>;

/**
 * Mock function types for better type safety
 */
export type LoggerErrorMock = MockedFunction<(message: string) => void>;

/**
 * Creates a properly typed console.log spy
 */
export const createConsoleLogSpy = () => vi.spyOn(console, 'log').mockImplementation(() => {});

/**
 * Creates a properly typed console.error spy
 */
export const createConsoleErrorSpy = () => vi.spyOn(console, 'error').mockImplementation(() => {});

/**
 * Creates a properly typed logger error mock
 */
export const createLoggerErrorMock = () => vi.fn<[string], void>();
