# Seed Generator (Ammar) Runbook

Version: 00.50.07

This runbook explains how to reset and seed the database using the Ammar seed generator from the private `data/ammar/*` dataset.

## What it does
- Resets all content tables (safe for local/dev) and reseeds.
- Loads the owner dataset from `data/ammar/*`.
- Skips seeding if `data/ammar/` is not present (so the template repo remains usable for everyone).
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

## Idempotence
- The job truncates relevant tables then re-inserts content, so it is safe to rerun during development. Production environments are skipped by default.

## Troubleshooting
- If seeding is skipped, ensure `NODE_ENV` is not set to `production`.
- If Prisma types are missing, run `pnpm prisma:generate`.
- If it reports missing data, ensure `data/ammar/` exists locally and exports the expected modules.
