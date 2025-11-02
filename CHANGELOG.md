# Changelog

All notable changes to Kaizen will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Production-ready configuration files
- CI/CD pipelines for automated builds and testing
- Contributing guidelines
- Security policy
- Environment variables example file

## [0.5.0] - 2025-10-27

### Added
- Privacy-first Chrome extension with local AI capabilities
- Tab management and organization features
- Content summarization using local AI
- Behavior tracking and intervention system
- Knowledge base integration
- Chrome AI API integration (experimental features)
- Side panel for quick access
- Options page for customization
- DevTools integration
- Multi-language support (i18n)
- Hot Module Reload (HMR) for development
- Firefox support

### Features
- **Behavior Engine**: Monitor and analyze browsing patterns
- **Interventions**: Smart nudges and reminders
- **Detectors**: Identify page types and content
- **Knowledge Base**: Store and retrieve information locally
- **Content Scripts**: Inject UI and functionality into web pages
- **Storage**: Efficient local storage management
- **Module Manager**: Enable/disable features as needed

### Technical
- Built with React 19 and TypeScript
- Vite for fast builds
- Turborepo for monorepo management
- ESLint and Prettier for code quality
- WebdriverIO for E2E testing
- Tailwind CSS for styling
- Chrome Extension Manifest V3

## [0.4.0] - Previous Release

### Added
- Initial public release
- Core extension functionality
- Basic AI integration

---

## Release Notes

### How to Update

1. Pull the latest changes:
   ```bash
   git pull origin main
   ```

2. Install new dependencies:
   ```bash
   pnpm install
   ```

3. Rebuild the extension:
   ```bash
   pnpm build
   ```

4. Reload the extension in your browser

### Breaking Changes

Breaking changes will be documented here in future releases.

### Migration Guide

Migration guides for major version changes will be provided here.

---

For more details on any release, see the [GitHub Releases](https://github.com/Recursion-Labs/kaizen/releases) page.
