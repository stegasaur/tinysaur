# Contributing to URL Shortener

Thank you for considering contributing to the URL Shortener project! This document provides guidelines and instructions for contributing.

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md) to foster an inclusive and respectful community.

## How Can I Contribute?

### Reporting Bugs

- Check if the bug has already been reported in the Issues section.
- Use the bug report template to provide detailed information about the bug.
- Include steps to reproduce, expected behavior, and actual behavior.
- Add screenshots if applicable.

### Suggesting Features

- Check if the feature has already been suggested in the Issues section.
- Use the feature request template to describe the feature and its benefits.
- Be clear about the use case and why it would benefit the project.

### Code Contributions

#### Setting Up the Development Environment

1. Fork the repository on GitHub.
2. Clone your fork:
   ```bash
   git clone https://github.com/yourusername/url-shortener.git
   cd url-shortener
   ```
3. Set up the upstream remote:
   ```bash
   git remote add upstream https://github.com/originalowner/url-shortener.git
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Create a `.env` file with the required environment variables.

#### Development Workflow

1. Create a new branch for your feature/bugfix:
   ```bash
   git checkout -b feature/my-feature
   # or
   git checkout -b fix/my-bugfix
   ```

2. Make your changes, following the coding standards and guidelines.

3. Run tests to ensure your changes don't break existing functionality:
   ```bash
   npm test
   ```

4. Run linting and formatting:
   ```bash
   npm run lint
   npm run format
   ```

5. Commit your changes following the conventional commit format:
   ```bash
   git commit -m "feat: add new feature"
   # or
   git commit -m "fix: resolve issue with X"
   ```

6. Push your changes to your fork:
   ```bash
   git push origin feature/my-feature
   ```

7. Create a Pull Request from your branch to the main repository.

#### Pull Request Process

1. Ensure your code passes all tests and linting.
2. Update documentation if necessary, including README.md and JSDoc comments.
3. The PR should be linked to an existing issue if applicable.
4. Follow the PR template, describing the changes and any necessary context.
5. Wait for code review and address any requested changes.

## Coding Standards

### JavaScript/TypeScript

- Follow the ESLint and Prettier configurations provided in the project.
- Use ES6+ features appropriately.
- Add JSDoc comments for functions and complex code blocks.
- Use meaningful variable and function names.

### Vue Components

- Follow the Vue style guide (Priority A rules are required).
- Use composition API for new components.
- Keep components focused on a single responsibility.
- Use PascalCase for component names.

### Testing

- Write tests for all new features and bug fixes.
- Maintain or improve code coverage.
- Unit tests for functions and components.
- Integration tests for API endpoints.

## Git Workflow

- Keep commits small and focused on a single change.
- Use descriptive commit messages following conventional commits.
- Rebase your branch on the latest main before submitting a PR.
- Squash related commits before merging if requested.

## Documentation

- Update README.md for user-facing changes.
- Update API documentation for endpoint changes.
- Add JSDoc comments for new functions and methods.
- Update CHANGELOG.md if significant changes are made.

## Questions?

If you have questions about contributing, feel free to open an issue with the "question" label.

Thank you for your contributions to make URL Shortener better!