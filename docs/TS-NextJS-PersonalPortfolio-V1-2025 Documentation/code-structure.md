# Code Structure — TS-NextJS PersonalPortfolio v1-2025

**Version:** 1.01.00  
**Created:** 2025-12-17  
**Last Updated:** 2025-12-17  
**Owner:** Ammar Hany  
**Contributors:** GitHub Copilot (docs)  
**Status:** Active  
**Tags:** [Architecture, Structure]

---

## Overview
High-level map of directories and responsibilities. This reflects the current repository layout and should be updated alongside significant refactors.

---

## Application Source (`src/`)
- `app/` — Next.js App Router pages, layouts, APIs
  - `globals.css` — global styles
  - `layout.tsx`, `page.tsx` — root layout and home
  - `admin/` — admin app surface and routes
  - `api/` — route handlers (server actions / HTTP APIs)
  - `blogs/`, `home/`, `login/`, `portfolio/`, `services/` — feature routes
- `components/` — UI and feature components
  - `Admin/`, `NavSidebar/`, `ProfileSidebar/`, `Portfolio/`, `Services/`, `UI/`
  - `ClientLayout.tsx`, `MetaContent.tsx`
- `lib/` — shared libraries
  - `version.ts` — app version and metadata utilities
- `sections/` — page sections (home, services)
- `server/` — backend logic
  - `db/`, `http/`, `repositories/`, `security/`, `serializers/`, `server-utils/`, `server-validators/`, `services/`
- `static-content/` — static data (to be archived per Agent E)
- `themes/` — theme-related assets and configuration
- `types/` — TypeScript types
- `utils/` — helpers and utilities

---

## Database & Prisma (`prisma/`)
- `schema.prisma` — models; SQLite for local dev, Neon PostgreSQL for Vercel

- `seed.ts` — seeds default admin, settings, and demo content

---

## Testing
- `tests/e2e/` — Playwright e2e tests and config
- `playwright/`, `playwright.config.ts`, `playwright-report/` — Playwright harness and reports
- `vitest.config.ts` — unit testing config; run with `npm run test`

---

## Tooling & Config
- `package.json` — scripts (lint, typecheck, build, prisma, seed)
- `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`, `next.config.ts`

---

## Docs
- Architecture: [architecture.md](./architecture.md)
- Runbooks: [../../runbooks/](../runbooks/)
- Theme registry: [../../themes/theme-registry.md](../themes/theme-registry.md)

---

## Notes
- Follow folder ownership rules from the Agents Program to minimize conflicts
- Prefer incremental changes; update this document when moving or renaming major areas

---

## Status & Updates
✅ **Updated:** 2025-12-17 — Verified alignment with actual codebase structure. All sections match current implementation as of Phase 0–7 completion.
