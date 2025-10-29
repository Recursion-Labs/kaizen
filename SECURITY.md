# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 0.5.x   | :white_check_mark: |
| < 0.5   | :x:                |

## Reporting a Vulnerability

We take the security of Kaizen seriously. If you believe you have found a security vulnerability, please report it to us responsibly.

### How to Report

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them via one of the following methods:

1. **Email**: Send details to [security@recursion-labs.com](mailto:security@recursion-labs.com)
2. **GitHub Security Advisory**: Use the [Security Advisory](https://github.com/Recursion-Labs/kaizen/security/advisories/new) feature

### What to Include

Please include the following information in your report:

- **Type of vulnerability** (e.g., XSS, CSRF, injection, etc.)
- **Full paths** of source file(s) related to the vulnerability
- **Location** of the affected source code (tag/branch/commit)
- **Step-by-step instructions** to reproduce the issue
- **Proof-of-concept or exploit code** (if possible)
- **Impact** of the vulnerability
- **Suggested fix** (if you have one)

### What to Expect

- **Acknowledgment**: We'll acknowledge receipt of your report within 48 hours
- **Updates**: We'll send you regular updates about our progress
- **Timeline**: We aim to resolve critical issues within 30 days
- **Credit**: We'll credit you in the security advisory (unless you prefer to remain anonymous)

## Security Best Practices

### For Users

1. **Keep Updated**: Always use the latest version of Kaizen
2. **Review Permissions**: Understand what permissions the extension requires
3. **Report Issues**: If you notice suspicious behavior, report it immediately
4. **Disable If Concerned**: You can disable the extension at any time from browser settings

### For Developers

1. **Input Validation**: Always validate and sanitize user input
2. **Content Security Policy**: Follow CSP guidelines for extension development
3. **Minimal Permissions**: Request only necessary permissions
4. **Secure Storage**: Use chrome.storage.local with encryption for sensitive data
5. **Code Review**: All code changes must be reviewed before merging
6. **Dependency Updates**: Keep dependencies up to date
7. **No Secrets in Code**: Never commit secrets, API keys, or tokens

## Privacy and Data Security

Kaizen is designed with privacy as a core principle:

- **Local Processing**: All data processing happens locally in your browser
- **No External Transmission**: We don't send your browsing data to external servers
- **User Control**: You have full control over your data
- **Open Source**: Our code is open for security audits

For more details, see our [Privacy Policy](PRIVACY.md).

## Known Security Considerations

### Chrome AI API Trial Tokens

The extension includes trial tokens for Chrome's experimental AI APIs. These tokens:
- Are only used in development builds
- Are publicly visible in the manifest
- Have expiration dates
- Are tied to specific Chrome extension IDs
- Cannot be used maliciously for other purposes

### Content Script Injection

The extension injects content scripts into web pages. We:
- Follow least-privilege principles
- Isolate content scripts from page context
- Use secure communication channels
- Validate all messages between scripts

### Storage Security

While chrome.storage is relatively secure:
- It's not encrypted by default
- Other extensions could potentially access it
- We recommend not storing highly sensitive information

## Security Updates

Security updates are released as soon as possible after a vulnerability is confirmed. Check:
- [GitHub Releases](https://github.com/Recursion-Labs/kaizen/releases)
- [CHANGELOG.md](CHANGELOG.md)
- [Security Advisories](https://github.com/Recursion-Labs/kaizen/security/advisories)

## Scope

The following are **in scope** for security reports:
- Cross-site scripting (XSS)
- Content script vulnerabilities
- Message passing vulnerabilities
- Storage security issues
- Permission abuse
- Privacy leaks
- Code injection

The following are **out of scope**:
- Issues in third-party dependencies (report to the dependency maintainer)
- Social engineering attacks
- Physical attacks
- Denial of service attacks against local resources
- Issues that require physical access to the user's device

## Bug Bounty

We currently do not offer a bug bounty program, but we greatly appreciate security researchers who report vulnerabilities responsibly. We will:
- Acknowledge your contribution publicly (if you wish)
- Keep you informed throughout the fix process
- Credit you in release notes and security advisories

## Contact

For security concerns, contact:
- **Email**: security@recursion-labs.com
- **GitHub**: Use [Security Advisories](https://github.com/Recursion-Labs/kaizen/security/advisories)

For general questions, use:
- **Discord**: [Join our community](https://discord.gg/4ERQ6jgV9a)
- **Issues**: [GitHub Issues](https://github.com/Recursion-Labs/kaizen/issues)

---

Thank you for helping keep Kaizen and its users safe! 🔒
