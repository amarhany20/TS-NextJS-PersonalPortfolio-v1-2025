# AI Agent Instructions — Personal Portfolio v1

**Target:** TS-NextJS-PersonalPortfolio-v1-2025  
**Version:** 1.0.0  
**Updated:** 2025-12-18

## Architecture Quick Reference

This is a **layered Next.js 15 portfolio** with enterprise server architecture following the Ammar Next.js Engineering Standard v1.02.00. Content sources from Prisma (SQLite/PostgreSQL) with fallback to `src/static-content/*` TypeScript modules.

### Critical Layers
```
src/app/          → Next.js App Router (SSR-first, route handlers)
src/server/       → Backend logic (services, repositories, serializers)
  ├─ services/    → Business logic layer (calls repositories)
  ├─ repositories/→ Data access (Prisma queries)
  ├─ serializers/ → Response DTOs (DB → API)
  ├─ http/        → Error classes, response envelopes
  └─ security/    → Auth, password hashing, sessions
src/components/   → Reusable UI (separate from page-specific sections)
src/sections/     → Page-specific section components
src/static-content/→ Fallback TypeScript data (archived snapshots)
```

**Rule:** Server imports (`@/server/*`) are forbidden in client components. Mark `"use client"` only for interactivity (forms, dropdowns, React state).

## Key Patterns

### 1. Data Flow
- **Pages/Layouts**: Call services directly (SSR/SSG)
  ```typescript
  import { SettingsService } from '@/server/services/SettingsService';
  const content = await SettingsService.getSiteContent(); // Cached
  ```
- **API Routes**: Validate → Service → Serialize → Response
  ```typescript
  // See src/app/api/v1/example/route.ts for full pattern
  const result = schema.safeParse(body);
  if (!result.success) return validationErrorResponse(...);
  const data = await SomeService.execute(result.data);
  return successResponse(data);
  ```

### 2. Server-Only Module Safety
- Use `@/server/*` path alias exclusively in server contexts (layouts, API routes, services)
- Environment variables: Import from `@/server/server-validators/env` (typed & validated)
  ```typescript
  import { env } from '@/server/server-validators/env';
  console.log(env.NODE_ENV); // ✅ Type-safe
  ```

### 3. Database Operations

**Seeding:**
- `npm run db:seed` → Standard seed using `src/static-content/*`
- `npm run seed:ammar` → Advanced archive-aware seeder ([prisma/reset-and-seed-ammar.ts](../prisma/reset-and-seed-ammar.ts))
  - Auto-detects newest `backups/static-content-archive/<YYYY-MM-DD>/manifest.json`
  - Falls back to static content if no archive exists
  - Idempotent (safe to re-run)

**Schema changes:**
```bash
npm run prisma:migrate    # Create migration
npm run prisma:generate   # Regenerate client
npm run prisma:studio     # GUI for data inspection
```

### 4. Response Envelopes
All API endpoints use consistent wrappers from [src/server/http/responses.ts](../src/server/http/responses.ts):
```typescript
successResponse(data, meta?, status?)      // { success: true, data, meta? }
errorResponse(error)                       // Converts AppError → JSON
validationErrorResponse(message, issues)   // Zod validation failures
```

### 5. Theme System
- Themes live in [src/themes/index.ts](../src/themes/index.ts) (registry pattern)
- Applied via `Settings.theme` (database) → injected as `data-theme` attribute on `<html>`
- CSS variables in [src/app/globals.css](../src/app/globals.css) (scoped per theme)
- Admin can change at `/admin/settings/theme`

## Common Workflows

### Adding a New API Endpoint
1. Create route handler in `src/app/api/v1/<feature>/route.ts`
2. Define Zod schema in `src/server/server-validators/api/<feature>.ts`
3. Implement service method in `src/server/services/<Feature>Service.ts`
4. Repository method in `src/server/repositories/<Feature>Repository.ts` (if DB access needed)
5. Serializer in `src/server/serializers/<feature>.ts` (DB model → DTO)

**Reference:** [src/app/api/v1/example/route.ts](../src/app/api/v1/example/route.ts)

### Creating a New Page
1. Add route: `src/app/<route>/page.tsx` (SSR by default)
2. Fetch data via service: `await SomeService.getData()`
3. Compose sections from `src/sections/<domain>/`
4. Keep interactive pieces client-only (`"use client"`)

**Layout Structure:**
- Root layout ([src/app/layout.tsx](../src/app/layout.tsx)) → `ClientLayout` → Sidebars
- Desktop: `grid-cols-[minmax(240px,18vw)_1fr_minmax(60px,6vw)]` (ProfileSidebar | Content | NavSidebar)
- Mobile: Single column with collapsible navigation

### First-Run Setup
New contributors/deployments:
```bash
npm install
npm run setup:first-run     # Interactive (asks for SQLite/Neon, generates .env)
npm run dev                 # Start at localhost:3000
```

**Automated setup:** [scripts/setup/first-run.ts](../scripts/setup/first-run.ts) handles DB selection, migration, seeding  
**Manual fallback:** [QUICKSTART.md](../QUICKSTART.md)

### Testing Commands
```bash
npm run typecheck      # TypeScript
npm run lint           # ESLint
npm run test           # Vitest (unit)
npm run e2e            # Playwright (e2e)
npm run check          # All of the above
```

## Path Aliases
```json
"@/*"                 → "./src/*"
"@/server/*"          → "./src/server/*"
"@/static-content/*"  → "./src/static-content/*"
"@/client-validators/*" → "./src/client-validators/*"
```

## Admin Dashboard
- Location: `src/app/admin/` (protected by auth middleware)
- Login: `/admin` with seeded credentials (default: `admin` / `change-me-now`)
- Features: Drag-and-drop content ordering, draft/publish, theme selector, media manager
- Architecture: React Server Components + `"use client"` islands for forms/interactions

## Documentation References

| Topic | Path |
|-------|------|
| Architecture Overview | [docs/TS-NextJS-PersonalPortfolio-V1-2025 Documentation/architecture.md](../docs/TS-NextJS-PersonalPortfolio-V1-2025 Documentation/architecture.md) |
| Server Layer Principles | [src/server/README.md](../src/server/README.md) |
| First Run Guide | [docs/runbooks/first-run.md](../docs/runbooks/first-run.md) |
| Database Seeding | [docs/runbooks/seeding.md](../docs/runbooks/seeding.md) |
| Theme Customization | [docs/themes/theme-registry.md](../docs/themes/theme-registry.md) |
| Deployment | [docs/runbooks/deployment.md](../docs/runbooks/deployment.md) |

## Anti-Patterns to Avoid

❌ **Don't** import `@/server/*` in client components  
❌ **Don't** bypass validation schemas (always use Zod at boundaries)  
❌ **Don't** call repositories directly from route handlers (use services)  
❌ **Don't** hardcode colors (use CSS variables from `globals.css`)  
❌ **Don't** access `process.env` directly (use `@/server/server-validators/env`)  
❌ **Don't** create fixed-width layouts (use responsive grid/flex)  
❌ **Don't** skip accessibility (semantic HTML, aria labels, keyboard nav)

## Quick Debugging

**Environment issues:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"  # Generate AUTH_SECRET
npm run prisma:studio  # Inspect database
```

**Client/Server boundary errors:**
- Check imports: Server modules in client code will fail at build
- Verify `"use client"` directive placement (top of file)

**Database out of sync:**
```bash
npm run prisma:migrate reset  # Dev only: Drops DB, reruns migrations + seeds
```

**Static content vs DB:**
- Production uses database (Prisma)
- Development can use static fallback (`src/static-content/*`)
- Archive system maintains content snapshots in `backups/static-content-archive/`

---

**Note:** This project follows strict separation of concerns. When in doubt:
1. Check [architecture.md](../docs/TS-NextJS-PersonalPortfolio-V1-2025 Documentation/architecture.md) for design decisions
2. Reference [src/app/api/v1/example/route.ts](../src/app/api/v1/example/route.ts) for API patterns
3. Consult existing services/repositories for data layer conventions
