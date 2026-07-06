# 2. Architecture Layers

## 2.1 Active Layering Model

The dominant runtime flow in this repo is:

```text
Page or Route Handler
  -> Service
  -> Repository
  -> Serializer / Response Helper
  -> Prisma Client
  -> PostgreSQL
```

This is the live architectural pattern that the current codebase actually follows. A `src/server/controllers`
folder exists, but the active App Router implementation primarily routes directly from pages or route
handlers into services.

## 2.2 Layer Responsibilities

| Layer                      | Main Location                                    | Responsibility                                                                                                                                   |
| -------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Route and page composition | `src/app/**`                                     | Route ownership, page composition, metadata, auth redirects, API entry points.                                                                   |
| Service layer              | `src/server/services/**`                         | Business rules, orchestration, list/detail retrieval, reordering, mutations, dashboard aggregation, bootstrap, and theme/site settings behavior. |
| Repository layer           | `src/server/repositories/**`                     | Prisma-backed data access, singleton settings access, model-specific querying, and persistence details.                                          |
| Serializer layer           | `src/server/serializers/**`                      | Convert repository output into DTOs and normalized structures for UI and API responses.                                                          |
| Security and HTTP helpers  | `src/server/security/**`, `src/server/http/**`   | Sessions, auth guards, rate limits, error mapping, and response envelopes.                                                                       |
| Client interaction layer   | `src/components/**`, selected `use client` files | Forms, drag-and-drop, toasts, previews, and interactive admin/public widgets.                                                                    |

## 2.3 Rendering Model

- Public pages default to server-first rendering through async App Router pages and sections.
- Client components are used only where state, effects, browser APIs, or direct UI interactions are needed.
- Public content is assembled through services, not by direct Prisma access in page components.
- Admin pages mix server-loaded shells with client forms that submit to authenticated API routes.

## 2.4 Request And Mutation Paths

### Public Read Path

1. A public page under `src/app/*` calls a service.
2. The service fetches model data through one or more repositories.
3. Serializers normalize JSON-backed fields, dates, and derived UI shapes.
4. The page or section renders the DTOs into the current theme/layout.

### Admin Mutation Path

1. A client form or interaction component gathers user input.
2. The form calls an authenticated `/api/v1/*` route.
3. The route handler validates input, enforces auth, and delegates to a service.
4. The service applies business rules and writes via repositories.
5. The route returns the canonical response envelope.
6. The client refreshes its local state or the route cache.

## 2.5 Cross-Cutting Systems

- **Env bootstrap:** `EnvBootstrapService` ensures the settings singleton row and bootstrap admin can exist after DB initialization.
- **Theme registry:** `src/themes/**` plus `ThemeService` drive theme discovery, preview, and persistence.
- **Settings singleton:** `SettingsRepository` and `SettingsService` provide site-wide values consumed by public and admin surfaces.
- **Static-content bridge:** `src/static-content/**` remains the fallback/bootstrap-aligned content source for seeds and defaults.
- **Media storage driver:** `MediaService` separates media metadata persistence from the storage implementation.

## 2.6 Directory Structure Intent

- `src/app/`: routes, layouts, route handlers, metadata, redirects.
- `src/components/`: reusable UI and admin-specific forms/shells.
- `src/sections/`: public page section composition.
- `src/server/`: services, repositories, serializers, auth, validators, DB access, and server utilities.
- `src/static-content/`: template-safe fallback and seed-aligned default content.
- `data/ammar/`: owner-specific content used by the owner seed flow.
- `prisma/`: schema and seed scripts.

## 2.7 Architecture Guardrails

- Do not import `@/server/*` into client components.
- Keep route handlers thin and business rules in services.
- Keep repository concerns focused on persistence and query shape.
- Keep response shaping consistent with serializers and HTTP helpers.

---
[« Previous](01-system-overview.md) | [Next »](03-data-and-persistence.md)
