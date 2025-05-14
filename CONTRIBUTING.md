# Contributing to Baseroot DeSci Platform

First off, thank you for considering contributing to Baseroot! Your help is essential for keeping it great.

## Code of Conduct

This project and everyone participating in it is governed by a Code of Conduct (to be defined, but generally, be respectful and constructive).

## How Can I Contribute?

### Reporting Bugs
*   Ensure the bug was not already reported by searching on GitHub Issues (if applicable).
*   If you're unable to find an open issue addressing the problem, open a new one. Be sure to include a title and clear description, as much relevant information as possible, and a code sample or an executable test case demonstrating the expected behavior that is not occurring.

### Suggesting Enhancements
*   Open a new issue with a clear title and detailed description of the proposed enhancement and its potential benefits.

### Pull Requests
1.  Fork the repo and create your branch from `main` (or `develop` if it exists).
2.  If you've added code that should be tested, add tests.
3.  If you've changed APIs, update the documentation.
4.  Ensure the test suite passes.
5.  Make sure your code lints.
6.  Issue that pull request!

## Development Setup

Please refer to `deployment_guide.md` for instructions on setting up the development environment for smart contracts, backend, and frontend.

### Smart Contracts (Anchor/Rust)
*   Located in `baseroot_nft_minter` and `baseroot_dao`.
*   Follow Anchor best practices.
*   Run `anchor test` in each contract directory after making changes.

### Backend (FastAPI/Python)
*   Located in `baseroot_backend`.
*   Use the provided `venv` and install dependencies from `requirements.txt` (you may need to generate this first using `pip freeze > requirements.txt` after installing packages listed in deployment guide).
*   Follow FastAPI best practices.
*   Write unit tests for new API endpoints or logic.

### Frontend (React/TypeScript/Styled-Components)
*   Located in `baseroot-frontend`.
*   Run `npm install` to get dependencies.
*   Follow React and TypeScript best practices.
*   Develop reusable components where possible.

## Styleguides

### Git Commit Messages
*   Use the present tense ("Add feature" not "Added feature").
*   Use the imperative mood ("Move cursor to..." not "Moves cursor to...").
*   Limit the first line to 72 characters or less.
*   Reference issues and pull requests liberally after the first line.

### Rust Style
*   Follow the official Rust style guidelines (`rustfmt`).

### Python Style
*   Follow PEP 8. Use a linter like Flake8 or Black.

### TypeScript/JavaScript Style
*   Follow a consistent style, preferably enforced by Prettier or ESLint.

Thank you for your contribution!

