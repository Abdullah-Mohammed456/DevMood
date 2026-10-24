# Contributing to DevMood

Thanks for helping improve DevMood. Keep changes focused, preserve the client-only architecture unless a backend is intentionally proposed, and avoid adding credentials or personal data to the repository.

## Local setup

1. Install Node.js `22.13.0` or later and npm.
2. Run `npm ci` from the repository root.
3. Start the development server with `npm run dev`.

## Branches and changes

- Create a branch from the latest `main`, for example `feat/task-filter` or `fix/timer-reset`.
- Keep pull requests focused and explain the user-visible effect.
- Update the README when commands, environment variables, architecture, or deployment steps change.
- Do not commit `.env` files, tokens, API keys, or user data. Use `.env.example` only for variable names and comments.
- Keep mood colors tied to mood states, preserve keyboard access, and respect `prefers-reduced-motion`.

## Before opening a pull request

Run the checks supported by the project:

```bash
npm run lint
npm run typecheck
npm run format:check
npm run build
```

There is no automated test suite yet. If your change affects timer, task, mood, or storage behavior, include concise manual verification steps in the pull request.

## Pull requests

Include:

- A short description of the problem and change.
- Screenshots or a short recording for visual changes, including a narrow viewport when relevant.
- The commands you ran and their results.
- Any known follow-up work or environment limitations.

## Reporting security issues

Do not include secrets in public issues. For a suspected security problem, report the affected files and reproduction details privately to the repository owner through GitHub.
