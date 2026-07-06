# 8. Testing & Quality

## 8.1 Test Surfaces

The repo uses multiple verification layers:

1. **TypeScript typecheck:** `npm run typecheck`
2. **Linting:** `npm run lint`
3. **Unit tests:** `npm run test`
4. **Production build:** `npm run build`
5. **E2E tests:** `npm run e2e`

Vitest and Playwright are active parts of the real verification surface, not placeholders.

## 8.2 Current Verification Snapshot

Current known state in this documentation pass:

| Check               | Status                                      | Notes                                                                                      |
| ------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `npm run test`      | Pass                                        | Verified in the current working pass.                                                      |
| `npm run build`     | Pass                                        | Verified in the current working pass.                                                      |
| `npm run typecheck` | Failing                                     | Current failure is due Playwright spec typing drift in `tests/e2e/admin-*.spec.ts` slices. |
| `npm run lint`      | Not re-verified in this pass                | Still required before release claims.                                                      |
| `npm run e2e`       | Not re-verified as fully green in this pass | Isolated seeded Playwright remains the required release gate.                              |

Do not summarize the repo as fully green while the typecheck row remains failing.

## 8.3 Test Pyramid

1. **Unit tests:** services, serializers, validators, and utility helpers.
2. **Integration-style coverage:** route-handler/service/repository cooperation where needed.
3. **E2E coverage:** admin login, CRUD flows, reorder flows, media/contact behavior, and public critical paths.

## 8.4 Playwright Strategy

- Playwright uses an isolated seeded web-server flow by default.
- The isolated server should use its own port so it can coexist with a standard local dev server.
- The isolated DB should use `PLAYWRIGHT_DATABASE_URL` when possible to avoid mutating shared launch data.
- Reusing a live local server is useful for debugging but is not the authoritative release gate.

## 8.5 Quality Gates

- `typecheck`, `lint`, `test`, `build`, and isolated `e2e` must all pass before release signoff.
- Use targeted reruns for debugging, but do not confuse targeted slices with repo-wide signoff.
- Update this section and Section 09 when the verification baseline materially changes.

## 8.6 Open Quality Work

- Fix the current Playwright-related type errors so repo-wide typecheck is green again.
- Re-run lint and the isolated Playwright suite against the current codebase.
- Complete metadata, SEO, and manual launch review once automated gates are stable.

---
[« Previous](07-security-and-compliance.md) | [Next »](09-implementation-checklist.md)
