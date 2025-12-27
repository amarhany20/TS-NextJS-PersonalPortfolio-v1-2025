# 6. Infrastructure & Operations

## 6.1 Environment Configuration
- Copy `.env.example` to `.env.local` (local) or `.env` (production) and edit values there—never in
  source files. Commit `.env.example` only; keep secrets out of git history.
- Core variables:

| Variable | Required | Scope | Description |
|----------|----------|-------|-------------|
| `DATABASE_URL` | Yes | Server | Connection string for SQLite (file path) or Neon PostgreSQL. Wizard writes this automatically when possible. |
| `AUTH_SECRET` | Yes | Server | 32+ char secret for iron-session encryption (admin auth). Rotate when compromised; store in env only. |
| `NEXT_PUBLIC_SITE_URL` | Yes (prod) | Shared | Canonical URL for SEO tags, social previews, and contact links. |
| `RATE_LIMIT_WINDOW` / `RATE_LIMIT_MAX` | Optional | Server | Tunable throttling for auth/contact endpoints. Defaults live in config but can be overridden via env. |
| `MEDIA_STORAGE_DRIVER` | Optional | Server | Future flag for local vs. cloud storage. Defaults to `local` until Phase 5 completes. |
| `SMTP_*` / `RESEND_API_KEY` | Optional | Server | Email provider credentials for contact notifications (planned). |

- `tsconfig.json` defines path aliases for `@/components`, `@/server`, and `@/static-content`. Keep
  import hygiene aligned with Next.js App Router conventions.
- `next.config.ts` houses experimental flags; update when enabling features such as
  `serverActions` or custom headers.

## 6.2 Setup Wizard Automations
This repo supports a simple, open-source friendly bootstrap:
- If the database is missing tables or the Settings singleton row is missing, the app renders a
  **Setup required** screen (and exposes a `/setup` page) explaining how to initialise the install.
- Initialisation is done via:
  - `pnpm run setup:first-run` (recommended, interactive)
  - or manual Prisma migration + `pnpm run db:seed`

Once seeded, the Settings row records `setupCompletedAt`, `setupVersion`, and `databaseProvider`, and
the Admin panel can display this under `/admin/settings/setup`.

## 6.3 Tooling & Scripts
- `npm run dev` (Next.js), `npm run lint`, `npm run test`, `npm run test:e2e` (Vitest + Playwright
  configs ready per migration summary), `npm run db:studio`, `npm run db:seed`, `npm run db:reset`.
- `pnpm run setup:first-run` updates `.env`, switches Prisma provider in `prisma/schema.prisma`, runs
  Prisma generate + migrations + seed.
- Future CI/CD (Phase 7) will add GitHub Actions covering typecheck, lint, unit tests, Playwright, and
  Next.js build before deploying to Vercel or alternative infrastructure.

## 6.4 Backup & Troubleshooting
- SQLite backups: copy `prisma/dev.db` or run `sqlite3 prisma/dev.db .dump > backup/<file>.sql`.
- Restore by copying back the `.db` file or piping SQL back into SQLite (see `.github/instructions.md`).
- Common fixes: `npx prisma migrate dev` for missing DB files, `npx prisma generate` when the client
  is stale, `npx prisma migrate reset` (dev only) when schema drift occurs.

## 6.5 Observability & Operations Roadmap
- Phase 5+ will introduce logging/monitoring hooks (e.g., Sentry) plus media storage abstractions for
  cloud buckets.
- Maintenance mode toggle already lives in settings; Phase 6 will wire it into setup wizard
  completion guards and public-site gating.
- Operational scripts (seed refresh, content parity audit) must be documented under `docs/` as they
  mature to keep alignment with Ammar Documentation Guideline.
