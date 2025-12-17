# Migration Plan to Launch V1.0

**Version:** 0.10.00  
**Created:** 2025-11-11  
**Updated:** 2025-11-11  
**Author:** Ammar Hany  
**Maintainer:** Ammar Hany  
**Status:** Draft  
**Tags:** [Migration, Planning, Release, Portfolio]  
**Scope:** Tasks required to complete the dynamic portfolio platform end to end.

## Table of Contents
- [Migration Plan to Launch V1.0](#migration-plan-to-launch-v10)
	- [Table of Contents](#table-of-contents)
	- [Phase 0 – Baseline Hardening (Week 0)](#phase-0--baseline-hardening-week-0)
	- [Phase 1 – Database \& Data Seeding (Week 1-2)](#phase-1--database--data-seeding-week-1-2)
	- [Phase 2 – Authentication \& Sessions (Week 2-3)](#phase-2--authentication--sessions-week-2-3)
	- [Phase 3 – Core Content APIs (Week 3-5)](#phase-3--core-content-apis-week-3-5)
	- [Phase 4 – Admin Dashboard \& CRUD UX (Week 5-7)](#phase-4--admin-dashboard--crud-ux-week-5-7)
	- [Phase 5 – Advanced Systems (Week 7-9)](#phase-5--advanced-systems-week-7-9)
	- [Phase 6 – Setup Wizard \& Configuration (Week 8-9 overlap)](#phase-6--setup-wizard--configuration-week-8-9-overlap)
	- [Phase 7 – Polishing, Testing, Release (Week 9-10)](#phase-7--polishing-testing-release-week-9-10)
	- [Cross-Cutting Deliverables](#cross-cutting-deliverables)
	- [Risks \& Mitigations](#risks--mitigations)
	- [Tracking](#tracking)
	- [Changelog](#changelog)

---

## Phase 0 – Baseline Hardening (Week 0)
- [x] Verify current `dev` branch builds with `npm run build`
- [x] Capture dependency lockfile updates (run `npm install`)
- [x] Enable linting (`npm run lint`) and track open warnings
- [x] Document outstanding technical debt in `docs/CHANGELOG.md`
- [x] Configure git hooks or CI check list (typecheck, lint, test)

## Phase 1 – Database & Data Seeding (Week 1-2)
- [x] Define complete Prisma schema for all entities
- [x] Create `server/db/prisma.ts` singleton and health check script
- [x] Scaffold migrations and apply to SQLite/Postgres
- [x] Write seed script that mirrors `static-content`
- [x] Backfill repositories with Prisma queries returning DTOs
- [ ] Confirm parity between static pages and DB-backed data
	- [x] Portfolio listing/detail pages now powered by Prisma services
	- [x] Home experience & education sections fetch from Prisma-backed services
	- [x] Home summary, skills, certificates, recommendations, and contact sections fetch from Prisma-backed services
	- [x] Services page consumes database-backed offerings via `ServiceService`
	- [ ] Migrate metadata/SEO ingestion to use `SettingsRepository` outputs (blocked on Settings parity audit)
	- [ ] Validate empty-state fallbacks against latest seed snapshots (add Vitest snapshot spec)
	- [ ] Run parity audit comparing `static-content` exports to Prisma responses and log diffs in `docs/CHANGELOG.md`

## Phase 2 – Authentication & Sessions (Week 2-3)
- [x] Implement user model with secure password hashing (bcrypt)
- [x] Configure iron-session helpers for create/destroy session
- [x] Add rate-limited `/api/v1/auth/login` and `/logout`
- [x] Protect `/admin` routes with server-side session checks
- [x] Write smoke tests for login/logout flows

## Phase 3 – Core Content APIs (Week 3-5)
- [x] Establish validation schemas under `server/server-validators/api`
- [x] Build services and serializers for portfolio entities
- [x] Implement CRUD route handlers for portfolio/projects
- [x] Repeat CRUD stack for experience, education, skills, services
- [x] Implement certificates and recommendations endpoints
- [x] Refactor public pages to consume services instead of static exports
- [x] Add unit tests for each service and serializer

## Phase 4 – Admin Dashboard & CRUD UX (Week 5-7)
- [x] Create `/admin` layout with navigation and protected routing
- [x] Implement dashboard overview (stats, quick links)
	- [x] Surface KPIs via `DashboardService` wiring repositories (admin landing cards)
	- [x] Add quick links for high-priority CRUD flows per engineering standard (needs UX + routing audit)
- [x] Build CRUD forms for portfolio items with client validators
	- [x] Wire `client-validators/forms` schemas to form hooks
	- [x] Ensure serializers enforce DTO parity on submit
- [x] Add drag-and-drop ordering support where required
	- [x] Persist order updates through `reorder` service methods
	- [x] Confirm accessible keyboard interactions per accessibility rules
- [x] Implement draft/publish toggles with optimistic UI
	- [x] Use service-layer status transitions with optimistic updates
	- [x] Cover failure cases with inline error toasts per UX spec
- [x] Cover admin flows with Playwright smoke tests
	- [x] Record smoke paths for portfolio, experience, and skills
	- [x] Validate auth session handling within e2e suite

## Phase 5 – Advanced Systems (Week 7-9)
- [ ] Deliver media upload pipeline (storage abstraction + metadata repo)
	- [x] Local storage driver + metadata repository (`MediaService`, driver contract)
	- [ ] S3/R2 driver implementation + environment toggles
- [ ] Integrate media manager UI with preview/delete support
	- [x] `/admin/media` upload grid with preview + delete actions
	- [ ] Smoke tests for upload constraints + delete confirmations
- [ ] Build blog module (posts, categories, tags, editor)
	- [x] CRUD services, serializers, and admin listing with categories/tags filters
	- [x] Rich text editor + scheduling UX on `/admin/blogs/new` and `/admin/blogs/[slug]`
	- [ ] Scheduled publish e2e coverage and public analytics wiring
- [ ] Implement contact submissions API and admin inbox
	- [x] `/api/v1/contact` pipeline, repository/service layer, `/admin/contact` inbox UI
	- [ ] Document contact analytics + add smoke coverage for rate limits
- [ ] Wire maintenance mode flag and public-site handling
	- [ ] Persist `maintenanceMode` toggle in `Settings`
	- [ ] Honor flag in middleware + public layouts with banner messaging
- [ ] Finish theme registry and selection logic
	- [x] Persist theme selection through `SettingsService` and apply on layout
	- [x] Expose theme tokens to `/app/layout.tsx` via config provider
	- [ ] Backfill QA checklist + screenshot baselines + setup wizard linkage

## Phase 6 – Setup Wizard & Configuration (Week 8-9 overlap)
- [ ] Build `/setup` multi-step wizard UI
- [ ] Support database selection (SQLite vs Neon) with validation
- [ ] Create initial admin user from wizard input
- [ ] Persist initial settings (profile, theme, maintenance)
- [ ] Auto-disable wizard after completion and gate with flag
	- [ ] Store completion state in `Settings` table with timestamp/audit
	- [ ] Add guard middleware redirecting post-setup traffic

## Phase 7 – Polishing, Testing, Release (Week 9-10)
- [ ] Expand Vitest coverage for edge cases and error paths
- [ ] Finalize Playwright end-to-end suites for critical journeys
- [ ] Configure GitHub Actions pipeline (typecheck, lint, test, build)
- [ ] Integrate logging/monitoring hooks (Sentry optional)
- [ ] Refresh documentation (README, architecture, admin guide)
- [ ] Prepare release notes and migration guidance for adopters
- [ ] Tag and publish v1.0.0 release
	- [ ] Create release checklist aligning with CI checklist standards
	- [ ] Publish final migration summary referencing ADR updates

## Cross-Cutting Deliverables
- [ ] Maintain `docs/architecture.md` ADR log for Phase 4-7 decisions
- [ ] Keep `docs/CHANGELOG.md` in sync with phase completions
- [ ] Ensure Prisma migrations stay idempotent across SQLite and Neon targets
- [ ] Document operational scripts (`npm run` tooling) as phases close

## Risks & Mitigations
- **Data parity drift:** Mitigated by automated parity audit in Phase 1 and regression tests once admin CRUD launches.
- **Admin UX complexity:** Contained by leveraging shared validators/serializers and enforcing consistent DTO contracts.
- **Media storage churn:** Start with local disk abstraction behind interface so cloud providers can plug in without refactors.
- **Setup wizard lockout:** Track completion flag with rollback path and manual override documented in `docs/architecture.md`.

---

## Tracking
- Update this checklist at the end of each working session.
- Log noteworthy decisions in `docs/architecture.md` under ADRs.
- Reflect progress in `docs/CHANGELOG.md` when milestones complete.

## Changelog
| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 0.10.00 | 2025-11-11 | Ammar Hany | Initial draft with expanded planning and metadata alignment |
