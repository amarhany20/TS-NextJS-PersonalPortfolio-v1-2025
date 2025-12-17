# 1. System Overview

## 1.1 Product Vision
TS-NextJS-PersonalPortfolio-v1-2025 ("Portfolio Creator") is an open-source, self-hosted portfolio
platform that pairs a themable public site with an authenticated admin CMS. The project empowers
engineers, freelancers, and consultants to launch a production-grade presence without ongoing SaaS
fees while keeping full control over data, themes, and deployments. V1 targets a single-tenant
experience with SQLite/Neon databases, drag-and-drop ordering, and guided setup.

## 1.2 Key Capabilities (V1)
- Enterprise architecture with strict separation between route handlers, services, repositories, and
  serializers.
- Complete server infrastructure: error taxonomy, response helpers, validation pipelines, and
  DTO-focused serializers.
- Database-backed content for portfolio items, experience, education, skills, services, certificates,
  recommendations, blogs, and settings.
- Guided five-step setup wizard that handles database provisioning, admin onboarding, theme
  selection, and initial brand data without manual SQL.
- Admin dashboard covering CRUD, reordering, draft/publish toggles, media uploads, and quick stats.
- Public experience aligned with Ammar Next.js Engineering Standard (three-area layout, responsive
  grid, metadata-ready pages, SEO primitives).
- Documentation suite (architecture baseline, migration summary, migration plan) plus helper
  standards that keep implementation auditable.

## 1.3 Target Users & Constraints
- **Primary:** Individual developers and freelancers who understand Git but prefer a no-code CMS.
- **Secondary:** Agencies bootstrapping repeatable portfolio deployments for clients.
- **Constraints:** V1 assumes single admin, session auth, and a single active theme at a time. Media
  uploads live on disk; CDN/off-box storage is deferred to Phase 5.

## 1.4 Core Journeys
- **First-Time Setup:** Clone repo -> run setup wizard (/setup) -> pick database (SQLite or Neon) ->
  create admin -> choose theme -> enter profile + SEO metadata -> redirect to `/admin/dashboard`.
- **Daily Admin Flow:** Sign into `/admin/login` -> view dashboard KPIs and quick links -> edit
  content via CRUD pages (with Zod validation) -> publish drafts -> upload media via `MediaService` ->
  changes immediately hydrate public routes via Prisma-backed services.
- **Public Visitor Flow:** Visit marketing URLs (`/`, `/portfolio`, `/portfolio/[slug]`, `/services`,
  `/blogs`, `/contact`) -> fetch SSR data via async server components that call `PortfolioService` and
  peers -> Next.js renders theme-specific layouts -> contact form posts to `/api/v1/contact` with rate
  limiting and serializer-backed responses.

## 1.5 Definition of Done & Success Metrics
- Zero breaking changes to existing functionality during migrations (documented in
  `docs/MIGRATION_SUMMARY.md`).
- Production build and static generation pass on every PR (48+ routes validated as of v00.50.06).
- Database parity with the original static content verified via services/repositories (Phase 1 parity
  audit outstanding for metadata/SEO per migration plan).
- Documentation remains concise yet comprehensive, with each architectural change mirrored in this
  folder and referenced from `.github/instructions.md`.
