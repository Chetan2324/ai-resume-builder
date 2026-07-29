# Contributing

Thank you for contributing to AI Resume Builder.

## Development Setup

1. Fork and clone the repository.
2. Install dependencies:
   - `cd server && npm install`
   - `cd ../client && npm install`
3. Configure environment variables using `.env.example` files.
4. Run backend (`npm run dev`) and frontend (`npm start`) in separate terminals.

## Branching and PRs

- Create focused branches for each change.
- Keep commits small and descriptive.
- Open pull requests with clear summaries and validation notes.

## Code Standards

- Preserve existing functionality unless the change explicitly targets behavior.
- Prefer readable, maintainable JavaScript and small, reviewable diffs.
- Include or update tests when behavior-affecting code changes are introduced.
- Avoid committing secrets, build artifacts, or dependency folders.

## Reporting Issues

Use the issue templates in `.github/ISSUE_TEMPLATE` for bug reports and feature requests.
