#!/usr/bin/env node

import { parseProcessArgs } from './cli/parser/index.js';
import { createCliError, isCliError, CliErrorType, handleCliError } from './cli/errors/index.js';
import { createCliConfig } from './cli/config.js';
import {
  handleHelpCommand,
  handleVersionCommand,
  handleMainCommand,
} from './cli/handlers/index.js';
import { logger } from './utils/logger.js';
import { EXIT_CODES } from './constants/index.js';

/**
 * Handle parse errors
 */
function handleParseError(parseError: { type: string; message: string; code: number }): void {
  const error = createCliError(
    parseError.type === 'unknown_option'
      ? CliErrorType.UNKNOWN_OPTION
      : CliErrorType.INVALID_ARGUMENT,
    parseError.message,
    parseError.code,
  );
  handleCliError(error);
  process.exit(error.exitCode);
}

/**
 * Execute command based on parsed arguments
 */
function executeCommand(command: string, config: ReturnType<typeof createCliConfig>): void {
  // Command handler map
  const commandHandlers: Record<string, () => void> = {
    help: () => handleHelpCommand(config.helpText),
    version: () => handleVersionCommand(),
    main: () => handleMainCommand(),
  };

  // Execute command handler
  const handler = commandHandlers[command];
  if (handler) {
    handler();
  } else {
    // Unexpected command
    logger.error('An unexpected error occurred');
    process.exit(EXIT_CODES.SYSTEM_ERROR);
  }
}

/**
 * Handle system errors
 */
function handleSystemError(error: unknown): void {
  if (isCliError(error)) {
    handleCliError(error);
    process.exit(error.exitCode);
  } else if (error instanceof Error) {
    logger.error(error.message);
  } else {
    logger.error('An unexpected error occurred');
  }
  process.exit(EXIT_CODES.SYSTEM_ERROR);
}

/**
 * Main CLI execution function
 */
function main(): void {
  const config = createCliConfig();

  try {
    // Parse command line arguments
    const parseResult = parseProcessArgs(config);

    if (!parseResult.success) {
      handleParseError(parseResult.error);
      return;
    }

    // Execute command
    executeCommand(parseResult.data.command, config);
  } catch (error) {
    handleSystemError(error);
  }
}

// Execute main function
main();
