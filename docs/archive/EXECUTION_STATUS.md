# Execution Status — Relaunch Snapshot

**Last Updated:** 2026-03-24
**Overall Status:** Relaunch In Progress

---

## Summary

The project is not currently treated as launch-verified.

The repo contains substantial implementation work across public pages, admin CMS flows, APIs,
Prisma models, serializers, repositories, services, and test scaffolding. However, the current
documentation overstates completion and several important flows are either incomplete, disabled, or
not yet re-verified in the present workspace.

---

## Verified Today

- `src/app/**` contains public, admin, API, login, and setup-related routes.
- `src/server/**` contains repositories, services, serializers, security, validators, and utilities.
- `prisma/schema.prisma` is configured for PostgreSQL.
- `package.json` includes dev/build/test/seed/setup scripts.
- `scripts/setup/**` is referenced by scripts but missing from the repo.
- `/api/setup/**` route handlers currently return a removed/disabled response.
- `/setup` currently redirects to `/home`.
- setup UI components still exist, which means setup behavior is currently split between retained UI
  code and disabled API/runtime paths.
- `npm install` completed successfully.
- `npm run typecheck` passed.
- `npm run test` passed.
- `npm run build` passed.
- lint tooling was repaired by replacing `next lint` with ESLint CLI and ignoring build output.
- `npm run lint` now completes with warnings but no errors.

---

## Current Blockers

1. Documentation drift
   Multiple docs still claim the app is 100% complete and production-ready without current-session
   verification.
2. Setup flow ambiguity
   Setup UI, setup services, env bootstrap, and disabled setup APIs do not form one clearly
   supported onboarding path.
3. Missing setup scripts
   `npm run setup:first-run` and `npm run setup:first-run:ps` point to files that are not present.
4. Verification not yet runnable in this workspace
   verification now runs, but e2e has not been rechecked and formatting still fails across many
   files.
5. Remaining code quality debt
   lint warnings remain in setup/admin/test code and `npm run format:check` reports a large
   formatting backlog.

---

## Relaunch Priorities

1. Reset docs to current truth.
2. Install dependencies and run real verification.
3. Decide the supported first-run/setup path.
4. Fix launch blockers found by verification.
5. Finalize launch-readiness checklist and release narrative.

Architecture entrypoint:
- `docs/architecture/README.md`

---

## Immediate Commands

```bash
npm install
npm run typecheck
npm run lint
npm run test
npm run build
```

Use `npm run e2e` after the local environment, database, and seed data are working again.
