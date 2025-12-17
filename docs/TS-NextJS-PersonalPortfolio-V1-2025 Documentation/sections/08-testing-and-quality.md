# 8. Testing & Quality

## 8.1 Current Coverage
- TypeScript compilation and production builds pass (validated during architecture revamp v00.50.06).
- Vitest and Playwright configs exist (`vitest.config.ts`, `tests/e2e/`) but dependencies are optional
  until tests are authored; install via `npm i -D vitest @playwright/test` when needed.
- Linting uses the project-level ESLint flat config (`eslint.config.mjs`) and is expected to run on
  every commit/CI cycle.

## 8.2 Test Pyramid
1. **Unit tests (Vitest):** Focus on services, serializers, validators, and utility helpers. Mock
   Prisma repositories with in-memory adapters.
2. **Integration tests:** Hit Next.js route handlers via `next-test-api-route-handler` or Vitest
   `fetch` mocks to validate full controller/service orchestration.
3. **E2E tests (Playwright):** Cover admin smoke flows (login, CRUD, reorder) and public happy paths
   (portfolio listing/detail, contact form). Phase 4 calls out Playwright coverage for admin flows as
   a deliverable.

## 8.3 Quality Gates
- `npm run lint` + `npm run typecheck` (tsc) must pass before merging.
- `npm run test` (Vitest) and `npm run test:e2e` (Playwright) run on demand or in CI. Add
  `--runInBand` toggles for resource-constrained runners.
- Production builds verified via `npm run build`; Next.js should generate 48+ static pages without
  warnings. Document any regressions in `docs/CHANGELOG.md` and this section.

## 8.4 Open Quality Items
- Write parity tests comparing `static-content` exports to service responses (Phase 1 checklist).
- Automate KPI surfacing on the admin dashboard once repositories feed StatsService (Phase 4 task).
- Establish GitHub Actions workflow (Phase 7) for typecheck, lint, test, build, and preview deploys.
