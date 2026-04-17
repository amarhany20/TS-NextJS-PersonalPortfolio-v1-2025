# Implementation Checklist

**Version:** 2.2.9
**Created:** 2025-12-14
**Last Updated:** 2026-03-26
**Author:** Ammar Hany
**Maintainer:** Ammar Hany
**Status:** Active
**Tags:** [Roadmap, Relaunch, Launch, Tracking]

---

## Overview

This is the active launch-preparation checklist for the revived project.

It focuses on what still remains before public release, based on code inspection and the current
verification pass already completed in this revival cycle.

---

## 1. Current Verified State

- [x] Dependencies install successfully with `npm install`.
- [x] TypeScript passes with `npm run typecheck`.
- [x] Unit tests pass with `npm run test`.
- [x] Production build passes with `npm run build`.
- [x] Lint tooling works again and `npm run lint` completes without errors.
- [x] Documentation root has been simplified and historical clutter archived.
- [ ] E2E coverage is fully passing in the current revival cycle
      (targeted reruns are green for the main CRUD slices, but a reused live dev server produced a
      noisy full-suite run with environment-specific and parallel-execution failures that still need
      cleanup before launch verification can be called complete).
- [x] One supported setup/bootstrap path has been chosen:
      env/bootstrap-driven setup.
- [ ] Launch blockers have been fully cleared.

---

## 2. Must Finish Before Launch

### 2.1 Setup and Bootstrap

- [x] Decide the supported onboarding path:
      env/bootstrap-only.
- [x] Resolve missing `setup:first-run` script references in `package.json`.
- [x] Remove or archive conflicting setup pieces so the product tells one coherent setup story.
- [x] Document the final first-run path end to end.

### 2.2 Verification and Runtime Confidence

- [x] Run `npm run e2e`.
- [ ] Verify admin login flow in the current environment.
- [ ] Verify core admin CRUD flows.
- [ ] Verify reorder flows for portfolio/services or any launch-critical content managers.
- [ ] Verify public critical paths: home, portfolio, services, blog, contact.

### 2.3 Launch-Facing Correctness

- [x] Audit `.env.example` against actual runtime requirements.
- [ ] Expand env validation for critical required variables and secrets.
- [ ] Review public metadata, SEO, and social preview settings.
- [ ] Review launch content for placeholders, demo content, and anything not meant for public release.

---

## 3. Should Finish Before Launch

### 3.1 Code Quality Debt

- [x] Clear the active lint warning backlog in the current verified codebase.
- [ ] Clean remaining setup leftovers in active source files.
- [x] Replace the old multi-step public setup tree with a minimal backwards-compatible redirect path.
- [x] Start repository-wide cleanup phase with docstrings/comments for touched code and phased verification tracking.
- [x] Remove the main admin-manager warning cluster by replacing unsafe `any` usage with explicit view-model typing.

### 3.2 Documentation Alignment

- [ ] Review remaining architecture section files and align them to current code where needed.
- [x] Make sure setup, release, and launch docs only describe supported flows.
- [ ] Archive or rewrite any remaining docs that still overstate readiness.

### 3.3 Release Readiness

- [ ] Update the final release checklist based on the actual supported launch flow.
- [ ] Confirm seeding and owner-data workflows are documented truthfully for this repo state.

---

## 4. Can Slip to Post-Launch

- [ ] Full formatting normalization across the entire repo.
- [ ] Broader warning cleanup in tests and legacy admin areas.
- [ ] Theme/reference docs revalidation and restoration from archive if needed.
- [ ] Broader observability and deployment-doc polish after the first launch.

---

## 5. Review, Checkup & Cleanup Matrix

Use this section as the active execution board for repo-wide audits. For each area:
- `Review` means read the code and compare it against the intended behavior and active docs.
- `Checkup` means run or inspect the most relevant verification path.
- `Cleanup` means fix drift, dead code, naming, comments/docstrings, and documentation mismatches.

### 5.1 App Folders

| Area | Review | Checkup | Cleanup | Notes |
|------|--------|---------|---------|-------|
| `src/app/(public)` | [x] | [x] | [x] | Public navigation and responsive-home assertions were updated to reflect the current hero content instead of retired placeholder copy. |
| `src/app/admin` | [x] | [x] | [x] | Cleanup now routes the admin setup diagnostics page through `SettingsService` instead of importing a repository directly. |
| `src/app/api` | [x] | [x] | [x] | Retired setup endpoints were re-reviewed and cleaned so comments/docs match the current removed-flow behavior, and the Playwright bootstrap now matches the PostgreSQL-only datasource. |
| `src/app/blogs` | [ ] | [ ] | [ ] | Confirm blog public experience is not described as placeholder if behavior is now real. |
| `src/app/home` | [ ] | [ ] | [ ] | Check section composition and data dependencies against docs. |
| `src/app/login` | [ ] | [ ] | [ ] | Verify login flow, seeded admin assumptions, and auth docs alignment. |
| `src/app/portfolio` | [ ] | [ ] | [ ] | Check listing/detail parity with admin publishing and docs. |
| `src/app/services` | [ ] | [ ] | [ ] | Verify public service rendering against admin/service schema. |

### 5.2 Shared Source Folders

| Area | Review | Checkup | Cleanup | Notes |
|------|--------|---------|---------|-------|
| `src/components` | [ ] | [ ] | [ ] | Audit shared component semantics, accessibility, and docstrings. |
| `src/components/Admin` | [x] | [x] | [ ] | Major CRUD domains are now green in targeted serial Playwright passes; remaining work is mostly suite-level stability and any final code/doc polish. |
| `src/sections` | [ ] | [ ] | [ ] | Confirm section usage and remove stale assumptions after setup cleanup. |
| `src/server` | [x] | [x] | [x] | Settings setup diagnostics now stay inside the service layer, typed env access was expanded across bootstrap/auth/server utilities, and the top-level server folder README documents the active repo flow. |
| `src/client-validators` | [ ] | [ ] | [ ] | Check parity with server validators and actual form behavior. |
| `src/static-content` | [x] | [x] | [x] | Placeholder metadata and fallback demo content were neutralized; continue reviewing launch content quality in the seeded DB/app surfaces. |
| `src/themes` | [ ] | [ ] | [ ] | Confirm theme registry behavior, preview/apply flow, and docs. |
| `src/types` | [ ] | [ ] | [ ] | Audit type drift between UI, APIs, Prisma, and docs. |
| `src/utils` / `src/lib` | [ ] | [ ] | [ ] | Review helpers for stale TODOs, launch assumptions, and analytics placeholders. |

### 5.3 Domain Audits

| Domain | Review | Checkup | Cleanup | Notes |
|--------|--------|---------|---------|-------|
| Auth/Login | [x] | [x] | [x] | Live browser verification confirmed current env-backed admin credentials differ from README defaults; docs now explicitly say env truth wins. |
| Dashboard | [x] | [x] | [x] | Dashboard stats and sidebar navigation tests are green after aligning selectors to the current shell. |
| Blog | [x] | [x] | [ ] | Targeted CRUD rerun is green; keep watching the blog editor path in the final isolated suite pass. |
| Portfolio | [x] | [x] | [x] | Targeted Playwright coverage is green after aligning the list-page expectation to the current empty-state-first launch dataset. |
| Experience | [x] | [x] | [x] | Create/publish/edit is green in targeted Playwright, and the admin delete action was manually verified in the live browser. |
| Education | [x] | [x] | [x] | Targeted Playwright CRUD rerun is green. |
| Services | [x] | [x] | [x] | Targeted serial Playwright CRUD rerun is green. |
| Certificates | [x] | [x] | [x] | Targeted serial Playwright CRUD rerun is green after earlier cleanup. |
| Recommendations | [x] | [x] | [x] | Targeted serial Playwright CRUD rerun is green; cleanup helper was hardened against transient teardown request failures. |
| Skills | [x] | [x] | [x] | Targeted serial Playwright CRUD rerun is green. |
| Media | [x] | [x] | [x] | Upload/delete flow green after MIME and optimistic-delete fixes. |
| Contact | [x] | [x] | [x] | Contact API and admin inbox tests are green after isolating rate-limit state with unique forwarded-IP headers per spec. |
| Theme | [x] | [x] | [ ] | Theme preview flow is green in targeted serial verification; still review broader theme docs. |
| Setup/Bootstrap | [x] | [x] | [x] | Supported path chosen, retired flow removed, docs updated. |
| Metadata/SEO | [x] | [ ] | [ ] | Static fallback identity placeholders were removed; canonical, OG, and seeded SEO review still remain. |

### 5.4 Documentation Surfaces

| Area | Review | Checkup | Cleanup | Notes |
|------|--------|---------|---------|-------|
| `README.md` | [x] | [x] | [x] | Added explicit notes about env-truth credentials, the difference between isolated Playwright bootstrap runs and reused live dev servers, the PostgreSQL requirement for isolated E2E bootstrapping, and the dedicated isolated port/defaults. |
| `docs/architecture/*` | [x] | [x] | [x] | Code-structure and testing docs were corrected to reflect the active folder READMEs, current test commands, and the isolated Playwright gate. |
| `docs/runbooks/*` | [ ] | [ ] | [ ] | Verify any remaining launch/runbook instructions against the real workflow. |
| `docs/helper_docs/*` | [ ] | [ ] | [ ] | Keep helper docs referenced correctly and avoid drift in repo-facing docs. |

### 5.5 Initial Audit Findings To Execute

- [x] Neutralize fallback demo portfolio/static-content exports so template sample content does not leak into launch paths.
- [x] Review and clean placeholder social/SEO fallback data in [src/static-content/metadata.ts](C:\Users\ammar\Downloads\Ammar\GitHub\TS-NextJS-PersonalPortfolio-v1-2025\src\static-content\metadata.ts).
- [ ] Reconcile the full Playwright suite with the current seeded dataset and isolated test-server assumptions before using it as the launch gate.
- [x] Remove the stale SQLite fallback from Playwright bootstrap so isolated E2E startup matches the PostgreSQL Prisma datasource.
- [x] Separate isolated Playwright bootstrapping from reused live-server debugging so isolated runs default to their own port and build output.
- [x] Exclude the isolated `.next-playwright` output from ESLint so generated test-build artifacts do not fail repo linting.
- [x] Remove `shell: true` from the Playwright webserver helper so isolated E2E startup is cleaner on Windows.
- [x] Expand typed env usage through the bootstrap/auth path and key server utilities so fewer active server files rely on raw `process.env`.
- [x] Remove deterministic seed IDs from skill-group seeding so repeated E2E bootstrap runs use Prisma-managed primary keys.
- [ ] Review analytics TODOs in [src/utils/analytics.ts](C:\Users\ammar\Downloads\Ammar\GitHub\TS-NextJS-PersonalPortfolio-v1-2025\src\utils\analytics.ts) and decide launch scope.
- [x] Clean the first stale-wording pass in [README.md](C:\Users\ammar\Downloads\Ammar\GitHub\TS-NextJS-PersonalPortfolio-v1-2025\README.md) discovered during the audit pass.
- [x] Add short `README.md` files to the active top-level source/test folders so structure and local rules are discoverable while relaunch cleanup continues.

---

## 6. Open Risks

- [ ] The full Playwright suite is still sensitive to reused live-dev-server runs and stale content assumptions; the launch gate should use the isolated seeded test server.
- [ ] Several legacy E2E assertions still assume placeholder/default content or one-size-fits-all redirect timing and need cleanup.
- [ ] Public release quality still depends on an explicit content and metadata review.
- [ ] E2E is improved but not yet fully green in this revival cycle.

---

## 7. Definition of Launch-Ready

Do not mark launch-ready until all of the following are true:

- [ ] installation works on a clean machine
- [ ] typecheck, lint, tests, build, and e2e pass
- [ ] one setup/bootstrap path is clearly supported
- [ ] admin login and key CRUD flows are verified
- [ ] public pages, metadata, and launch content are reviewed
- [ ] docs match the codebase and supported launch process
- [ ] release checklist is updated for the final launch pass

---

## 8. Session Rule

At the end of each work session:
- update this checklist,
- record only commands that actually passed,
- move stale claims to archive rather than leaving them in active docs.

---

## Changelog

| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 2.2.9 | 2026-03-26 | Codex | Expanded typed env usage through bootstrap, auth, Prisma, dashboard, and server utility paths, updated the example API route to reflect its real readiness-probe role, and verified the affected unit/lint/typecheck slices. |
| 2.2.8 | 2026-03-26 | Codex | Removed `shell: true` from the Playwright webserver helper to eliminate the remaining Windows startup warning from the isolated E2E path. |
| 2.2.7 | 2026-03-26 | Codex | Excluded `.next-playwright` generated output from ESLint and kept the launch checklist aligned with the isolated Playwright build path. |
| 2.2.6 | 2026-03-26 | Codex | Split Playwright into isolated-vs-reused server defaults, added a dedicated isolated base URL/port path, and documented the new E2E bootstrap behavior in the active docs. |
| 2.2.5 | 2026-03-26 | Codex | Removed the stale SQLite fallback from Playwright bootstrap, aligned `.env.example` and README to the PostgreSQL-only E2E datasource requirement, and kept API/testing notes in sync. |
| 2.2.4 | 2026-03-26 | Codex | Added top-level folder READMEs across the active source/test tree, fixed the admin setup page to route through `SettingsService`, and corrected architecture/testing docs to match the current repo flow and Playwright strategy. |
| 2.2.3 | 2026-03-26 | Codex | Marked the certificates, education, services, recommendations, settings/theme, and skills slices green in targeted serial Playwright verification and corrected README architecture wording that still described active layers as empty or static-only. |
| 2.2.2 | 2026-03-25 | Codex | Added env-truth attribution guidance to AGENTS, stabilized the contact E2E slice by isolating rate-limit keys per test, and marked auth/contact verification progress in the checklist. |
| 2.2.1 | 2026-03-25 | Codex | Aligned public-navigation and admin-dashboard E2E assertions to the current app shell and hero content, and updated README/checklist notes for env-backed credentials and reused-server caveats. |
| 2.2.0 | 2026-03-25 | Codex | Cleared the targeted experience verification gap, manually confirmed the admin delete action, and recorded that remaining E2E work is now centered on full-suite isolation and stale test assumptions rather than the product delete flow. |
| 2.1.9 | 2026-03-25 | Codex | Verified most targeted CRUD Playwright reruns as green, aligned portfolio expectations to the current seeded empty state, and narrowed the remaining admin verification gap to the experience delete path. |
| 2.1.8 | 2026-03-25 | Codex | Recorded the E2E seed-bootstrap bug, marked certificates green on targeted rerun, and tracked the seeding fix needed for stable repeated Playwright startup. |
| 2.1.7 | 2026-03-25 | Codex | Cleaned the static fallback content layer by removing placeholder metadata identities, neutralizing demo portfolio fallbacks, and clearing sample certificate/recommendation records. |
| 2.1.6 | 2026-03-24 | Codex | Added a folder/domain review-checkup-cleanup matrix to drive repo-wide audits and recorded the first concrete audit findings for launch cleanup. |
| 2.1.5 | 2026-03-24 | Codex | Completed the first-run documentation truth pass, corrected README and infrastructure docs, reran Playwright, and recorded the current 12/19 E2E pass state. |
| 2.1.4 | 2026-03-24 | Codex | Removed the legacy setup UI/server subsystem, kept a minimal `/setup` redirect path for backwards compatibility, and re-verified lint, typecheck, and production build. |
| 2.1.3 | 2026-03-24 | Codex | Finished the active lint cleanup pass, including admin managers, media rendering, and test helper cleanup, with lint and typecheck both green. |
| 2.1.2 | 2026-03-24 | Codex | Started the repo-wide cleanup phase, added cleanup standards to AGENTS.md, and reduced the active lint warning count during the first cleanup pass. |
| 2.1.1 | 2026-03-24 | Codex | Chose env/bootstrap-only onboarding, removed broken setup script references, and updated active docs to reflect the supported launch path. |
| 2.1.0 | 2026-03-24 | Codex | Reframed the checklist around the actual remaining launch work, grouped by must/should/post-launch priority. |
| 2.0.1 | 2026-03-24 | Codex | Installed dependencies, verified typecheck/tests/build, fixed the lint script, and recorded remaining warning/format debt. |
| 2.0.0 | 2026-03-24 | Codex | Replaced the previous completion-focused checklist with a relaunch execution checklist based on current code inspection. |
