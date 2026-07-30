# AGENTS.md — TS-NextJS-PersonalPortfolio-v1-2025

**Version:** 4.2.0
**Updated:** 2026-07-30
**Status:** Public OSS Template

## Project Overview

TS-NextJS-PersonalPortfolio-v1-2025 is a self-hosted portfolio platform built with Next.js App
Router, React 19, TypeScript, Tailwind CSS, and Prisma + PostgreSQL. It ships:

- a public portfolio website (home, portfolio, services, blog),
- a database-backed admin CMS (`/admin/**`),
- session-based single-admin auth,
- theme support (7 built-in themes),
- env/bootstrap-driven first-run setup (no web setup wizard).

This repository is a public, open-source template. Anyone should be able to clone it, configure a
few environment variables, and deploy their own portfolio (Vercel + a Postgres provider such as
Neon is the supported target).

## Repo Classification

This is a standalone public implementation repository with its own git history and remote. It does
not have access to any private/internal documentation — this file must stay self-contained.

## Session Startup Order

1. Read this `AGENTS.md`.
2. Read `.github/copilot-instructions.md` and `.github/instructions.md` if present.
3. Read the relevant folder `README.md` files under `src/**` before touching that area (e.g.
   `src/app/README.md`, `src/server/README.md`, `src/components/README.md`).
4. Inspect the code paths you plan to touch before changing them.

## Repo Reality

- Framework: Next.js App Router with TypeScript and React 19.
- Persistence: Prisma with PostgreSQL configured in `prisma/schema.prisma` (no SQLite fallback).
- Public routes: `/`, `/home`, `/portfolio`, `/portfolio/[slug]`, `/services`, `/blogs`,
  `/blogs/[slug]`, `/login`. `/setup` is a backwards-compatible redirect to `/home`.
  `/feed.xml` and `/feed.json` serve RSS 2.0 and JSON Feed v1.1 feeds of published
  portfolio items and blog posts. `/portfolio` supports `?stack=` filtering.
- Admin routes live under `src/app/admin/**`: dashboard, CRUD managers, media, contact inbox, and
  settings pages for profile, visibility, theme, and setup diagnostics.
- APIs live under `src/app/api/v1/**`: CRUD endpoints per domain, theme apply/list, contact, auth,
  media, and `PATCH /api/v1/settings/profile` / `PATCH /api/v1/settings/visibility`.
- Env bootstrap (`EnvBootstrapService`) creates the settings singleton row and bootstrap admin user
  when the database exists but those records do not.
- The public contact experience lives on `/home#contact`; there is no standalone public `/contact`
  route.
- `src/static-content/**` is fallback/bootstrap-aligned content, not the primary content source
  once the database is seeded.
- Always verify current `npm run typecheck` / `npm run lint` / `npm run test` / `npm run build` /
  `npm run e2e` status yourself before describing the repo as fully green — do not assume a
  previous session's result still holds.

## Commands

- Install dependencies: `npm install`
- Dev server: `npm run dev`
- Build: `npm run build`
- Typecheck: `npm run typecheck`
- Lint: `npm run lint`
- Format check: `npm run format:check`
- Unit tests: `npm run test`
- E2E tests: `npm run e2e`
- Default seed: `npm run db:seed`
- Clean generated output: `npm run clean`

Notes:

- Run `npm run clean` before verification when routes or generated Next output changed, so stale
  `.next`/`.next-playwright` artifacts do not poison build or type validation.
- The isolated Playwright gate runs serially by default because the admin E2E suite mutates a
  shared seeded app and database instance. Use `PLAYWRIGHT_DATABASE_URL` to avoid mutating your
  main database during E2E.
- Do not mark verification complete unless the command actually passed in the current state.

## Architecture Rules

- Follow the active layering: Page/Route → Service → Repository → Serializer/Response.
- Do not call repositories directly from route handlers when a service exists.
- Do not import `@/server/*` from client components.
- Validate all API input with Zod at the boundary (`src/server/server-validators/**`).
- Use typed env access; avoid raw `process.env` spread through server code.
- Keep response envelopes consistent: `{ success, data, meta }` / `{ success: false, error }`.

## Security Rules

- Single-admin session auth via `iron-session` (HttpOnly, SameSite=lax, secure cookies in
  production). Passwords are hashed with bcrypt.
- `requireAuth()` guards the admin layout and protected API routes.
- Rate-limit auth login and public contact submission.
- Never commit real secrets. `.env.example` documents required variables; copy it to `.env.local`
  for local development and use your hosting provider's environment variable store in production.

## Documentation Rules

- Keep this file self-contained — it is the only agent-facing doc a public clone will have.
- Keep short `README.md` files in active top-level source/test folders so structure stays
  discoverable.
- Do not claim "production-ready" or "100% complete" unless verified against the current code and
  passing commands in this session.
- Update this file's Changelog when repo-reality or rules materially change.

## Safety

- Never run destructive git commands unless explicitly requested.
- Do not remove user changes you did not make.
- If docs and code disagree, treat code as the current behavior and update docs first.
- Treat `npm run seed:ammar` (if present) and `prisma migrate reset` as destructive; never run
  either against a database you don't intend to wipe.

## After Changes

- Update this file and any touched folder `README.md` when the change affects repo-reality,
  commands, or architecture rules.
- Re-run the relevant verification commands and report actual results, not assumed ones.

## Changelog

| Version | Date       | Author         | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ------- | ---------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 4.0.0   | 2026-07-30 | GitHub Copilot | Rewrote for public OSS release: removed references to the private docs repo, internal helper-doc paths, and Ammar-specific secrets/domain assumptions; made this file fully self-contained for public clones.                                                                                                                                                                                                                                                                                                                                                                                      |
| 4.1.0   | 2026-07-30 | GitHub Copilot | Public-OSS-prep pass: added `LICENSE` (MIT), `CONTRIBUTING.md`, `SECURITY.md`, and `CODE_OF_CONDUCT.md`; added a Vercel deploy button and a tightened Quick Start to the README; removed tracked debug artifacts (`playwright_output.log`, `test_error.txt`, `test_output.log`, `test_output.txt`, `test_results.log`) and added them to `.gitignore`; re-ran the verification gate and recorded the actual per-command results in the central `09-implementation-checklist.md` (typecheck / lint / format:check / test / build each have known open items; full results in the linked checklist). |
| 4.2.0   | 2026-07-30 | GitHub Copilot | Wave 1 features shipped: F5 (RSS/JSON feeds at `/feed.xml` and `/feed.json`), F2 (stack-based URL-driven portfolio filtering via `?stack=`), F3 (per-post OG/Twitter metadata for blog detail and index pages). Version bumped to `00.82.00`.                                                                                                                                                                                                                                                                                                                                                      |
| 3.5.0   | 2026-05-07 | GitHub Copilot | Fully re-read the local helper docs, refreshed repo reality, documented the live profile-settings surface, added the workspace-logging standard to startup rules, and corrected AGENTS guidance to stop overstating the current verification baseline.                                                                                                                                                                                                                                                                                                                                             |
| 3.4.1   | 2026-04-20 | GitHub Copilot | Removed the repo-local logs idea, kept repo-local knowledge-base guidance only, and aligned the startup/read-order plus after-change rules to the final documentation structure.                                                                                                                                                                                                                                                                                                                                                                                                                   |
| 3.4.0   | 2026-04-20 | GitHub Copilot | Added the repo-classification boundary, documented repo-local knowledge-base and log locations plus usage rules, and made the startup/read-order expectations explicit for current-state audit work.                                                                                                                                                                                                                                                                                                                                                                                               |
| 3.3.0   | 2026-04-19 | GitHub Copilot | Aligned the repo-specific rules to the shared agent guideline and local documentation standard, documented the `architect.md` intro-file pattern plus numbered architecture sections, and recorded the current serial-by-default isolated Playwright gate behavior.                                                                                                                                                                                                                                                                                                                                |
| 3.2.0   | 2026-04-18 | GitHub Copilot | Updated repo reality to reflect the redirect-only `/setup` surface, removal of retired setup API stubs, canonical `/home` routing, the embedded home-page contact experience, and the need to clear `.next`/`.next-playwright` artifacts before verification after route cleanup.                                                                                                                                                                                                                                                                                                                  |
| 3.1.3   | 2026-03-26 | Codex          | Added a rule to keep short README files in active top-level source and test folders so structure and local rules stay discoverable during cleanup.                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| 3.1.2   | 2026-03-25 | Codex          | Added an attribution rule to keep repo documentation aligned to Ammar as the project author/owner unless explicitly told otherwise.                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| 3.1.1   | 2026-03-24 | Codex          | Added explicit rules to keep docs continuously synced with code, follow helper docs at all times, and apply best-practice standards during implementation.                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| 3.1.0   | 2026-03-24 | Codex          | Added cleanup-phase rules covering docstrings, explanatory comments, and checklist/doc synchronization.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| 3.0.0   | 2026-03-24 | Codex          | Rewrote the repo agent guide for relaunch mode. Removed stale completion claims and aligned instructions to the current codebase state.                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
