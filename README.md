# envui

Beautiful environment variable viewer - A modern alternative to `printenv`

## About

envui is a CLI tool that displays environment variables in a clean, readable table format with color highlighting. It's designed to be a more user-friendly alternative to the traditional `printenv` command.

## Installation

```bash
git clone https://github.com/flowernotfound/envui.git
cd envui
pnpm install
pnpm build
```

## Usage

```bash
# Display all environment variables
./dist/cli.js

# Prefix filtering (case-insensitive)
./dist/cli.js VITE_
./dist/cli.js NODE_

# Filter by partial match (case-insensitive)
./dist/cli.js --filter API
./dist/cli.js -f API
./dist/cli.js --filter database
./dist/cli.js -f database

# Display help
./dist/cli.js --help

# Show version
./dist/cli.js --version
```

## Development

```bash
# Install dependencies
pnpm install

# Build the project
pnpm build

# Run in development mode
pnpm dev

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Type checking
pnpm typecheck

# Lint code
pnpm lint

# Fix lint issues automatically
pnpm lint:fix

# Format code
pnpm format

# Check code formatting
pnpm format:check

# Clean build artifacts
pnpm clean
```

## License

MIT
