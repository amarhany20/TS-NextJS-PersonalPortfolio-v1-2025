# TS-NextJS-PersonalPortfolio Agents Program (v1.0)

This plan defines parallel workstreams ("agents"), their scopes, sequencing, dependencies, and acceptance criteria. It aligns with:
- docs/helper_docs/* (Engineering, Documentation, and Next.js standards)
- docs/TS-NextJS-PersonalPortfolio-V1-2025 Documentation/* (project docs to be updated)

## Principles
- Minimize cross-branch conflicts via clear folder ownership and narrow PRs.
- Prefer incremental, reversible changes with test coverage and preview deploys.
- Follow the PR checklist and versioning rules in helper docs.

## Branching & PR Workflow
- Default branch: `main`
- One branch per agent epic: `agents/<NN>-<short-name>`
- Feature branches per deliverable: `feat/<area>-<slug>`
- PR rules: small, focused, includes tests; reference this plan; pass lint, typecheck, unit + e2e jobs.
- Merge strategy: squash-merge; rebase frequently to reduce drift.

## Folder Ownership (to avoid interference)
- Agent A: `src/app`, `src/components`, `src/utils`, `src/lib`, `src/themes` (structure only; no feature work)
- Agent B: `docs/TS-NextJS-PersonalPortfolio-V1-2025 Documentation/**`, `docs/**`
- Agent C: `prisma/**`, `scripts/**`, `.env*`, `package.json` (scripts only)
- Agent D: `src/app/admin/**`, `src/components/Admin/**`, `src/components/NavSidebar/**`, `src/components/ProfileSidebar/**`
- Agent E: `src/static-content/**` (move), `backups/**` (new archive)
- Agent F: `prisma/seed.ts`, `prisma/reset-and-seed-ammar.ts` (new), `scripts/**`
- Agent G: `src/app/login/**`, `src/server/security/**`, `src/app/api/**`, `middleware.ts`
- Agent H: Read-only across repo; output in `docs/architecture/` (new)
- Agent I: `tests/**`, `vitest.config.ts`, `playwright/**`, `playwright.config.ts`

## Phases & Dependencies
- Phase 0 (now): Create this plan, agree workflow (done)
- Phase 1: A (codebase alignment), B (docs baseline), C (first-run) — run in parallel
- Phase 2: D (admin layout), G (auth+security), E (archive static content)
- Phase 3: F (seed generator) → depends on E
- Phase 4: H (arch review) → integrates Phase 1–3 outputs
- Phase 5: I (tests coverage expansion) → ongoing after each phase

## Acceptance Criteria per Agent

### Agent A — Codebase Alignment
- Map current structure vs. helper_docs/NextJS guidelines; deliver a short gap report in `docs/architecture/codebase-alignment.md`.
- Apply minimal moves/renames to match `src` layout guidance; update imports and path aliases.
- Lint, typecheck, and build pass; no behavior change; e2e admin smoke tests pass.

### Agent B — Docs Overhaul
- Update all docs under project docs to reflect actual code structure.
- Add runbooks: first run, seeding, theming, admin usage, deployment.
- Apply documentation guideline style, metadata headers, and versioning.

### Agent C — First-Run Setup & DB
- Provide `scripts/setup/first-run.ps1` and `scripts/setup/first-run.ts` with prompts for SQLite or Neon Postgres.
- Automate `.env` creation/update, `prisma migrate dev`, `prisma db seed`, and `pnpm dev` start.
- Document choices and rollback in `docs/runbooks/first-run.md`.

### Agent D — Admin Panel Layout Fix
- Replace dual sidebars with: one primary nav sidebar + a separate context panel that toggles per page.
- Update layout in `src/app/admin/layout.tsx` and related components; ensure keyboard and a11y compliance.
- Visual parity with screenshot theme, with a clean separation of nav vs. context.

### Agent E — Archive Static Content
- Move `src/static-content/**` to `backups/static-content-archive/<YYYY-MM-DD>/` with an index manifest.
- Add migration note explaining the new seed-driven approach.

### Agent F — Seed Generator
- Implement `prisma/reset-and-seed-ammar.ts` that reads the archived manifest and seeds database accordingly.
- Idempotent: safe to run multiple times; covers portfolio, experience, skills, certificates, etc.
- Wire as `pnpm seed:ammar` and document in runbook.

### Agent G — Auth Simplification + Security
- Switch login to password-only (no username) in UI and API.
- Add rate limiting to login route; secure cookies, headers, CSRF/session settings per guidelines.
- Update env vars usage (`AUTH_SECRET`, `SEED_ADMIN_PASSWORD`) and docs.

### Agent H — Architecture Review
- Deliver `docs/architecture/gap-analysis.md` with prioritized backlog to reach production readiness.
- Cover security, logging/observability, caching, API boundaries, migrations, theming, performance.

### Agent I — Tests Coverage
- Unit tests for server utils and serializers; RTL tests for UI components; expand Playwright e2e flows.
- Add coverage thresholds and CI reporting; include smoke test for admin login and theme switching.

## CI Gates
- `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm e2e:smoke` must pass per PR.

## Commands (initial)
```sh
pnpm i
pnpm lint
pnpm typecheck
pnpm test
pnpm dev
```

## Risks & Mitigations
- Layout refactor conflicts: use folder ownership and daily rebases.
- Seed/data mismatches: rely on manifest + idempotent seeding.
- Auth changes breaking admin: ship feature flag `NEXT_PUBLIC_LOGIN_MODE=password-only` during transition.

## Change Log
- v1.0 — Initial agents program created.
