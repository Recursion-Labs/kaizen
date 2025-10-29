# Contributing to Kaizen

Thank you for your interest in contributing to Kaizen! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Community](#community)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment. Please be kind and courteous to all contributors.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/kaizen.git
   cd kaizen
   ```
3. **Add the upstream repository**:
   ```bash
   git remote add upstream https://github.com/Recursion-Labs/kaizen.git
   ```

## Development Setup

### Prerequisites

- Node.js >= 22.15.1 (see `.nvmrc`)
- pnpm >= 10.11.0
- WSL (if on Windows)

### Installation

1. Install pnpm globally:
   ```bash
   npm install -g pnpm
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

4. Start development:
   ```bash
   pnpm dev
   ```

For more details, see the [README.md](README.md).

## How to Contribute

### Reporting Bugs

- Check if the bug has already been reported in [Issues](https://github.com/Recursion-Labs/kaizen/issues)
- If not, create a new issue with:
  - Clear, descriptive title
  - Steps to reproduce
  - Expected vs actual behavior
  - Screenshots (if applicable)
  - Your environment (OS, browser version, extension version)

### Suggesting Features

- Check [existing feature requests](https://github.com/Recursion-Labs/kaizen/issues?q=is%3Aissue+is%3Aopen+label%3Aenhancement)
- Create a new issue with:
  - Clear description of the feature
  - Use cases and benefits
  - Potential implementation approach (optional)

### Contributing Code

1. **Find an issue** to work on or create one
2. **Comment** on the issue to let others know you're working on it
3. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make your changes** following the coding standards
5. **Test your changes** thoroughly
6. **Commit** with clear messages:
   ```bash
   git commit -m "feat: add new feature"
   ```
   Follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` new feature
   - `fix:` bug fix
   - `docs:` documentation changes
   - `style:` formatting, missing semicolons, etc.
   - `refactor:` code restructuring
   - `test:` adding tests
   - `chore:` maintenance tasks

7. **Push** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

## Pull Request Process

1. **Update documentation** if needed
2. **Ensure all tests pass**:
   ```bash
   pnpm type-check
   pnpm lint
   pnpm build
   ```
3. **Create a Pull Request** with:
   - Clear title and description
   - Link to related issues
   - Screenshots/videos for UI changes
   - List of changes made
4. **Wait for review** - maintainers will review your PR
5. **Address feedback** if requested
6. **Get approval** and your PR will be merged!

### PR Checklist

- [ ] Code follows the project's style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] Works on Chrome and Firefox (if applicable)

## Coding Standards

### TypeScript/JavaScript

- Use TypeScript for type safety
- Follow ESLint and Prettier configurations
- Use functional components and hooks for React
- Avoid `any` types - use proper typing
- Keep functions small and focused

### File Organization

- Place shared code in `packages/shared`
- Page-specific code goes in `pages/`
- Extension core in `chrome-extension/`
- Follow existing directory structure

### Naming Conventions

- **Files**: `kebab-case.ts`
- **Components**: `PascalCase.tsx`
- **Functions**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Types/Interfaces**: `PascalCase`

### Comments

- Use JSDoc for functions and components
- Explain "why" not "what"
- Keep comments up-to-date

## Testing

### Running Tests

```bash
# Type checking
pnpm type-check

# Linting
pnpm lint

# E2E tests
pnpm e2e

# Build test
pnpm build
```

### Writing Tests

- Add E2E tests for new features in `tests/`
- Test both Chrome and Firefox when applicable
- Cover edge cases and error scenarios

## Module Management

You can enable/disable modules using:

```bash
pnpm module-manager
```

See [Module Manager docs](packages/module-manager/README.md) for details.

## Environment Variables

See [Environment Variables docs](packages/env/README.md) for configuration options.

## Community

- **Discord**: Join our [Discord server](https://discord.gg/4ERQ6jgV9a)
- **Issues**: Use GitHub Issues for bug reports and feature requests
- **Discussions**: Share ideas and ask questions

## Questions?

If you have questions, feel free to:
- Open a [Discussion](https://github.com/Recursion-Labs/kaizen/discussions)
- Ask in [Discord](https://discord.gg/4ERQ6jgV9a)
- Comment on relevant Issues

Thank you for contributing to Kaizen! 🎉
