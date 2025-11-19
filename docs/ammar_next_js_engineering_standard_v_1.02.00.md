# Ammar Next.js Engineering Standard

**Version:** 1.02.00\
**Owner:** Ammar\
**Scope:** Rules, folder layout, and conventions for all Next.js projects using the App Router, TypeScript, and Tailwind CSS under the `src/` layout.

> This document is the single source of truth. When in doubt, follow these rules over examples you find online.

---

## Table of Contents

1. [Tech Baseline](#1-tech-baseline)
2. [Folder Layout (under ](#2-folder-layout-under-src)[`src/`](#2-folder-layout-under-src)[)](#2-folder-layout-under-src)
3. [Pages, Sections, Components](#3-pages-sections-components)
4. [Styling and Design Tokens](#4-styling-and-design-tokens)
5. [Data, Types, and Validation](#5-data-types-and-validation)
6. [Server Architecture](#6-server-architecture)
   - [6.1 Controllers (Route Handlers)](#61-controllers-route-handlers)
   - [6.2 Services](#62-services)
   - [6.3 Repositories](#63-repositories)
   - [6.4 Helper Placement](#64-helper-placement)
   - [6.5 Prisma](#65-prisma)
   - [6.6 Server Utilities and Serializers](#66-server-utilities-and-serializers)
7. [API Policy (Validators + Serializers)](#7-api-policy-validators--serializers)
8. [Client vs Server Components](#8-client-vs-server-components)
9. [Data Fetching and Caching](#9-data-fetching-and-caching)
10. [Accessibility](#10-accessibility)
11. [Security Hardening](#11-security-hardening)
12. [Logging and Observability](#12-logging-and-observability)
13. [Testing Strategy](#13-testing-strategy)
14. [CI/CD](#14-cicd)
15. [Routing, Metadata, and SEO](#15-routing-metadata-and-seo)
16. [Performance](#16-performance)
17. [Code Style and Preamble](#17-code-style-and-preamble)
18. [PR Checklist](#18-pr-checklist)
19. [Docs and Architecture Notes](#19-docs-and-architecture-notes)
20. [Future Extensions](#20-future-extensions)
21. [Quick Commands (scripts)](#21-quick-commands-scripts)
22. [Environment Variables (](#22-environment-variables-envexample)[`.env.example`](#22-environment-variables-envexample)[)](#22-environment-variables-envexample)
23. [Glossary](#23-glossary)
24. [Decision Guides](#24-decision-guides)
25. [Release Notes (v1.02.00)](#25-release-notes-v10200)

---

## 0) Principles

- Server first. Ship work that is simple, typed, and observable.
- Consistency over cleverness. Prefer documented patterns to ad hoc code.
- Inputs validated at the boundary. Outputs are explicit and minimal.
- Pages compose sections. Sections compose components. Components are reusable.
- No hidden state. Side effects are isolated and logged.

---

## 1) Tech Baseline

- **Next.js:** latest stable (App Router)
- **TypeScript:** `strict: true`
- **Runtime:** Node LTS (set `engines.node` in `package.json`)
- **Styling:** Tailwind CSS + CSS Variables (tokens) in `globals.css`
- **Package Manager:** npm (lockfile committed)
- **Lint/Format:** ESLint (Next + Tailwind), Prettier
- **Testing:** Vitest (unit) + Playwright (e2e)
- **DB (optional):** Prisma + Postgres (or adapter as needed)
- **CI:** GitHub Actions for typecheck, lint, test, build

> Keep a short `README.md` in the repo root with setup steps.

---

## 2) Folder Layout (under `src/`)

```
src/
  app/                          # App Router (routes, layouts, metadata)
    (marketing)/                # Optional route group(s) for organization
    layout.tsx                  # Root layout (RSC)
    page.tsx                    # Top-level page that composes sections only
    api/                        # Route handlers (HTTP controllers)
      v1/
        users/route.ts          # Example endpoint path (no business logic here)
    not-found.tsx               # 404 page
    error.tsx                   # Error boundary

  sections/                     # Page sections (UI + page-local orchestration)
    home/
      Hero/
      Features/
      index.ts                  # Barrel to export the page sections

  components/                   # Reusable UI building blocks
    ui/                         # Low-level primitives (buttons, inputs)
    shared/                     # Cross-page composites (NavBar, Footer)
    forms/
    data/                       # Data display components (Tables, Charts)
    index.ts

  static-content/               # Page-specific copy and configuration
    home.ts
    about.ts
    routes.ts                   # Route constants
    seo.ts                      # Default SEO metadata

  client-validators/            # Client-side Zod schemas (UX-only validation)
    forms/

  server/                       # Server-side application layer
    http/                       # HTTP helpers used by route handlers
      errors.ts                 # Error base classes and mapping table
      responses.ts              # Small helpers to format JSON + status
    services/                   # Business logic and use-cases
    repositories/               # DB queries (Prisma) and external API calls
    db/
      prisma.ts                 # Prisma client singleton
    security/                   # Auth and security helpers
      jwt.ts                    # JWT sign/verify, claims shaping
      crypto.ts                 # Hashing, random, key mgmt wrappers
    server-validators/          # Zod schemas for API and env validation
      api/                      # Request/response validation schemas
      env.ts                    # Environment variable validation
    serializers/                # Response mappers + server-only DTO interfaces
    server-utils/               # Node-only cross-cutting helpers (FS, tz, streams)
    integrations/               # Third-party API SDK wrappers
    cache/                      # Caching abstractions (Redis, etc.)
    jobs/                       # Cron and background jobs (when applicable)
    events/                     # Domain events (publish/subscribe) if used

  hooks/                        # Reusable React hooks
  lib/                          # Framework-level helpers (RSC-safe)
  utils/                        # Pure isomorphic utilities (no React, no Node-only deps)

  styles/
    globals.css                 # Tokens, base layer, @apply utilities
    prose.css                   # Typography overrides (optional)

  docs/                         # Project-local documentation
  types/                        # Frontend-only types (UI/view models)

prisma/
  schema.prisma
  migrations/
```

> **Non-negotiable rule:** `app/**/page.tsx` contains composition only. No inline copy. No heavy data logic. No network calls in pages. Fetch in a server boundary above and pass props down.

---

## 3) Pages, Sections, Components

- **Pages** compose **sections** only. They do not import content or run effects.
- **Sections** may read static content and compose components. Keep effects minimal.
- **Components** are reusable. No page-specific copy or assumptions.

Content lives in `static-content/*`. Refer to images in `public/` via `/images/...`.

---

## 4) Styling and Design Tokens

- Tokens live in `styles/globals.css` under `:root` and `:root[data-theme="dark"]`.
- Use Tailwind utilities. Extract repeated class lists into component-scoped classes with `@apply` when it removes duplication.
- Avoid inline styles except when dynamic and unavoidable.

---

## 5) Data, Types, and Validation

- **Frontend-only types:** `src/types/*` are for UI models, component props, and client utilities. **Do not import these in the server.**
- **Server types:** use **Prisma** types internally in services/repos and \*\*DTO interfaces in \*\*`` for anything that crosses the HTTP boundary. Do not leak raw Prisma models over the wire.
- **Validation:**
  - Client: `client-validators/*` for UX hints only.
  - Server: `server/server-validators/*` is authoritative. All inputs are parsed here.
  - The server always re-validates, even if the client validated.

---

## 6) Server Architecture

### 6.1 Controllers (Route Handlers)

- Live under `src/app/api/**/route.ts`.
- Responsibilities: parse inputs, call a service, call a serializer, map result to an HTTP response.
- They never contain business rules or DB queries.

### 6.2 Services

- Live under `src/server/services/*`.
- Orchestrate use-cases and enforce invariants.
- Depend on repositories and helpers, not the web framework.

### 6.3 Repositories

- Live under `src/server/repositories/*`.
- Contain all DB queries and third party API calls.
- Return plain objects, not ORM instances.

### 6.4 Helper Placement

- **HTTP helpers:** `server/http/*` for response formatters and error mapping.
- **Security helpers:** `server/security/*` for JWT, crypto, CSRF, session utilities.
- **Integrations:** `server/integrations/*` for external SDK wrappers.
- **Cache:** `server/cache/*` for Redis or in-memory caching adapters.
- **Jobs:** `server/jobs/*` for scheduled tasks.
- **Events:** `server/events/*` for publish/subscribe domain events when useful.

### 6.5 Prisma

- `server/db/prisma.ts` exports a singleton client.
- Never import `@prisma/client` in client code.
- Always `select` only the fields you intend to expose.

### 6.6 Server Utilities and Serializers

- `` — Node-only, cross-cutting helpers that do not belong to a specific concern folder (FS helpers, random bytes, Node streams, date/tz using Node libs). Prefer concern folders first; use this only when truly cross-cutting.
- `` — Server-only response mappers and DTO interfaces that define transport shapes (response objects) for route handlers and external integrations. These are not domain entities. Always map service/domain output to these DTOs before responding.

---

## 7) API Policy (Validators + Serializers)

- Controllers validate with Zod → call a service → call a serializer from `server/serializers/*` → return via `server/http/responses.ts`.
- Do not return raw ORM/DB models. Always serialize to explicit DTOs.
- Use a consistent response envelope:
  - **Success:** `{ "success": true, "data": <payload>, "meta": <optional> }`
  - **Error:** `{ "success": false, "error": { "code": "string", "message": "human readable", "details": <optional> } }`
- Map domain errors to HTTP codes in one place (`server/http/errors.ts`). Controllers do not hand craft error payloads.

---

## 8) Client vs Server Components

- Default to Server Components. Add `"use client"` only when state, effects, refs, or browser APIs are required.
- Heavy fetches and transformations run on the server. Pass serialized props down.

---

## 9) Data Fetching and Caching

- Prefer RSC `fetch` with Next caching semantics. Use `revalidate` for ISR.
- Use `server/cache/*` when an external cache is present.
- For mutations, use Route Handlers or Server Actions. Pick one per feature and document the choice.

---

## 10) Accessibility

- Semantic HTML, labeled inputs, keyboard navigation, focus states.
- Color contrast meets WCAG AA or better.

---

## 11) Security Hardening

- Validate every input at the boundary with Zod.
- Use HTTP only secure cookies for tokens. Do not store secrets in localStorage.
- Keep all secrets server only. Only expose `NEXT_PUBLIC_*` as needed.
- Escape or sanitize any HTML content before rendering.
- Keep JWT helpers in `server/security/jwt.ts` with clear claims and expirations.

---

## 12) Logging and Observability

- Server: pino or console in dev.
- Error tracking: Sentry optional with source maps in CI.
- Log domain errors in services. Controllers log request context when helpful.

---

## 13) Testing Strategy

- **Unit (Vitest):** utils, small services, repositories.
- **Component (Vitest + RTL):** components and sections.
- **e2e (Playwright):** critical flows, SEO checks, redirects.
- Snapshots are allowed only for stable UI.

Keep factories or fixtures under `tests/fixtures/*`.

---

## 14) CI/CD

- GitHub Actions: install → typecheck → lint → test → build.
- Block merges on failing checks.
- Preview deployments for PRs.

---

## 15) Routing, Metadata, and SEO

- Use Route Groups `(…)` to organize without changing the URL.
- Keep shared metadata in `static-content/seo.ts`.
- Use `generateMetadata` per page when dynamic.

---

## 16) Performance

- Use `next/image`, `next/font`, and measure Web Vitals.
- Track budgets in `docs/perf.md` and keep regressions visible in CI.

---

## 17) Code Style and Preamble

- Every file starts with a short preamble comment indicating purpose and touchpoints.
- Rely on Git history and `package.json` version for releases.

---

## 18) PR Checklist

- Scope clear and linked to issue.
- Tests updated or added.
- Zod schemas and serializers updated.
- Security checks reviewed (inputs, secrets, cookies).
- Accessibility checked for new UI.
- Docs updated in `docs/*`.

---

## 19) Docs and Architecture Notes

- Each top level folder has a short `README.md` describing purpose and rules.
- Keep architecture decisions in `docs/architecture.md` with ADR style entries.
- Maintain `docs/CHANGELOG.md` or use Changesets.

---

## 20) Future Extensions

- Internationalization (i18n) strategy
- Feature flags
- Storybook for components
- Background job runner standardization

---

## 21) Quick Commands (scripts)

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "typecheck": "tsc --noEmit",
    "lint": "eslint .",
    "lint:fix": "eslint --fix .",
    "format": "prettier --write .",
    "test": "vitest run",
    "test:watch": "vitest",
    "e2e": "playwright test",
    "check": "npm run typecheck && npm run lint && npm run test",

    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "db:push": "prisma db push"
  }
}
```

---

## 22) Environment Variables (`.env.example`)

```
# App
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/app

# Auth
JWT_SECRET=replace_me
SESSION_COOKIE_NAME=app_session
SESSION_COOKIE_SECURE=true

# Third-party
SENTRY_DSN=

# Feature flags
FEATURE_X=false
```

> Keep `server/server-validators/env.ts` as the single parser of process env. Never import env directly in client code.

---

## 23) Glossary

- **Controller:** HTTP boundary in `app/api/**` that turns requests into responses.
- **Service:** Business logic that enforces rules. No HTTP concerns.
- **Repository:** Data access to DB and external APIs.
- **Serializer:** Pure function that converts service/domain output to a transport DTO. Lives in `server/serializers/*`.
- **Server utils:** Node-only helpers that do not belong to a specific concern. Lives in `server/server-utils/*`.

---

## 24) Decision Guides

**Where does a new function go?**

- Uses React hooks or lifecycle → `hooks/`.
- Pure logic with no framework or Node deps → `utils/` (isomorphic; may be used by client).
- Framework or RSC-safe helper → `lib/`.
- JWT, crypto, auth helpers → `server/security/`.
- Response shaping or error mapping → `server/http/`.
- Server-only cross-cutting helper → `server/server-utils/`.
- API response serializers (+ DTO interfaces) → `server/serializers/`.
- Calls an external API → `server/integrations/`.
- DB query → `server/repositories/`.
- Business rule that coordinates multiple repos → `server/services/`.
- Frontend view-only types → `types/` (client only; never import in server).

**Server Actions or Route Handlers?**

- Internal UI only and you want fewer hops → Server Actions.
- External consumers or clear API boundary → Route Handlers.

---

