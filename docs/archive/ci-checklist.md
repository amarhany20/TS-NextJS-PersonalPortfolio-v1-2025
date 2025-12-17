# CI Check List

**Purpose:** Commands to validate the codebase locally and in CI pipelines.

## Required Checks
- `npm run typecheck`
- `npm run lint`
- `npm run test` (placeholder until Vitest suite implemented)
- `npm run build`

## Combined Shortcut
- `npm run check` runs typecheck, lint, and format verification.

## Recommended Git Hooks
- Pre-commit: `npm run lint`
- Pre-push: `npm run check`

Automate via your preferred tool (Husky, simple-git-hooks, Lefthook) when ready. Document deviations in the migration plan.
