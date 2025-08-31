#!/usr/bin/env node

import { parseProcessArgs } from './cli/parser/index.js';
import type { ParsedArgs } from './cli/parser/types.js';
import { handleParseError, handleSystemError, isCliError } from './cli/errors/index.js';
import { createCliConfig } from './cli/config.js';
import {
  handleHelpCommand,
  handleVersionCommand,
  handleMainCommand,
} from './cli/handlers/index.js';
import updateNotifier from 'update-notifier';
import pkg from '../package.json' with { type: 'json' };
import { CliErrorType } from './cli/errors/types.js';
import { logger } from './utils/logger.js';

/**
 * Execute command based on parsed arguments
 */
function executeCommand(parsedArgs: ParsedArgs, config: ReturnType<typeof createCliConfig>): void {
  const commandHandlers: Record<string, () => void> = {
    help: () => handleHelpCommand(config.helpText),
    version: () => handleVersionCommand(),
    main: () => handleMainCommand(parsedArgs.arguments, parsedArgs),
  };

  const handler = commandHandlers[parsedArgs.command];
  if (handler) {
    handler();
  } else {
    handleSystemError(new Error('An unexpected error occurred'));
  }
}

/**
 * Main CLI execution function
 */
function main(): void {
  const config = createCliConfig();

  // Initialize update notifier
  const notifier = updateNotifier({
    pkg,
    updateCheckInterval: 1000 * 60 * 60 * 24,
  });

  try {
    const parseResult = parseProcessArgs(config);

    if (!parseResult.success) {
      handleParseError(parseResult.error);
      return;
    }

    executeCommand(parseResult.data, config);
  } catch (error) {
    // Handle SUCCESS_EXIT case specially to show update notification
    if (isCliError(error) && error.type === CliErrorType.SUCCESS_EXIT) {
      // Display the main output
      logger.userInfo(error.message);

      // Show update notification if available
      if (notifier.update) {
        notifier.notify();
      }

      process.exit(error.exitCode);
    } else {
      handleSystemError(error);
    }
  }
}

main();
