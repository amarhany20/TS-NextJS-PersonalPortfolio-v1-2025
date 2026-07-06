# Ammar Next.js Engineering Standard

**Version:** 5.00.04
**Created:** 2023-06-01
**Last Updated:** 2026-04-29
**Maintainer:** Ammar Hany
**Status:** Active
**Applies To:** Ammar-led Next.js App Router projects with TypeScript, Tailwind, and `src/` layout
**Tags:** [Next.js, Standards, App Router, Concise]

---

## Overview

Single source for Next.js implementation standards.
Frontend layer: simple, typed, observable, aligned with repo docs.
Owns: Next.js-specific implementation, structure, routing, data flow, security, testing, release detail.
Shared architecture and knowledge base stay in central docs repo.

---

## 1. Core Rules

- Server first.
- Consistency over cleverness.
- Validate inputs at the boundary.
- Pages compose sections. Sections compose components. Components stay reusable.
- Keep hidden state and side effects out of UI composition code.
- Keep this guideline, local docs, and the actual code in sync in the same working cycle.

---

## 2. Tech Baseline

- Next.js App Router on the latest stable baseline.
- TypeScript with `strict: true`.
- Node LTS with `engines.node` set.
- Tailwind CSS plus CSS-variable tokens in `styles/globals.css`.
- npm with committed lockfile.
- ESLint plus Prettier.
- Vitest for unit and component tests; Playwright for e2e.
- Prisma plus Postgres when a relational DB is used.
- GitHub Actions for typecheck, lint, test, and build.

---

## 3. Structure And Composition

### Expected Layout

- `src/app/`: routes, layouts, metadata, route handlers.
- `src/sections/`: page sections.
- `src/components/`: reusable UI.
- `src/static-content/`: copy, route constants, shared SEO config.
- `src/client-validators/`: UX-only schemas.
- `src/server/`: controllers, services, repositories, security, validators, serializers, integrations.
- `src/hooks/`, `src/lib/`, `src/utils/`, `src/types/`: reusable support code.
- `prisma/`: schema and migrations when Prisma is used.

### Non-Negotiables

- `app/**/page.tsx` contains composition only.
- No inline copy, heavy fetches, or business logic in pages.
- Content belongs in `static-content/*`.
- Route groups organize files without changing URLs.
- Use route-group layouts for shared shells and permission boundaries.

---

## 4. Styling, Types, And Validation

### Styling

- Keep design tokens in `styles/globals.css`.
- Prefer Tailwind utilities.
- Extract repeated class lists with `@apply` only when it removes duplication.
- Avoid inline styles except for unavoidable dynamic values.

### Types

- UI types live under `types/*`.
- Server DTOs and domain output types stay on the server side.
- Shared types should stay narrow: enums, constants, simple contracts.

### Validation

- Client validation is UX only.
- API boundary validation is required.
- Business rules belong in services.
- Validate environment variables once in `server/server-validators/env.ts`.

---

## 5. Server Architecture And API Design

### Layering

`Route Handler → Controller → Service → Repository`

- Route handlers: HTTP concerns only.
- Controllers: parse, validate, call services, serialize, return.
- Services: business logic and invariants.
- Repositories: database and external API access.
- Serializers: shape transport output.

### API Rules

- Resource-based versioned URLs: `/api/v1/...`
- Correct HTTP method for action.
- Explicit response envelopes: success `{success, data, ?meta}`; failure `{success, error}`.
- Explicit application error classes for validation, auth, forbidden, not-found, conflict cases.
- Paginate lists with bounded page-size defaults.

### Prisma Rules

- Singleton client.
- Explicit `select` fields.
- Never return sensitive fields by default.
- Use migrations intentionally in dev and deploy flows.

---

## 6. Client And Server Boundaries

- Default to Server Components.
- Add `"use client"` only when state, effects, refs, or browser APIs are required.
- Run heavy fetches and transformations on the server.
- Pass serialized props down.
- Put Node-only helpers in `server/server-utils/*`; keep `utils/*` isomorphic.

---

## 7. Data Fetching, Routing, And SEO

- Prefer server-side `fetch` with Next caching.
- Use `revalidate` for ISR when freshness is time-based.
- Pick one mutation style per feature: Route Handlers or Server Actions.
- Use middleware for early auth redirects, maintenance mode, security headers, and rate limiting.
- Use defense in depth for protected areas:
	1. middleware
	2. layout guard
	3. route or action permission check
- Keep shared metadata in `static-content/seo.ts`.
- Use `generateMetadata` when page metadata is dynamic.

---

## 8. Security

- Session auth for most server-rendered apps. JWT only if system shape requires stateless tokens.
- RBAC authorization with explicit permission checks.
- Hash passwords with bcrypt.
- HttpOnly, Secure, SameSite cookies for sessions.
- Validate all input at server boundary.
- CSRF protection for state-changing ops when needed.
- Rate limit auth and public APIs.
- Security headers. Never expose secrets to client.
- HTTPS in production.

---

## 9. Logging, Testing, And Delivery

### Logging

- Log domain failures in services.
- Log request context in controllers when it helps debugging.
- Use high-signal logs and optional error tracking such as Sentry.

### Testing

- Unit test utilities, small services, repositories.
- Component test reusable components and sections.
- Playwright for critical e2e flows, redirects, SEO.
- Snapshots only for stable UI.
- Fixtures under `tests/fixtures/*`.

### CI/CD

- Run install -> typecheck -> lint -> test -> build in CI.
- Block merges on failing checks.
- Use preview deployments for PRs where available.
- Run `prisma migrate deploy` before production traffic flips.

---

## 10. Accessibility, Performance, And Internal Docs

### Accessibility

- Use semantic HTML.
- Label inputs clearly.
- Keep keyboard navigation and focus states intact.
- Meet WCAG AA contrast or better.

### Performance

- Use `next/image` and `next/font`.
- Measure Web Vitals.
- Track budgets and regressions in `docs/perf.md`.

### Internal Docs & Style

- Start files with short preamble comment stating purpose and touchpoints when repo uses that pattern.
- README.md at important top-level folders when needed.
- `docs/architecture.md` for architecture notes.
- `docs/api.md` for API contracts.
- `docs/CHANGELOG.md` or Changesets for notable repo changes.

---

## 11. Environment, Scripts, And Quick Decisions

### Environment

- Keep `.env.example` current.
- Parse env once in `server/server-validators/env.ts`.
- Never import process env directly in client code.

### Script Baseline

- `dev`, `build`, `start`
- `typecheck`, `lint`, `format`
- `test`, `e2e`
- Prisma scripts when Prisma is used

### Quick Decisions

- **Route Handler vs Server Action:** Route Handlers by default; Server Actions for narrow internal UI mutations.
- **Session vs JWT:** Session by default; JWT only when the system shape requires it.
- **SQLite vs Postgres:** SQLite for local prototyping, Postgres for production.
- **Middleware vs Layout Protection:** use both when protecting important routes.
- **Future extensions:** i18n, feature flags, Storybook, background jobs, WebSocket support, multi-tenancy.

---

