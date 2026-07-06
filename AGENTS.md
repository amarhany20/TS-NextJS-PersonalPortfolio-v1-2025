# Agent Guidelines for TS-NextJS-PersonalPortfolio-v1-2025

**Version:** 3.5.0
**Updated:** 2026-05-07
**Status:** Relaunch Preparation

## Project Overview

TS-NextJS-PersonalPortfolio-v1-2025 is a Next.js App Router portfolio platform with:
- a public portfolio website,
- a database-backed admin CMS,
- Prisma-backed persistence,
- theme support,
- env/bootstrap-driven first-run support.

Treat the repo as functional but still in launch-verification mode. Documentation must describe the
implemented behavior truthfully, including missing surfaces, partially restored flows, and current
verification gaps.

## Session Startup Order

Before making changes:
1. Read this `AGENTS.md`.
2. Read `.github/copilot-instructions.md`.
3. Read `docs/helper_docs/ammar-agent-guideline/agent-guideline.md`.
4. Read `docs/helper_docs/Ammar-Documentation-Guidelines/ammar-documentation-guideline.md` when touching docs.
5. Read `docs/helper_docs/Ammar-NextJS-Guideline/ammar-nextjs-guidelines.md` when touching implementation.
6. Read `docs/helper_docs/Ammar-Workspace-Logging-Standard/ammar-workspace-logging-standard.md` when touching repo-local logs or knowledge-base session records.
7. Read the relevant project docs in `docs/`, especially `docs/architecture/architect.md` plus the relevant numbered section files when touching architecture or repo behavior.
8. Inspect the code paths you plan to touch before changing them.

## Repo Classification

This repository is an implementation repo, not a central documentation workspace.

Ownership boundary for this repo:
- This repo owns code, tests, setup/build/run details, release-facing implementation docs, and repo-local contracts.
- Shared system context, cross-repo architecture, shared operations records, and company-level knowledge belong in the central docs repo when one exists.
- Repo-local audits and knowledge-base records may live here only when they are specific to this codebase and materially help implementation work stay auditable.

## Repo Reality

Current repo truth:
- Framework: Next.js App Router with TypeScript and React 19.
- Persistence: Prisma with PostgreSQL configured in `prisma/schema.prisma`.
- Public routes: `/`, `/home`, `/portfolio`, `/portfolio/[slug]`, `/services`, `/blogs`, `/blogs/[slug]`, `/login`, `/setup` redirect surfaces.
- Admin routes live under `src/app/admin/**`, including dashboard, CRUD managers, media, contact, and settings pages for profile, theme, and setup diagnostics.
- APIs live under `src/app/api/v1/**`, including CRUD endpoints, theme apply/list, contact, auth, media, and `PATCH /api/v1/settings/profile`.
- `/setup` remains a backwards-compatible redirect surface to `/home`; the retired setup wizard is not an active runtime path.
- Env bootstrap can create the settings singleton row and bootstrap admin user when the database exists but the settings record does not.
- The public contact experience lives on `/home#contact`; there is no standalone public `/contact` route.
- `src/static-content/*` is fallback/bootstrap-aligned content, not the primary launch-content source once the database is seeded.
- Current verification truth must stay explicit: `npm run test` and `npm run build` were verified in the current pass; repo-wide `npm run typecheck` is currently failing due Playwright spec typing drift, so do not describe the repo as fully green.
- Documentation and status files may still contain stale “production-ready” or “100% complete” wording; verify against code and current checks before repeating those claims.

## Commands

Primary commands:
- Install dependencies: `npm install`
- Dev server: `npm run dev`
- Build: `npm run build`
- Typecheck: `npm run typecheck`
- Lint: `npm run lint`
- Format check: `npm run format:check`
- Unit tests: `npm run test`
- E2E tests: `npm run e2e`
- Default seed: `npm run db:seed`
- Owner seed: `npm run seed:ammar`

Notes:
- Verification commands require installed dependencies in the active workspace.
- The supported first-run path is env/bootstrap plus the documented seed flows; do not reintroduce the retired `setup:first-run` script flow.
- Run `npm run clean` before verification when routes or generated Next output changed so stale `.next` and `.next-playwright` artifacts do not poison build or type validation.
- The isolated Playwright gate runs serially by default because the admin E2E suite mutates a shared seeded app and database instance.
- Do not mark repo-wide verification complete unless the command actually passed in the current state.

## Architecture Rules

- Follow the codebase layering that is active today:
  Page/Route -> Service -> Repository -> Serializer/Response.
- Do not call repositories directly from route handlers when a service exists.
- Do not import `@/server/*` from client components.
- Use Zod validation at API boundaries.
- Use typed env access patterns; avoid raw `process.env` spread through active server code.
- Treat controllers as optional or legacy support surfaces unless the current route path actually uses them; do not document controller-driven flow as mandatory when the live code routes directly to services.

## Documentation Rules

- Follow the local Ammar helper-doc rules at all times.
- The shared `agent-guideline.md` owns cross-repo workflow, the documentation guideline owns document form, the Next.js standard owns framework implementation conventions, and this file owns repo-specific behavior.
- Treat Ammar as the project author/owner in repo documentation and launch-facing materials unless the user explicitly asks for different attribution.
- Keep docs concise, comprehensive, and easy to scan.
- Prefer updating existing canonical docs over creating parallel narratives.
- Archive stale material instead of silently deleting history.
- Keep `docs/architecture/architect.md` limited to intro-file duties: scope, structure intent, navigation guidance, current architecture summary, and changelog.
- Keep detailed architecture content in `docs/architecture/sections/NN-*.md`.
- Keep step-by-step manual verification in `docs/architecture/sections/10-manual-testing-guidelines.md`, not in the intro file.
- When architecture sections are added, removed, or reordered, update the TOC and Previous/Next links in the touched files.
- Keep `docs/architecture/sections/09-implementation-checklist.md` aligned whenever current verification state or launch-readiness understanding changes.
- Keep repo-local current-state audits under `docs/knowledge-base/` when they are needed; do not duplicate shared cross-repo architecture there.
- Follow the workspace logging standard only for repo-local logs or knowledge-base story records; do not turn policy docs into session dumps.
- Do not mark features, checks, or release state as complete unless they were verified against current code and relevant commands.
- Keep short `README.md` files in active top-level source/test folders so structure and local rules stay discoverable during relaunch cleanup.

## Cleanup Rules

- During cleanup work, prefer improving active code paths before polishing archived or legacy areas.
- Use current best practices for Next.js, TypeScript, accessibility, and maintainability when making changes.
- Add docstrings to exported modules, exported functions, and non-obvious utilities that you touch.
- Add short explanatory comments above complex or easy-to-misread logic blocks when the code would otherwise be hard to parse quickly.
- Keep comments high-signal; do not add narration for obvious lines.
- When cleanup changes project behavior, sync related implementation checklist and active docs in the same pass.

## Relaunch Priorities

Current relaunch priorities:
1. Keep active docs truthful and architecture-complete.
2. Remove remaining low-risk stale setup and legacy code surfaces.
3. Finish the review/checkup/cleanup items tracked in the implementation checklist.
4. Restore a fully green verification baseline across typecheck, lint, unit tests, build, and isolated E2E.
5. Fix launch blockers found during verification.
6. Finalize launch content, metadata, assets, and release readiness docs.

## Safety

- Never run destructive git commands unless explicitly requested.
- Do not remove user changes you did not make.
- If docs and code disagree, treat code as the current behavior and update docs first.
- If a flow is half-implemented, document the ambiguity explicitly instead of assuming intended behavior.

## After Changes

- Update affected docs, checklists, or repo-local knowledge-base entries when the task changes current-state understanding.
- Verify that code, active docs, and any repo-local audit material still agree after the change.
- If full documentation sync is not possible in the same pass, leave an explicit user-visible note instead of silent drift.

## Changelog

| Version | Date       | Author         | Description                                                                                                                                                                                                                                                                       |
| ------- | ---------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 3.5.0   | 2026-05-07 | GitHub Copilot | Fully re-read the local helper docs, refreshed repo reality, documented the live profile-settings surface, added the workspace-logging standard to startup rules, and corrected AGENTS guidance to stop overstating the current verification baseline.                            |
| 3.4.1   | 2026-04-20 | GitHub Copilot | Removed the repo-local logs idea, kept repo-local knowledge-base guidance only, and aligned the startup/read-order plus after-change rules to the final documentation structure.                                                                                                  |
| 3.4.0   | 2026-04-20 | GitHub Copilot | Added the repo-classification boundary, documented repo-local knowledge-base and log locations plus usage rules, and made the startup/read-order expectations explicit for current-state audit work.                                                                              |
| 3.3.0   | 2026-04-19 | GitHub Copilot | Aligned the repo-specific rules to the shared agent guideline and local documentation standard, documented the `architect.md` intro-file pattern plus numbered architecture sections, and recorded the current serial-by-default isolated Playwright gate behavior.               |
| 3.2.0   | 2026-04-18 | GitHub Copilot | Updated repo reality to reflect the redirect-only `/setup` surface, removal of retired setup API stubs, canonical `/home` routing, the embedded home-page contact experience, and the need to clear `.next`/`.next-playwright` artifacts before verification after route cleanup. |
| 3.1.3   | 2026-03-26 | Codex          | Added a rule to keep short README files in active top-level source and test folders so structure and local rules stay discoverable during cleanup.                                                                                                                                |
| 3.1.2   | 2026-03-25 | Codex          | Added an attribution rule to keep repo documentation aligned to Ammar as the project author/owner unless explicitly told otherwise.                                                                                                                                               |
| 3.1.1   | 2026-03-24 | Codex          | Added explicit rules to keep docs continuously synced with code, follow helper docs at all times, and apply best-practice standards during implementation.                                                                                                                        |
| 3.1.0   | 2026-03-24 | Codex          | Added cleanup-phase rules covering docstrings, explanatory comments, and checklist/doc synchronization.                                                                                                                                                                           |
| 3.0.0   | 2026-03-24 | Codex          | Rewrote the repo agent guide for relaunch mode. Removed stale completion claims and aligned instructions to the current codebase state.                                                                                                                                           |
