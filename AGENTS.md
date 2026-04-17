# Agent Guidelines for TS-NextJS-PersonalPortfolio-v1-2025

**Version:** 3.1.3
**Updated:** 2026-03-26
**Status:** Relaunch Preparation

## Project Overview

TS-NextJS-PersonalPortfolio-v1-2025 is a Next.js App Router portfolio platform with:
- a public portfolio website,
- a database-backed admin CMS,
- Prisma-backed persistence,
- theme support,
- setup/bootstrap utilities in mixed states of completion.

This repo is being revived for public launch. Treat the codebase as functional but not yet
launch-verified. Documentation must describe the current implementation truthfully, including
unfinished, disabled, or partially replaced flows.

## Session Startup Order

Before making changes:
1. Read this `AGENTS.md`.
2. Read `.github/copilot-instructions.md`.
3. Read `docs/helper_docs/ammar-agent-guideline/agent-guideline.md`.
4. Read the local helper docs under:
   - `docs/helper_docs/Ammar-Documentation-Guidelines/`
   - `docs/helper_docs/Ammar-NextJS-Guideline/`
5. Read the relevant project docs in `docs/`.
6. Inspect the code paths you plan to touch before changing them.

## Repo Reality

Current verified repo characteristics:
- Framework: Next.js App Router with TypeScript and React 19.
- Persistence: Prisma with PostgreSQL configured in `prisma/schema.prisma`.
- Public pages: `src/app/home`, `src/app/portfolio`, `src/app/services`, `src/app/blogs`.
- Admin pages: `src/app/admin/**`.
- APIs: `src/app/api/v1/**`.
- Setup UI exists in multiple components/routes, but setup API endpoints currently return a
  removal message and redirect users away from `/setup`.
- Env bootstrap exists and can create settings/admin data when the settings row is missing.
- Documentation and status files contain stale "production-ready / 100% complete" claims and must
  not be trusted without code verification.

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
- The supported first-run path is env/bootstrap plus the documented seed flows; do not reintroduce
  the retired `setup:first-run` script flow.

## Architecture Rules

- Follow the layered flow used in the codebase:
  Route/Page -> Service -> Repository -> Serializer/Response
- Do not call repositories directly from route handlers when a service exists.
- Do not import `@/server/*` from client components.
- Use Zod validation at API boundaries.
- Use typed env access patterns; avoid raw `process.env` spread across the app.

## Documentation Rules

- Follow the local Ammar helper-doc rules and guidance in this repo at all times.
- Treat Ammar as the project author/owner in repo documentation and launch-facing materials unless
  the user explicitly asks for a different attribution.
- Keep docs concise, comprehensive, and easy to scan.
- Prefer updating existing canonical docs over creating duplicate narratives.
- Archive stale material instead of silently deleting history.
- Keep documentation continuously aligned with the codebase; when code changes behavior, structure,
  setup flow, or verification state, update the relevant active docs in the same pass.
- Do not end a cleanup or implementation pass with code/docs drift still known and untracked; update
  the implementation checklist and the canonical active docs before stopping.
- Do not mark features as complete unless they were verified against current code and, when
  relevant, current checks.
- Keep short `README.md` files in active top-level source/test folders so folder purpose and local
  rules remain discoverable during relaunch cleanup.

## Cleanup Rules

- During cleanup work, prefer improving active code paths before polishing archived or legacy areas.
- Use current best practices for the framework, TypeScript, accessibility, and maintainability when
  making changes.
- Add docstrings to exported modules, exported functions, and non-obvious utilities that you touch.
- Add short explanatory comments above complex or easy-to-misread logic blocks when the code would
  otherwise be hard to parse quickly.
- Keep comments high-signal; do not add narration for obvious lines.
- When cleanup changes project behavior, sync the related implementation checklist and active docs in
  the same pass.

## Relaunch Priorities

Current relaunch priorities:
1. Reset documentation to match the codebase.
2. Audit setup/bootstrap behavior and decide on one supported first-run path.
3. Re-verify install, lint, typecheck, tests, and build after dependencies are restored.
4. Fix launch blockers found during verification.
5. Align public-facing content, metadata, assets, and release readiness docs.
6. Run repository-wide cleanup in phases, keeping code comments/docstrings and docs in sync.

## Safety

- Never run destructive git commands unless explicitly requested.
- Do not remove user changes you did not make.
- If docs and code disagree, treat code as the current behavior and update docs first.
- If a flow is half-implemented, document that ambiguity explicitly instead of assuming intended
  behavior.

## Changelog

| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 3.1.3 | 2026-03-26 | Codex | Added a rule to keep short README files in active top-level source and test folders so structure and local rules stay discoverable during cleanup. |
| 3.1.2 | 2026-03-25 | Codex | Added an attribution rule to keep repo documentation aligned to Ammar as the project author/owner unless explicitly told otherwise. |
| 3.1.1 | 2026-03-24 | Codex | Added explicit rules to keep docs continuously synced with code, follow helper docs at all times, and apply best-practice standards during implementation. |
| 3.1.0 | 2026-03-24 | Codex | Added cleanup-phase rules covering docstrings, explanatory comments, and checklist/doc synchronization. |
| 3.0.0 | 2026-03-24 | Codex | Rewrote the repo agent guide for relaunch mode. Removed stale completion claims and aligned instructions to the current codebase state. |
| 2.0.0 | 2025-12-27 | Codex | Marked all agents complete and documented the previous production-ready phase. |
