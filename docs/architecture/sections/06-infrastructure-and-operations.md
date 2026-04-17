# 6. Infrastructure & Operations

## 6.1 Environment Configuration
- Local development uses `.env.local`. Production on Vercel uses Environment Variables only (no
  writable `.env` at runtime). Commit `.env.example` only; keep secrets out of git history.
- Core variables:


| Variable | Required | Scope | Description |
|----------|----------|-------|-------------|
| `DATABASE_URL` | Yes | Server | Neon PostgreSQL connection string (Vercel Environment Variables). |
| `AUTH_SECRET` | Yes | Server | 32+ char secret for iron-session encryption (admin auth). Rotate when compromised; store in env only. |
| `NEXT_PUBLIC_SITE_URL` | Yes (prod) | Shared | Canonical URL for SEO tags, social previews, and contact links. |
| `RATE_LIMIT_WINDOW` / `RATE_LIMIT_MAX` | Optional | Server | Tunable throttling for auth/contact endpoints. Defaults live in config but can be overridden via env. |

| `MEDIA_STORAGE_DRIVER` | Optional | Server | Future flag for local vs. cloud storage. Defaults to `local` until Phase 5 completes. |
| `SMTP_*` / `RESEND_API_KEY` | Optional | Server | Email provider credentials for contact notifications (planned). |

- `tsconfig.json` defines path aliases for `@/components`, `@/server`, and `@/static-content`. Keep
  import hygiene aligned with Next.js App Router conventions.
- `next.config.ts` houses experimental flags; update when enabling features such as
  `serverActions` or custom headers.

## 6.2 Env Bootstrap
This repo uses a Vercel-first bootstrap:
- Database provisioning happens outside the app: configure `DATABASE_URL` in Vercel and run migrations
  during CI/build (`npx prisma migrate deploy`).
- On first run (when the Settings singleton row is missing), the app seeds admin credentials and site
  settings from `.env`.
- Prisma `generate` and `migrate deploy` run during build/CI, not from the UI.
- The supported launch path is:
  1. configure env,
  2. run Prisma migrations,
  3. run a supported seed command,
  4. start the app,
  5. verify `/login`, `/admin`, and `/admin/settings/setup`.
- `/setup` is retained only as a backwards-compatible redirect surface; the interactive setup wizard
  is no longer an active runtime flow.

Once seeded, the Settings row records `setupCompletedAt`, `setupVersion`, and `databaseProvider`, and
the Admin panel can display this under `/admin/settings/setup`.



## 6.3 Tooling & Scripts
- `npm run dev` (Next.js), `npm run lint`, `npm run test`, `npm run e2e`, `npm run db:seed`,
  `npm run seed:ammar`, and the Prisma scripts in `package.json`.
- Prisma client generation runs during build; migrations run in CI with `npx prisma migrate deploy`.
- Vercel build should use `vercel-build` (runs `prisma generate`, `prisma migrate deploy`, then `next build`).
- CI/CD (Phase 7) covers typecheck, lint, unit tests, Playwright, and Next.js build before deploying
  to Vercel.


## 6.4 Backup & Troubleshooting
- Use Neon backups or `pg_dump` for PostgreSQL snapshots.
- Common fixes: `npx prisma migrate dev` for local schema updates, `npx prisma generate` when the client
  is stale, `npx prisma migrate reset` (dev only) when schema drift occurs.


## 6.5 Observability & Operations Roadmap
- Phase 5+ will introduce logging/monitoring hooks (e.g., Sentry) plus media storage abstractions for
  cloud buckets.
- Maintenance mode toggle already lives in settings; Phase 6 will wire it into public-site gating.

- Operational scripts (seed refresh, content parity audit) must be documented under `docs/` as they
  mature to keep alignment with Ammar Documentation Guideline.
