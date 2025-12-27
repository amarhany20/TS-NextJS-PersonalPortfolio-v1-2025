# Runbook — Database Seeding

**Version:** 1.00.00  
**Created:** 2025-12-17  
**Last Updated:** 2025-12-17  
**Owner:** Ammar Hany  
**Contributors:** GitHub Copilot (docs)  
**Status:** Active  
**Tags:** [Runbook, Prisma, Seed]

---

## Purpose
Explain how the seed process works and how to reset or reseed safely across SQLite and Postgres.

---

## Seed Entry Point
- Script: [prisma/seed.ts](../../prisma/seed.ts)
- Command: `npm run db:seed`

The seeder creates default settings, an admin user, and demo content (portfolio, experience, education, skills, certificates, etc.).

---

## Configurable Environment Variables
- `SEED_ADMIN_EMAIL` — initial admin email (default `admin@example.com`)
- `SEED_ADMIN_PASSWORD` — initial admin password (default `change-me-now`)
- `DATABASE_URL` — SQLite or Postgres connection

---

## Local SQLite Workflow
1. Ensure `.env` uses SQLite:
```env
DATABASE_URL="file:./dev.db"
```
2. Apply schema and seed:
```bash
npm run prisma:migrate
npm run db:seed
```
3. Optional reset:
```bash
# PowerShell
if (Test-Path dev.db) { Remove-Item dev.db -Force }
npm run prisma:migrate
npm run db:seed
```

---

## Postgres (Neon) Workflow
1. Create a Neon Postgres database and obtain a connection URL.
2. Set `.env`:
```env
DATABASE_URL="postgresql://<user>:<password>@<host>/<db>?sslmode=require"
```
3. Deploy migrations and seed:
```bash
npx prisma migrate deploy
npm run db:seed
```

---

## Idempotency & Safety
- Running the seeder multiple times should be safe; unique constraints prevent duplication.
- If a migration changes model constraints, prefer a clean database or add targeted clean-up before reseeding.

---

## Common Issues
- Authentication errors with Neon
  - Ensure `sslmode=require` and correct IP allowlist if configured.
- Migrations fail in CI
  - Use `npx prisma migrate deploy` instead of `prisma migrate dev` in CI/CD environments.
