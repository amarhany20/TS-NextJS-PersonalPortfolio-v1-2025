# 8. Testing & Quality

## 8.1 Current Coverage
- TypeScript compilation, linting, unit tests, and production builds pass in the current relaunch
  cycle.
- Vitest and Playwright are active dependencies in the repo and are part of the real verification
  surface, not placeholders.
- Playwright uses an isolated seeded web-server flow by default; reusing an already-running local dev
  server is useful for debugging but can produce environment-specific noise and should not be treated
  as the authoritative launch gate.
- The isolated Playwright bootstrap must use `PLAYWRIGHT_DATABASE_URL` or `DATABASE_URL` with a
  PostgreSQL-compatible connection string, because the Prisma datasource does not support the older
  SQLite fallback.
- The isolated Playwright server should run on its own port (default `3100`) so it can coexist with a
  normal local dev server on `3000` when needed.

## 8.2 Test Pyramid
1. **Unit tests (Vitest):** Focus on services, serializers, validators, and utility helpers. Mock
   Prisma repositories with in-memory adapters.
2. **Integration tests:** Validate route-handler, service, and serializer cooperation where unit
   coverage alone is not enough.
3. **E2E tests (Playwright):** Cover admin login, CRUD/reorder flows, and public happy paths such as
   navigation and contact submission.

## 8.3 Quality Gates
- `npm run lint` + `npm run typecheck` (tsc) must pass before merging.
- `npm run test` (Vitest) and `npm run e2e` (Playwright) are part of launch verification.
- Use targeted or serial Playwright reruns for debugging, but treat the isolated seeded suite as the
  real release signal.
- Production builds are verified via `npm run build`; document meaningful regressions in the active
  architecture docs and checklist.

## 8.4 Open Quality Items
- Reconcile the full Playwright suite with the current seeded dataset so the isolated run becomes a
  fully green release gate.
- Review metadata/SEO and analytics behavior after the remaining launch-critical flow fixes are done.
- Establish CI automation for lint, typecheck, unit tests, build, and E2E once the relaunch suite is
  stable.
