# Roadmap & Migration (Archived)

**Version:** 1.00.00  
**Created:** 2025-12-02  
**Last Updated:** 2025-12-02  
**Status:** Archived  
**Tags:** [Roadmap, Migration]

> Archived on 2025-12-14 and superseded by `docs/TS-NextJS-PersonalPortfolio-V1-2025 Documentation/sections/09-implementation-checklist.md`.

---

## 9.1 Status Snapshot (as of 2025-12-02)
- [x] **Phase 0 – Baseline hardening**: Build passes, dependencies locked, linting enabled, CI checklist captured.
- [x] **Phase 1 – Database & seeding**: Prisma schema, migrations, repositories, and seed script complete; parity audit for metadata/SEO + empty states still open (tracked below).
- [x] **Phase 2 – Authentication & sessions**: iron-session auth, hashed users, protected admin layout, and smoke-test plan landed.
- [x] **Phase 3 – Core content APIs**: CRUD stacks wired end-to-end with repositories, serializers, validation, and unit-test scaffolding.
- [ ] **Phase 4 – Admin dashboard & CRUD UX** *(in progress)*: Layout, nav, CRUD forms, dashboard KPIs, quick links, and the services reorder board are complete; remaining work covers optimistic draft/publish toggles and Playwright smoke tests.
- [ ] **Phase 5 – Advanced systems**: Media storage driver + `/admin/media` (upload/preview/delete), the contact inbox pipeline (rate-limited API + `/admin/contact` UI), and the theme registry (preview/apply + persistence) are live; remaining work covers blog editor polish, analytics wiring, and future storage drivers.
- [ ] **Phase 6 – Setup wizard & configuration**: Wizard MVP live; need multi-db UX polish, setup completion flag in `Settings`, and guard middleware to block re-entry once complete.
- [ ] **Phase 7 – Polishing, testing, release**: CI/CD automation, logging hooks, doc refresh, release checklist, and final migration guidance outstanding.

## 9.2 Objectives from Migration Summary v00.50.06
- [x] Enterprise architecture scaffolding (server directories, error/response helpers, serializers).
- [x] Temp data -> static-content rename + import fixes.
- [x] Testing infrastructure configs (Vitest, Playwright).
- [x] Documentation suite (architecture, changelog, README rewrites).
- [x] Example API route demonstrating validation, error handling, serialization.
- [ ] Known follow-ups:
  - [ ] CSS import warning (benign) — optional tsconfig suppression.
  - [ ] Install optional test dependencies (`vitest`, `@playwright/test`, etc.) when test writing begins.
  - [ ] Rebuild to clear historical `AppError` type warning if it resurfaces.

## 9.3 Immediate Next Steps
- [ ] **Parity audit (Phase 1 tailwork):**
  - [ ] Move SEO/metadata ingestion fully to `SettingsRepository` outputs.
  - [ ] Validate empty-state fallbacks using seeded snapshots vs. legacy static-content.
  - [ ] Produce snapshot diff report before deleting static data in future release.
- [ ] **Admin dashboard polish (Phase 4):**
  - [x] Surface KPIs and quick links via `SettingsService` + content services (DashboardService powering `/admin`).
  - [x] Ship drag-and-drop ordering with keyboard-accessible interactions and reorder service methods (service module shipped via DnD kit + `/api/v1/services/reorder`).
  - [ ] Add optimistic draft/publish toggles with error toasts as per UX spec.
  - [ ] Backfill Playwright smoke tests for portfolio, experience, and skills CRUD flows.
- [ ] **Advanced systems (Phase 5):**
  - [x] Enhance media manager with preview/delete UX and prep storage abstraction (`MediaService`, storage driver, `/admin/media`).
  - [x] Ship contact inbox submission pipeline (validation, repository/service layer, API routes, `/admin/contact` inbox UI, Vitest coverage).
  - [ ] Backfill contact inbox documentation, smoke tests, and analytics wiring.
  - [x] Implement blog module details (categories, tags, editor refinements) plus admin list filters and APIs.
  - [ ] Blog editor polish shipped (rich text surface + scheduling UX), pending scheduled publish e2e tests and public page analytics wiring.
  - [x] Implement theme registry persistence with CRUD + Preview UX.
  - [ ] Add theme documentation, QA checklist (visual regressions), and setup wizard linkage.
- [ ] **Setup wizard hardening (Phase 6):**
  - [ ] Improve multi-database selection UX and validation.
  - [ ] Persist setup completion flag in `Settings` with guard middleware redirecting post-setup traffic.
  - [ ] Add `setupCompletedAt`, `setupVersion`, and `databaseProvider` fields plus migrations.
  - [ ] Build `/admin/settings/setup` panel to display first-run data and allow controlled re-run or edits.
- [ ] **Release readiness (Phase 7):**
  - [ ] Add GitHub Actions workflow covering typecheck, lint, tests, and build.
  - [ ] Integrate logging/monitoring hooks (Sentry optional) plus maintenance-mode handling.
  - [ ] Refresh documentation (README, architecture, admin guide) and finalize release checklist + notes.
- [ ] **Environment hygiene:**
  - [ ] Keep `.env.example` synced with actual variables (DATABASE_URL, SESSION_SECRET, NEXT_PUBLIC_SITE_URL, rate limits, SMTP stubs).
  - [ ] Document rotation procedures for secrets inside `docs/CHANGELOG.md` or ops guides when they change.
  - [ ] Validate CI and deployment pipelines consume env vars securely (GitHub Actions secrets, Vercel environment dashboard).

## 9.4 Tracking & Documentation
- [ ] Update `docs/migration_plan.md` after each working session per checklist instructions.
- [ ] Log architecture-impacting changes here and reference ADRs in `docs/architecture.md` (legacy)
  or new decision records when needed.
- [ ] Mirror completed migration highlights from `docs/MIGRATION_SUMMARY.md` so readers can stay in
  this file when reviewing progress.
