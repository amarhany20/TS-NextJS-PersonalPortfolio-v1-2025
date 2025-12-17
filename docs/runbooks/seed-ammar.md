# Seed Generator (Ammar) Runbook

Version: 00.50.07

This runbook explains how to reset and seed the database using the Ammar seed generator that reads the archived static content manifest when available, and falls back to the current `src/static-content` modules otherwise.

## What it does
- Resets all content tables (safe for local/dev) and reseeds.
- Prefers `backups/static-content-archive/<YYYY-MM-DD>/manifest.json` as the data source.
- Falls back to `src/static-content/*` if no archive is found.
- Seeds: settings, admin user, skill groups & skills, portfolio, experience, education, services, certificates, and recommendations.

## Prerequisites
- Database is reachable via `DATABASE_URL`.
- Prisma migrations have been applied (use `npm run prisma:migrate`).
- Node.js environment variables may be set in `.env`.

## Environment variables
- `SEED_ADMIN_USERNAME` (default: `admin`)
- `SEED_ADMIN_EMAIL` (default: `admin@example.com`)
- `SEED_ADMIN_DISPLAY_NAME` (default: `Portfolio Admin`)
- `SEED_ADMIN_PASSWORD` (default: `change-me-now`)

## Commands
```sh
pnpm i
pnpm prisma:generate
pnpm prisma:migrate
pnpm seed:ammar
```

## Archive detection
- The script looks for the newest folder under `backups/static-content-archive` (sorted lexicographically, expecting `YYYY-MM-DD`).
- It reads `manifest.json` and expects the `data` property to contain fields like `metadata`, `personalInfo`, `heroContent`, `contactInfo`, `portfolio`, `experience`, `education`, `services`, `certificates`, `recommendations`, `skillGroups`, `coreSkills`.
- If `data` is not present, it will try to use the root-level fields.

## Idempotence
- The job truncates relevant tables then re-inserts content, so it is safe to rerun during development. Production environments are skipped by default.

## Troubleshooting
- If seeding is skipped, ensure `NODE_ENV` is not set to `production`.
- If Prisma types are missing, run `pnpm prisma:generate`.
- If no archive exists, ensure the static content under `src/static-content` compiles (TypeScript) and try again.
