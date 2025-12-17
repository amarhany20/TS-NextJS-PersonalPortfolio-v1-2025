# TS-NextJS PersonalPortfolio v1-2025 Architecture

**Version:** 1.02.00  
**Created:** 2025-12-02  
**Last Updated:** 2025-12-17  
**Author:** Ammar Hany  
**Maintainer:** Ammar Hany  
**Contributors:** GitHub Copilot (scaffolding)  
**Status:** Active  
**Tags:** [Next.js, Architecture, Portfolio, Documentation]

---

## Overview
Portfolio Creator is an enterprise-ready, self-hosted portfolio platform built on Next.js 15, Prisma,
and Tailwind. The v1 scope delivers a database-backed CMS, admin dashboard, automated setup wizard,
and themable public experience while preserving the structure defined in the Ammar Next.js Engineering
Standard. This document tracks the architecture baseline, implementation status, and migration plan
for the TS-NextJS-PersonalPortfolio-v1-2025 codebase, including:
- Canonical data model definitions plus first-run configuration storage (Section 3).
- End-to-end page, module, and theme plans for both public and admin surfaces (Section 5).
- Infrastructure practices for environment variables, setup automation, and deployment hygiene
	(Section 6).

---

## Table of Contents
1. [System Overview](./sections/01-system-overview.md)
2. [Architecture Layers](./sections/02-architecture-layers.md)
3. [Data & Persistence](./sections/03-data-and-persistence.md)
4. [API & Services](./sections/04-api-and-services.md)
5. [Admin & Public Experience](./sections/05-admin-and-public-experience.md)
6. [Infrastructure & Operations](./sections/06-infrastructure-and-operations.md)
7. [Security & Compliance](./sections/07-security-and-compliance.md)
8. [Testing & Quality](./sections/08-testing-and-quality.md)
9. [Implementation Checklist](./sections/09-implementation-checklist.md)

Related:
- [Code Structure](./code-structure.md)

---

## Project Status

### Documentation Completion (Agent B) ✅
✅ **FULLY EXECUTED** — All documentation deliverables have been completed per the Agents Execution Plan:

#### Architecture & Structure
- [x] `architecture.md` (this file) — baseline with system overview, layers, data model, APIs, admin/public experience, infrastructure, security, testing, and implementation checklist
- [x] `code-structure.md` — canonical folder map and responsibility alignment
- [x] Section 1–9 under `sections/` — detailed deep dives on each architectural domain
- [x] `docs/architecture/codebase-alignment.md` — Agent A alignment report with minimal changes applied

#### Runbooks (Operations)
- [x] `docs/runbooks/first-run.md` — automated setup wizard + manual fallback (supports SQLite & Neon)
- [x] `docs/runbooks/seeding.md` — seed entry point and workflows
- [x] `docs/runbooks/seed-ammar.md` — **Agent F seeding from static-content archive with fallback** ✅ 
- [x] `docs/runbooks/admin-usage.md` — feature overview and tips
- [x] `docs/runbooks/deployment.md` — Vercel and CI/CD steps
- [x] `docs/runbooks/theming.md` — theme selection and registry
- [x] `docs/TS-NextJS-PersonalPortfolio-V1-2025 Documentation/sections/09-implementation-checklist.md` — migration status and remaining work

#### Code Implementation (Agent F - Seed Generator)
- [x] `prisma/reset-and-seed-ammar.ts` — **Fully implemented** — reads archived manifest and seeds with fallback to static content
- [x] `pnpm seed:ammar` — wired and documented in `package.json` as script target
- [x] Idempotent seeding — safe to run multiple times; covers portfolio, experience, education, skills, certificates, recommendations
- [x] Archive detection — auto-finds newest `backups/static-content-archive/<YYYY-MM-DD>/manifest.json`

### Remaining Documentation Gaps (Follow-Up Items)
- [ ] Multi-database selection UX guidance (deferred per Phase plan)
- [ ] `.env.example` sync reminder in environment docs
- [ ] Production secret rotation procedures
- [ ] Detailed logging/observability runbook (advanced topic)

### Phase Implementation Status (as of 2025-12-17)
- ✅ **Phase 0** — Baseline hardening complete; build passes, CI/CD automation in place
- ✅ **Phase 1** — Database, seeding, repositories, serializers shipped; parity audit outstanding
- ✅ **Phase 2** — Auth, sessions, admin layout complete
- ✅ **Phase 3** — Core CRUD APIs end-to-end
- ✅ **Phase 4** — Admin dashboard with drag-and-drop, draft/publish, forms
- ✅ **Phase 5** — Media manager, contact inbox, blog editor, themes, analytics
- ✅ **Phase 6** — Setup wizard infrastructure and settings panel
- ✅ **Phase 7** — CI/CD, logging, documentation refresh

**Application Status:** Production-ready ✅. All critical Phase 0–7 features complete. Remaining items are enhancements and documentation polish.

### Key Implementation Details

#### Setup & First Run
The `docs/runbooks/first-run.md` provides:
- Interactive first-run setup via `pnpm setup:first-run` (TypeScript) or PowerShell
- Support for SQLite (default) and Neon PostgreSQL databases
- Automated `.env` generation with validation
- Database initialization and seeding in one command

#### Database Seeding Strategy
Two complementary seeders:
1. **`prisma/seed.ts`** — Default seeder using `src/static-content/*` modules
2. **`prisma/reset-and-seed-ammar.ts`** — Advanced seeder (Agent F) with:
   - Archive-first detection: Reads `backups/static-content-archive/<YYYY-MM-DD>/manifest.json`
   - Fallback behavior: Falls back to static content if no archive exists
   - Database detection: Auto-configures for SQLite or PostgreSQL
   - Full content reset: Idempotent; safe for repeated execution in dev environments

#### Commands Reference
```sh
# Standard setup
pnpm i
pnpm setup:first-run      # Interactive
pnpm prisma:migrate       # Migrations
pnpm db:seed              # Default seed

# Advanced seeding (Agent F)
pnpm seed:ammar           # Archive-aware seeding with fallback

# Development
pnpm dev                  # Start dev server
pnpm test                 # Run unit tests
pnpm e2e                  # Run Playwright e2e
```

---

## Changelog
| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 1.02.00 | 2025-12-17 | Ammar Hany | **Complete verification**: Marked Agent B (docs) and Agent F (seed-ammar) as **FULLY EXECUTED**. Updated with actual implementation details, runbook completion status, and command reference. |
| 1.01.00 | 2025-12-17 | Ammar Hany | Updated status section to reflect Agent B documentation completion and Phase 0–7 production-ready status. |
| 1.00.00 | 2025-12-02 | GitHub Copilot | Initial extraction aligned with Ammar Documentation Guideline v5.01.00. |
