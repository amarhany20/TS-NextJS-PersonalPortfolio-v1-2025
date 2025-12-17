# Runbook — First Run (Local)

**Version:** 1.01.00  
**Created:** 2025-12-17  
**Last Updated:** 2025-12-17  
**Owner:** Ammar Hany  
**Contributors:** GitHub Copilot (docs)  
**Status:** Active  
**Tags:** [Runbook, Setup, Local]

---

## Purpose
Get the app running locally in minutes using the interactive first-run setup. Supports SQLite and Neon PostgreSQL. Complements [QUICKSTART.md](../../QUICKSTART.md) and adds troubleshooting and rollback.

---

## Prerequisites
- Node.js v20+
- pnpm (recommended) or npm
- Git

---

## Quick Start (Automated)
1) Install deps
```bash
pnpm i
```

2) Run interactive setup (cross-platform)
```bash
pnpm run setup:first-run
```

On Windows, you can also use the PowerShell wrapper:
```powershell
pnpm run setup:first-run:ps
```

The script will:
- Ask for database: `sqlite` or `neon` (Postgres)
- Update `.env` (incl. `DATABASE_URL`, seed admin values)
- Switch Prisma provider in [prisma/schema.prisma](../../prisma/schema.prisma) to match choice
- Run `prisma generate`, `prisma migrate dev`, `db:seed`
- Optionally start the dev server

---

## Manual Steps (Alternative)
1) Clone and install
```bash
git clone https://github.com/amarhany20/TS-NextJS-PersonalPortfolio-v1-2025.git
cd TS-NextJS-PersonalPortfolio-v1-2025
pnpm i
```

2) Create `.env`
```env
AUTH_SECRET=local-dev-secret-32-characters-minimum-length-OK
NEXT_PUBLIC_SITE_URL=http://localhost:3000
DATABASE_URL="file:./dev.db" # or Neon: postgresql://...sslmode=require
SEED_ADMIN_EMAIL=admin@example.com
SEED_ADMIN_USERNAME=admin
SEED_ADMIN_DISPLAY_NAME=Portfolio Admin
SEED_ADMIN_PASSWORD=change-me-now
```
Generate a secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

3) Ensure Prisma provider matches DB
Edit [prisma/schema.prisma](../../prisma/schema.prisma):
```
datasource db {
  provider = "sqlite"      # or "postgresql" for Neon
  url      = env("DATABASE_URL")
}
```

4) Migrate and seed
```bash
pnpm exec prisma generate
pnpm exec prisma migrate dev --name init
pnpm run db:seed
```

5) Start dev server
```bash
pnpm dev
```
Browse http://localhost:3000 and admin at http://localhost:3000/admin.

---

## Admin Login (seeded defaults)
- Username: `admin`
- Password: `change-me-now`

If you modified seed credentials, use your values instead.

---

## Switching DB / Rollback
To switch from SQLite ↔ Neon:
```bash
pnpm run setup:first-run
# or manually:
pnpm exec prisma migrate reset --force
pnpm run db:seed
```
- Update `.env` `DATABASE_URL` accordingly.
- Ensure Prisma provider matches your DB choice.

To reset local SQLite DB only:
```powershell
if (Test-Path dev.db) { Remove-Item dev.db -Force }
pnpm exec prisma migrate dev --name init
pnpm run db:seed
```

---

## Troubleshooting
- "Site settings have not been initialised" → `pnpm run db:seed`
- AUTH secret length error → ensure `AUTH_SECRET` is 32+ chars; regenerate if needed.
- Port 3000 in use → `pnpm run dev -- -p 3001`
- Prisma not found → run `pnpm i`
- Neon connection issues → ensure `sslmode=require` and use the full connection string from Neon.

---

## Next Steps
- Theming: [docs/runbooks/theming.md](theming.md)
- Admin usage: [docs/runbooks/admin-usage.md](admin-usage.md)
- Deployment: [docs/runbooks/deployment.md](deployment.md)
