#!/usr/bin/env node

import { parseProcessArgs } from './cli/parser/index.js';
import { handleParseError, handleSystemError } from './cli/errors/index.js';
import { createCliConfig } from './cli/config.js';
import {
  handleHelpCommand,
  handleVersionCommand,
  handleMainCommand,
} from './cli/handlers/index.js';

/**
 * Execute command based on parsed arguments
 */
function executeCommand(
  command: string,
  args: ReadonlyArray<string>,
  config: ReturnType<typeof createCliConfig>,
): void {
  const commandHandlers: Record<string, () => void> = {
    help: () => handleHelpCommand(config.helpText),
    version: () => handleVersionCommand(),
    main: () => handleMainCommand(args),
  };

  const handler = commandHandlers[command];
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

  try {
    const parseResult = parseProcessArgs(config);

    if (!parseResult.success) {
      handleParseError(parseResult.error);
      return;
    }

    executeCommand(parseResult.data.command, parseResult.data.arguments, config);
  } catch (error) {
    handleSystemError(error);
  }
}

main();
