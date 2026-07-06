# Implementation Checklist

**Version:** 2.4.0
**Created:** 2025-12-14
**Last Updated:** 2026-05-07
**Author:** Ammar Hany
**Maintainer:** Ammar Hany
**Status:** Active
**Tags:** [Roadmap, Relaunch, Launch, Tracking]

---

## Overview

This is the active launch-preparation checklist for the revived project.

It focuses on what still remains before public release, based on code inspection and the current
verification pass already completed in this revival cycle.

The current implementation pass starts with documentation truth plus low-risk cleanup. Use this
file as the single execution board for that work instead of scattering status across other docs.

---

## 1. Current Verified State

- [x] Dependencies install successfully with `npm install`.
- [ ] TypeScript passes with `npm run typecheck`.
      Current repo-wide typecheck is failing on Playwright spec typing drift in the admin E2E slices.
- [x] Unit tests pass with `npm run test`.
- [x] Production build passes with `npm run build`.
- [x] Lint tooling works again and `npm run lint` completes without errors.
- [x] Documentation root has been simplified and historical clutter archived.
- [ ] E2E coverage is fully passing in the current revival cycle.
      Targeted verification history exists, but the isolated suite must be rerun and treated as unresolved until it is green again in the current repo state.
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

- [ ] Run `npm run e2e`.
- [x] Verify admin login flow in the current environment.
- [x] Verify core admin CRUD flows.
- [x] Verify reorder flows for portfolio/services or any launch-critical content managers.
- [x] Verify public critical paths: home, portfolio, services, blog, contact.
- [ ] Re-run `npm run typecheck` after fixing the current Playwright spec typing drift.
- [ ] Re-run isolated E2E against a dedicated `PLAYWRIGHT_DATABASE_URL` before final release if the launch database must remain untouched.

### 2.3 Launch-Facing Correctness

- [x] Audit `.env.example` against actual runtime requirements.
- [x] Expand env validation for critical required variables and secrets.
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

- [x] Refresh this checklist as the single execution board for the current relaunch pass.
- [x] Review remaining architecture section files and align them to current code where needed.
- [x] Make sure setup, release, and launch docs only describe supported flows.
- [x] Rewrite `.github/copilot-instructions.md` so it reflects the real env/bootstrap flow,
      PostgreSQL-only datasource, and current active docs.
- [x] Archive or rewrite any remaining active docs that still overstate readiness.

### 3.3 Release Readiness

- [x] Update the final release checklist based on the actual supported launch flow.
- [x] Confirm seeding and owner-data workflows are documented truthfully for this repo state.

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

| Area                | Review | Checkup | Cleanup | Notes                                                                                                                                                                                                                         |
| ------------------- | ------ | ------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/app/(public)`  | [x]    | [x]     | [x]     | Public navigation and responsive-home assertions were updated to reflect the current hero content instead of retired placeholder copy.                                                                                        |
| `src/app/admin`     | [x]    | [x]     | [x]     | Cleanup now routes the admin setup diagnostics page through `SettingsService` instead of importing a repository directly.                                                                                                     |
| `src/app/api`       | [x]    | [x]     | [x]     | Active API docs now match the route tree, the diagnostics endpoint is documented as a readiness probe, and not-found responses were normalized for the remaining inconsistent item routes.                                    |
| `src/app/blogs`     | [x]    | [x]     | [x]     | Verified the public blog routes are real, corrected the public index to render published posts only, and aligned the active architecture notes with that behavior.                                                            |
| `src/app/home`      | [x]    | [x]     | [x]     | Verified the root route redirects to `/home`, confirmed `src/app/home/page.tsx` composes `src/sections/home`, and corrected the active architecture docs to match.                                                            |
| `src/app/login`     | [x]    | [x]     | [x]     | Verified the `/login` entry point, confirmed admin layout redirects unauthenticated users there, updated docs away from stale `/admin/login` wording, and aligned credential wording to the current `ADMIN_*` bootstrap flow. |
| `src/app/portfolio` | [x]    | [x]     | [x]     | Verified the public index pulls `getPublishedProjects()`, moved reusable card/grid UI into components, added a launch-safe empty state, and kept the route aligned to published content.                                      |
| `src/app/services`  | [x]    | [x]     | [x]     | Verified the public page renders `getActiveServices()`, removed placeholder-style empty-state copy, switched the section import back to the alias style, and aligned the architecture notes to the current card content.      |

### 5.2 Shared Source Folders

| Area                    | Review | Checkup | Cleanup | Notes                                                                                                                                                                                                                |
| ----------------------- | ------ | ------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/components`        | [ ]    | [ ]     | [ ]     | Audit shared component semantics, accessibility, and docstrings.                                                                                                                                                     |
| `src/components/Admin`  | [x]    | [x]     | [ ]     | Major CRUD domains are now green in targeted serial Playwright passes, including isolated reorder coverage for services and portfolio; remaining work is mostly suite-level stability and any final code/doc polish. |
| `src/sections`          | [x]    | [x]     | [x]     | Removed the last active template email fallback from the contact section and aligned manual testing docs to the current contact-details flow.                                                                        |
| `src/server`            | [x]    | [x]     | [x]     | Settings setup diagnostics now stay inside the service layer, typed env access was expanded across bootstrap/auth/server utilities, and the top-level server folder README documents the active repo flow.           |
| `src/client-validators` | [ ]    | [ ]     | [ ]     | Check parity with server validators and actual form behavior.                                                                                                                                                        |
| `src/static-content`    | [x]    | [x]     | [x]     | Placeholder metadata and fallback demo content were neutralized, the stale unused `presentation.ts` module was removed, and launch-content review continues in the seeded DB/app surfaces.                           |
| `src/themes`            | [ ]    | [ ]     | [ ]     | Confirm theme registry behavior, preview/apply flow, and docs.                                                                                                                                                       |
| `src/types`             | [ ]    | [ ]     | [ ]     | Audit type drift between UI, APIs, Prisma, and docs.                                                                                                                                                                 |
| `src/utils` / `src/lib` | [x]    | [x]     | [x]     | Reviewed the launch-scope analytics shim, kept it as an intentional dev-only no-op for relaunch, and aligned roadmap/checklist wording so it no longer reads like accidental placeholder debt.                       |

### 5.3 Domain Audits

| Domain          | Review | Checkup | Cleanup | Notes                                                                                                                                                                            |
| --------------- | ------ | ------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Auth/Login      | [x]    | [x]     | [x]     | Live browser verification confirmed current env-backed admin credentials differ from README defaults; docs now explicitly say env truth wins.                                    |
| Dashboard       | [x]    | [x]     | [x]     | Dashboard stats and sidebar navigation tests are green after aligning selectors to the current shell.                                                                            |
| Blog            | [x]    | [x]     | [x]     | Targeted CRUD rerun is green; the public index now renders published posts only, while the final isolated suite should still keep watching the editor path.                      |
| Portfolio       | [x]    | [x]     | [x]     | Targeted Playwright coverage is green, including isolated create/publish/delete and reorder verification against a dedicated Playwright schema.                                  |
| Experience      | [x]    | [x]     | [x]     | Create/publish/edit is green in targeted Playwright, and the admin delete action was manually verified in the live browser.                                                      |
| Education       | [x]    | [x]     | [x]     | Targeted Playwright CRUD rerun is green.                                                                                                                                         |
| Services        | [x]    | [x]     | [x]     | Targeted serial Playwright CRUD and reorder verification are green against a dedicated Playwright schema.                                                                        |
| Certificates    | [x]    | [x]     | [x]     | Targeted serial Playwright CRUD rerun is green after earlier cleanup.                                                                                                            |
| Recommendations | [x]    | [x]     | [x]     | Targeted serial Playwright CRUD rerun is green; cleanup helper was hardened against transient teardown request failures.                                                         |
| Skills          | [x]    | [x]     | [x]     | Targeted serial Playwright CRUD rerun is green.                                                                                                                                  |
| Media           | [x]    | [x]     | [x]     | Upload/delete flow green after MIME and optimistic-delete fixes.                                                                                                                 |
| Contact         | [x]    | [x]     | [x]     | Contact API and admin inbox tests are green after isolating rate-limit state with unique forwarded-IP headers per spec.                                                          |
| Settings Center | [x]    | [x]     | [x]     | The active settings center now includes profile, visibility, theme, and setup surfaces; public nav/routes now consume visibility settings through the shared settings singleton. |
| Theme           | [x]    | [x]     | [ ]     | Theme preview flow is green in targeted serial verification; still review broader theme docs.                                                                                    |
| Setup/Bootstrap | [x]    | [x]     | [x]     | Supported path chosen, retired flow removed, docs updated.                                                                                                                       |
| Metadata/SEO    | [x]    | [ ]     | [ ]     | Static fallback identity placeholders were removed; canonical, OG, and seeded SEO review still remain.                                                                           |

### 5.4 Documentation Surfaces

| Area                              | Review | Checkup | Cleanup | Notes                                                                                                                                                                                 |
| --------------------------------- | ------ | ------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `README.md`                       | [x]    | [x]     | [x]     | Updated launch-facing wording so Prisma/admin CMS is treated as primary content, with static modules documented as fallback/bootstrap defaults.                                       |
| `docs/architecture/*`             | [x]    | [x]     | [x]     | The architecture set now uses `architect.md` as the intro spine, explains the full website solution in Sections 01-08, and stays aligned to the live settings/API/verification truth. |
| `docs/knowledge-base/*`           | [x]    | [x]     | [x]     | Added repo-local audit surfaces for implementation-scoped current-state findings so this repo can keep codebase-specific records without duplicating shared cross-repo architecture.  |
| `docs/release-checklist.md`       | [x]    | [x]     | [x]     | Added an active release-signoff guide that reflects the real env/bootstrap flow, safe E2E constraints, first-run checks, and manual launch verification sequence.                     |
| `.github/copilot-instructions.md` | [x]    | [x]     | [x]     | Rewritten to match the relaunch-era env/bootstrap flow, PostgreSQL-only datasource, and the current active architecture docs.                                                         |
| `.github/instructions.md`         | [x]    | [x]     | [x]     | Rewritten away from retired SQLite, old helper-doc paths, migration docs, and obsolete E2E script guidance to the active env/bootstrap and verification flow.                         |
| `docs/runbooks/*`                 | [x]    | [x]     | [x]     | No active runbooks directory remains; runbook-style historical material is archived and active operational guidance lives in architecture sections plus README.                       |
| `docs/helper_docs/*`              | [x]    | [x]     | [x]     | Re-read the helper-doc set, refreshed AGENTS startup guidance, and aligned the architecture rewrite to the local documentation, agent, Next.js, and logging standards.                |

### 5.5 Initial Audit Findings To Execute

- [x] Neutralize fallback demo portfolio/static-content exports so template sample content does not leak into launch paths.
- [x] Review and clean placeholder social/SEO fallback data in [src/static-content/metadata.ts](C:\Users\ammar\Downloads\Ammar\GitHub\TS-NextJS-PersonalPortfolio-v1-2025\src\static-content\metadata.ts).
- [x] Reconcile the full Playwright suite with the current seeded dataset and isolated test-server assumptions before using it as the launch gate.
- [x] Remove the stale SQLite fallback from Playwright bootstrap so isolated E2E startup matches the PostgreSQL Prisma datasource.
- [x] Separate isolated Playwright bootstrapping from reused live-server debugging so isolated runs default to their own port and build output.
- [x] Exclude the isolated `.next-playwright` output from ESLint so generated test-build artifacts do not fail repo linting.
- [x] Extend `npm run clean` to remove stale `.next-playwright` output so deleted routes do not keep breaking generated Next type validation files.
- [x] Remove `shell: true` from the Playwright webserver helper so isolated E2E startup is cleaner on Windows.
- [x] Expand typed env usage through the bootstrap/auth path and key server utilities so fewer active server files rely on raw `process.env`.
- [x] Remove deterministic seed IDs from skill-group seeding so repeated E2E bootstrap runs use Prisma-managed primary keys.
- [x] Remove the retired `src/app/api/setup/**` route stubs so the active server surface matches the supported onboarding flow.
- [x] Rewrite `.github/copilot-instructions.md` so contributors start from the supported relaunch-era workflow instead of retired setup guidance.
- [x] Remove the unused `src/static-content/presentation.ts` module and the last active `/contact` CTA drift from `.env.example`.
- [x] Replace the remaining raw internal portfolio anchors on public pages with Next.js `Link` components.
- [x] Review analytics TODOs in [src/utils/analytics.ts](C:\Users\ammar\Downloads\Ammar\GitHub\TS-NextJS-PersonalPortfolio-v1-2025\src\utils\analytics.ts) and decide launch scope.
- [x] Clean the first stale-wording pass in [README.md](C:\Users\ammar\Downloads\Ammar\GitHub\TS-NextJS-PersonalPortfolio-v1-2025\README.md) discovered during the audit pass.
- [x] Add short `README.md` files to the active top-level source/test folders so structure and local rules are discoverable while relaunch cleanup continues.
- [x] Rewrite stale active contributor instructions in `.github/instructions.md` and scrub migration-plan-era references from active architecture sections.
- [x] Add an active release checklist that reflects the supported PostgreSQL/env/bootstrap flow and the need to isolate E2E from launch data.

---

## 6. Open Risks

- [ ] Public release quality still depends on an explicit content and metadata review.
- [ ] Broader manual verification is still needed even though the isolated automated gate is green.
- [ ] Final launch-content review still needs a dedicated pass before release signoff.

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

| Version | Date       | Author         | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ------- | ---------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2.4.0   | 2026-05-07 | GitHub Copilot | Corrected stale typecheck/E2E completion claims, recorded the active settings-center documentation pass, marked the helper-doc surfaces reviewed, and aligned the checklist to the rewritten architecture set plus the current verification truth.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| 2.3.9   | 2026-04-20 | GitHub Copilot | Marked portfolio and services reorder verification complete after adding targeted isolated Playwright coverage for both admin reorder flows and rerunning those specs against a dedicated Playwright schema.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| 2.3.8   | 2026-04-20 | GitHub Copilot | Marked the seeding and owner-data workflow documentation item complete after adding the active release guide and the local-data safety notes for `db:seed`, `seed:ammar`, and isolated Playwright verification.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| 2.3.7   | 2026-04-20 | GitHub Copilot | Added an active release checklist, expanded the checklist to track dedicated-E2E-database safety, and marked the critical env-validation hardening item complete after tightening required runtime config validation.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 2.3.6   | 2026-04-20 | GitHub Copilot | Removed the repo-local logs idea from the active documentation structure, kept the repo-local knowledge-base surface, and realigned the checklist to the final repo-scoped audit approach.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| 2.3.5   | 2026-04-20 | GitHub Copilot | Added repo-local `docs/knowledge-base/` and `docs/logs/` surfaces for implementation-scoped audits and work-history records, and aligned the checklist to the new documentation structure.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| 2.3.4   | 2026-04-20 | Codex          | Completed an active-docs truth pass, rewrote stale `.github/instructions.md` guidance, removed migration-plan-era claims from architecture sections, clarified Settings/theme/contact/media behavior, and updated the checklist so documentation surfaces no longer overstate readiness outside archived history.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| 2.3.3   | 2026-04-19 | Codex          | Audited API and public surfaces, normalized inconsistent item not-found responses, corrected API docs to the actual route tree, moved public portfolio cards into reusable components, added a portfolio empty state, removed the active contact email fallback, and aligned README/manual testing docs to the current Prisma-first public content flow.                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| 2.3.2   | 2026-04-19 | GitHub Copilot | Reworked the architecture docs to follow the helper-doc intro-plus-sections model, moved manual testing into a dedicated numbered section, added section navigation links, and aligned the checklist notes to the current documentation structure.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| 2.3.1   | 2026-04-18 | GitHub Copilot | Consolidated the active architecture overview into `docs/architecture/architect.md`, added a repo-grounded manual testing guide, replaced stale split-doc references, and updated the checklist to reflect the green isolated Playwright gate and the remaining manual launch-review work.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| 2.3.0   | 2026-04-18 | GitHub Copilot | Removed the retired `src/app/api/setup/**` stubs, rewrote the stale contributor instructions, aligned the home/contact/login route docs to the current app behavior, corrected README credential wording around the `ADMIN_*` bootstrap flow, fixed the public blog index to render published posts only, removed the unused `src/static-content/presentation.ts` module plus the last active `/contact` CTA drift, replaced remaining raw internal portfolio anchors with Next.js `Link`, formalized the launch-scope analytics shim as an intentional dev-only no-op, normalized the public services empty state and docs to the current active-service model, extended `npm run clean` to purge stale `.next-playwright` output, and reframed the checklist around the current docs-truth-plus-low-risk-cleanup phase. |
| 2.2.9   | 2026-03-26 | Codex          | Expanded typed env usage through bootstrap, auth, Prisma, dashboard, and server utility paths, updated the example API route to reflect its real readiness-probe role, and verified the affected unit/lint/typecheck slices.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| 2.2.8   | 2026-03-26 | Codex          | Removed `shell: true` from the Playwright webserver helper to eliminate the remaining Windows startup warning from the isolated E2E path.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| 2.2.7   | 2026-03-26 | Codex          | Excluded `.next-playwright` generated output from ESLint and kept the launch checklist aligned with the isolated Playwright build path.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| 2.2.6   | 2026-03-26 | Codex          | Split Playwright into isolated-vs-reused server defaults, added a dedicated isolated base URL/port path, and documented the new E2E bootstrap behavior in the active docs.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| 2.2.5   | 2026-03-26 | Codex          | Removed the stale SQLite fallback from Playwright bootstrap, aligned `.env.example` and README to the PostgreSQL-only E2E datasource requirement, and kept API/testing notes in sync.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 2.2.4   | 2026-03-26 | Codex          | Added top-level folder READMEs across the active source/test tree, fixed the admin setup page to route through `SettingsService`, and corrected architecture/testing docs to match the current repo flow and Playwright strategy.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| 2.2.3   | 2026-03-26 | Codex          | Marked the certificates, education, services, recommendations, settings/theme, and skills slices green in targeted serial Playwright verification and corrected README architecture wording that still described active layers as empty or static-only.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| 2.2.2   | 2026-03-25 | Codex          | Added env-truth attribution guidance to AGENTS, stabilized the contact E2E slice by isolating rate-limit keys per test, and marked auth/contact verification progress in the checklist.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| 2.2.1   | 2026-03-25 | Codex          | Aligned public-navigation and admin-dashboard E2E assertions to the current app shell and hero content, and updated README/checklist notes for env-backed credentials and reused-server caveats.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| 2.2.0   | 2026-03-25 | Codex          | Cleared the targeted experience verification gap, manually confirmed the admin delete action, and recorded that remaining E2E work is now centered on full-suite isolation and stale test assumptions rather than the product delete flow.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| 2.1.9   | 2026-03-25 | Codex          | Verified most targeted CRUD Playwright reruns as green, aligned portfolio expectations to the current seeded empty state, and narrowed the remaining admin verification gap to the experience delete path.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| 2.1.8   | 2026-03-25 | Codex          | Recorded the E2E seed-bootstrap bug, marked certificates green on targeted rerun, and tracked the seeding fix needed for stable repeated Playwright startup.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| 2.1.7   | 2026-03-25 | Codex          | Cleaned the static fallback content layer by removing placeholder metadata identities, neutralizing demo portfolio fallbacks, and clearing sample certificate/recommendation records.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 2.1.6   | 2026-03-24 | Codex          | Added a folder/domain review-checkup-cleanup matrix to drive repo-wide audits and recorded the first concrete audit findings for launch cleanup.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| 2.1.5   | 2026-03-24 | Codex          | Completed the first-run documentation truth pass, corrected README and infrastructure docs, reran Playwright, and recorded the current 12/19 E2E pass state.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| 2.1.4   | 2026-03-24 | Codex          | Removed the legacy setup UI/server subsystem, kept a minimal `/setup` redirect path for backwards compatibility, and re-verified lint, typecheck, and production build.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| 2.1.3   | 2026-03-24 | Codex          | Finished the active lint cleanup pass, including admin managers, media rendering, and test helper cleanup, with lint and typecheck both green.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| 2.1.2   | 2026-03-24 | Codex          | Started the repo-wide cleanup phase, added cleanup standards to AGENTS.md, and reduced the active lint warning count during the first cleanup pass.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| 2.1.1   | 2026-03-24 | Codex          | Chose env/bootstrap-only onboarding, removed broken setup script references, and updated active docs to reflect the supported launch path.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| 2.1.0   | 2026-03-24 | Codex          | Reframed the checklist around the actual remaining launch work, grouped by must/should/post-launch priority.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| 2.0.1   | 2026-03-24 | Codex          | Installed dependencies, verified typecheck/tests/build, fixed the lint script, and recorded remaining warning/format debt.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| 2.0.0   | 2026-03-24 | Codex          | Replaced the previous completion-focused checklist with a relaunch execution checklist based on current code inspection.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |

---

[« Previous](08-testing-and-quality.md) | [Next »](10-manual-testing-guidelines.md)
