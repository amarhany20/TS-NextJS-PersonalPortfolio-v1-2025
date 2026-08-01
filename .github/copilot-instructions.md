# AI Agent Instructions — TS-NextJS-PersonalPortfolio-v1-2025

**Target:** TS-NextJS-PersonalPortfolio-v1-2025
**Version:** 2.0.0
**Updated:** 2026-04-18
**Status:** Relaunch Preparation

## Project Overview

TS-NextJS-PersonalPortfolio-v1-2025 is a Next.js App Router portfolio platform with a public
website, a Prisma-backed admin CMS, theme support, and an env/bootstrap-driven first-run path.

Treat the repo as functional but still under launch verification. Do not describe it as fully
production-ready unless the current docs, checks, and manual verification all support that claim.

## Startup Read Order

Before changing code or docs, read these sources in order:

1. `AGENTS.md`
2. `.github/copilot-instructions.md`
3. `README.md` and the relevant top-level folder `README.md` files under `src/**`
4. The code paths you plan to edit

## Current Repo Truth

- Framework: Next.js App Router with TypeScript and React 19.
- Persistence: Prisma with a PostgreSQL datasource configured in `prisma/schema.prisma`.
- Supported onboarding path: environment variables, Prisma migration, seed/bootstrap, then app start.
- `/setup` is only a backwards-compatible redirect surface; the interactive setup wizard is retired.
- `EnvBootstrapService.ensureSettingsAndAdmin()` is the real first-run initializer for settings and
  the bootstrap admin user.
- `src/static-content/*` holds template-safe fallback content and seed-aligned defaults.

## Architecture Quick Reference

This repo follows a layered flow (see `AGENTS.md` for the full rules):

```text
src/app/          -> Next.js routes, layouts, pages, and route handlers
src/server/       -> Services, repositories, serializers, validators, security, db
src/components/   -> Reusable shared and admin-facing UI pieces
src/sections/     -> Public-page composition blocks
src/static-content/ -> Template-safe fallback content and defaults
prisma/           -> Schema and seed scripts
tests/            -> Unit and Playwright verification
```

Key rule: route/page -> service -> repository -> serializer/response.

## Critical Engineering Rules

- Never import `@/server/*` into client components.
- Keep route handlers thin: validate input, delegate to services, return the shared response format.
- Keep business logic in services and query logic in repositories.
- Use typed env access from `@/server/server-validators/env` instead of raw `process.env` in active server code.
- Keep docs aligned with the current code in the same pass as implementation changes.
- Preserve the dual-purpose goal: Ammar-first launch content, but reusable platform-grade code and docs.

## Supported Setup And Bootstrap Flow

Use this flow for local development, verification, and deployment prep:

```bash
npm install
npm run prisma:migrate
npm run db:seed
npm run dev
```

Important notes:

- There is no supported `setup:first-run` script in this repo.
- There is no supported web setup wizard flow.
- The bootstrap admin/settings path is env-driven through `EnvBootstrapService` and surfaced in the
  admin diagnostics page at `/admin/settings/setup`.

## Verification Commands

Use the repo scripts from `package.json` as the source of truth:

```bash
npm run typecheck
npm run lint
npm run format:check
npm run build
npm run test
npm run e2e
```

Treat the isolated seeded Playwright server as the authoritative E2E gate. Reused live dev servers
are useful for debugging but should not be treated as the release gate.

## Active Documentation Set

These docs should stay aligned with the codebase:

- `README.md`
- `AGENTS.md`
- Top-level folder `README.md` files under active source and test folders

## Common Tasks

### API changes

1. Update or add the server validator when needed.
2. Keep the route handler thin.
3. Implement business logic in the service.
4. Keep data access in the repository.
5. Update serializers, docs, and checks in the same pass.

### Public/admin feature cleanup

1. Read the active docs and the owning code path first.
2. Verify the behavior through the narrowest relevant test or command.
3. Remove stale or retired behavior aggressively once call sites confirm it is inactive.
4. Update `AGENTS.md` and relevant folder `README.md` files before ending the session if repo-reality changed.

### Documentation changes

1. Prefer updating `AGENTS.md` and folder `README.md` files instead of creating parallel narratives.
2. Keep claims tied to verified code and commands.
3. Remove stale/incorrect claims outright rather than leaving conflicting active docs in place.

## Current Priorities

1. Finish the docs-truth pass across active repo docs.
2. Remove remaining low-risk stale setup and legacy code surfaces.
3. Complete the remaining review/checkup/cleanup items in the implementation checklist.
4. Re-verify typecheck, lint, build, tests, and isolated E2E.
5. Finalize launch content, metadata, and owner-data correctness.

## Reference Files

- `AGENTS.md`
- `README.md`
- `src/server/services/EnvBootstrapService.ts`
- `src/server/services/SettingsService.ts`
- `src/server/server-validators/env.ts`
- `playwright.config.ts`
