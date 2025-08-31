# envui

Beautiful environment variable viewer - A modern alternative to `printenv`

## About

envui is a CLI tool that displays environment variables in a clean, readable table format with color highlighting. It's designed to be a more user-friendly alternative to the traditional `printenv` command.

## Installation

```bash
npm install -g envui
```

## Usage

```bash
# Display all environment variables
envui

# Prefix filtering (case-insensitive)
envui VITE_
envui NODE_

# Filter by partial match (case-insensitive)
envui --filter API
envui -f API
envui --filter database
envui -f database

# Display help
envui --help

# Show version
envui --version
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
