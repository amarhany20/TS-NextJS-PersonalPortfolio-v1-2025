# 6. Infrastructure & Operations

## 6.1 Runtime Baseline

- Runtime framework: Next.js 16.1.x with App Router.
- Language/tooling: TypeScript, ESLint, Prettier, Vitest, Playwright.
- Data layer: Prisma Client against PostgreSQL.
- Deployment target: Vercel-style build/deploy flow with environment variables managed outside the app.

## 6.2 Environment Configuration

| Variable                                                                | Required           | Scope  | Purpose                                                                 |
| ----------------------------------------------------------------------- | ------------------ | ------ | ----------------------------------------------------------------------- |
| `DATABASE_URL`                                                          | Yes                | Server | PostgreSQL connection for Prisma and app runtime.                       |
| `AUTH_SECRET`                                                           | Yes                | Server | iron-session encryption secret.                                         |
| `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_EMAIL`, `ADMIN_DISPLAY_NAME` | Bootstrap          | Server | First-run admin identity values.                                        |
| `SITE_TITLE` and related site env defaults                              | Bootstrap          | Server | Seed/bootstrap defaults for the settings row.                           |
| `NEXT_PUBLIC_SITE_URL`                                                  | Yes for production | Shared | Canonical public site URL and metadata base.                            |
| `MEDIA_STORAGE_DRIVER`                                                  | Optional           | Server | Storage abstraction switch; local storage is the active implementation. |
| `PLAYWRIGHT_DATABASE_URL`                                               | Optional           | Server | Dedicated DB for isolated Playwright verification.                      |

Rules:
- Keep secrets out of tracked files.
- Treat `.env.example` as guidance, not stronger truth than the live environment.
- Validate server env through `src/server/server-validators/env.ts`.

## 6.3 Supported Local Flow

The supported local operator flow is:

```bash
npm install
npm run prisma:migrate
npm run db:seed
npm run dev
```

Owner-data alternative:

```bash
npm run seed:ammar
```

## 6.4 Build And Deploy Flow

- Local production build: `npm run build`
- Production start: `npm run start`
- Vercel build hook: `npm run vercel-build`

`vercel-build` currently runs:
1. `prisma generate`
2. `prisma migrate deploy`
3. `next build`

## 6.5 Bootstrap And First-Run Behavior

- The app does not provision the database itself.
- Migrations and DB availability must exist before runtime bootstrap can succeed.
- When the settings row is missing, env/bootstrap can create the initial settings and admin user.
- `/admin/settings/setup` exposes the bootstrap metadata after initialization.
- `/setup` remains a redirect-only compatibility surface.

## 6.6 Scripts And Operational Commands

Important scripts in `package.json`:
- `dev`, `build`, `start`
- `typecheck`, `lint`, `format`, `format:check`
- `test`, `e2e`
- `prisma:migrate`, `db:push`, `db:seed`, `seed:ammar`
- `clean`, `rebuild`, `vercel-build`

## 6.7 Backup And Recovery Notes

- Use Neon backups or PostgreSQL snapshot tools such as `pg_dump` for recovery planning.
- Use `prisma migrate reset` only in development-safe contexts where data loss is acceptable.
- Use migration-based fixes first when schema drift is discovered.

## 6.8 Observability And Operations Gaps

- Console logging is the current default observability surface.
- Sentry or structured monitoring is not yet the active baseline.
- Maintenance mode data exists in the settings row but still requires explicit launch validation as an operator-ready control.

## 6.9 Infrastructure Truth Rules

- Do not document the retired web setup wizard as an infrastructure dependency.
- Do not document runtime filesystem writes outside the currently implemented media upload path.
- Keep deployment docs aligned with the actual scripts in `package.json`.

---

[« Previous](05-admin-and-public-experience.md) | [Next »](07-security-and-compliance.md)
