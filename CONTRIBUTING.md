# Contributing to `typelit`

Thank you for your interest in contributing to Typelit! This document will guide
you through setting up your development environment and explain our development
process.

## Development Setup

### Prerequisites

- Node.js (LTS version recommended)
- npm or yarn
- Git

### Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/typelit.git
cd typelit
```

3. Install dependencies:

```bash
npm install
```

## Building

The project uses Rollup to build multiple output formats:

- CommonJS (for Node.js)
- ES Modules (for modern bundlers)
- UMD (for browsers)

Available build commands:

```bash
npm run build  # Build once
npm run dev    # Build in watch mode for development
```

Built files will be available in the `dist` directory with the following
structure:

```
dist/
  ├── cjs/     # CommonJS format
  ├── esm/     # ES Modules format
  ├── umd/     # UMD format
  └── index.d.ts  # TypeScript declarations
```

## Testing

We use Vitest for testing. Write tests in files with the `.test.ts` extension.

Available test commands:

```bash
npm test        # Run tests once
npm test watch  # Run tests in watch mode
```

## Code Quality

### Linting

We use ESLint with TypeScript support and Prettier for code formatting:

```bash
npm run lint  # Run linting checks
```

Configure your IDE to use the project's ESLint and Prettier configurations for
the best development experience.

## Documentation

- Keep the `README.md` up to date if you're changing user-facing functionality
- Document new features with examples
- Update JSDoc comments for any modified public APIs

## Questions?

If you have any questions about contributing, feel free to open an issue in the
GitHub repository.
