# 2. Architecture Layers

## 2.1 Layer Stack
```
Client (Public + Admin)
    ↓ Next.js App Router routes (app/*)
    ↓ API handlers (/app/api/v1/*)
    ↓ Controllers (src/server/http/*)
    ↓ Services (src/server/services/*)
    ↓ Repositories (src/server/repositories/*)
    ↓ Serializers (src/server/serializers/*)
    ↓ Prisma ORM (src/server/db)
    ↓ Database (Neon PostgreSQL on Vercel/local)

```
- **Client Layer:** Server-first React components render public pages and admin forms. Client
  components exist only for interactive widgets (sidebar toggles, drag-and-drop, form validation).
- **API Layer:** Route handlers wrap requests with validation, auth enforcement, and response
  helpers from `src/server/http/responses.ts`.
- **Controller Layer:** Thin orchestration classes convert HTTP semantics to service calls and map
  domain errors to canonical HTTP codes.
- **Service Layer:** Centralizes business logic (slug generation, draft transitions, reorder logic,
  metrics). Services consume repositories and serializers only—no Prisma calls bleed outward.
- **Repository Layer:** Prisma-backed CRUD abstractions scoped per aggregate (PortfolioRepository,
  SettingsRepository, etc.). Queries return raw Prisma models and enforce connection pooling.
- **Serializer Layer:** Converts Prisma models into DTOs consumed by UI and API responses while
  normalizing JSON columns, formatting dates, and shaping nested relations.

## 2.2 Request Lifecycles
### Public Read (`GET /portfolio`)
1. Server component invokes `PortfolioService.listPublished()`.
2. Service queries `PortfolioRepository.findPublishedWithMedia()`.
3. Repository runs Prisma query with `select` projection and ordering indexes (`displayOrder`).
4. Serializer emits DTOs consumed by the theme-specific layout.
5. Component renders statically (SSG) or dynamically depending on revalidation settings.

### Admin Mutation (`PUT /api/v1/services/[id]`)
1. Admin UI validates form via client-side Zod schema from `src/client-validators`.
2. API handler enforces `requireAuth()` and re-validates payload using server schema.
3. Controller calls `ServiceService.update(id, payload)`.
4. Service performs business validation (slug uniqueness, displayOrder adjustments) and snapshot via
   `ContentVersion` if enabled.
5. Repository persists the update; serializer formats response; response helper wraps success body.
6. Admin UI receives DTO and refreshes form state; optimistic UI optional.

## 2.3 Supporting Systems
- **Env Bootstrap:** At runtime the app ensures a Settings row + admin user exist using `.env` values
  once migrations have been applied.

- **Theme Registry:** `src/themes/index.ts` resolves metadata and exposes helpers consumed in
  `app/layout.tsx`. Theme IDs are stored in `Settings` and injected via context providers.
- **Static Content Bridge:** `src/static-content` mirrors historical TypeScript exports and powers the
  seed script. Repositories/services now read from Prisma but parity scripts compare snapshots using
  helper utilities under `src/server/server-utils/`.
