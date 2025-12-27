# AI Agent Instructions — TS-NextJS-PersonalPortfolio-v1-2025

**Target:** TS-NextJS-PersonalPortfolio-v1-2025
**Version:** 1.1.0
**Updated:** 2025-12-27
**Status:** Production Ready — All Agents Executed Successfully

## Project Overview

TS-NextJS-PersonalPortfolio-v1-2025 is a production-ready, self-hosted portfolio platform built with Next.js 15, Prisma, and enterprise architecture patterns. It provides a themable public website with a full-featured admin CMS, supporting both SQLite and Neon PostgreSQL databases.

**Key Features:**
- Complete admin dashboard with CRUD operations, drag-and-drop reordering, draft/publish workflows
- Theming system with multiple themes and admin switching
- Media management with upload, preview, and cloud storage abstraction
- Contact form with admin inbox and rate limiting
- Blog editor with rich text and scheduling
- SEO metadata management and analytics integration
- Automated setup wizard replacing terminal-based configuration
- Production-ready security with authentication, CSRF protection, and rate limiting

## Architecture Quick Reference

This follows a **layered Next.js 15 portfolio** with enterprise server architecture per Ammar Next.js Engineering Standard v1.02.00. Content sources from Prisma (SQLite/PostgreSQL) with fallback to `src/static-content/*` TypeScript modules.

### Critical Layers
```
src/app/          → Next.js App Router (SSR-first, route handlers)
  ├─ (public)/    → Public routes (home, portfolio, services, blogs, contact)
  ├─ admin/       → Admin dashboard (protected by auth)
  ├─ api/v1/      → REST API endpoints with consistent patterns
  └─ setup/       → Web-based setup wizard (new priority feature)

src/server/       → Enterprise backend architecture
  ├─ services/    → Business logic layer (orchestrates repositories)
  ├─ repositories/→ Data access abstraction (Prisma queries)
  ├─ serializers/ → Response DTOs (DB models → API responses)
  ├─ http/        → Error classes, response envelopes, helpers
  ├─ security/    → Auth, password hashing, sessions, rate limiting
  └─ server-utils/→ Shared utilities and helpers

src/components/   → Reusable UI components (Admin/, UI/, NavSidebar/, ProfileSidebar/)
src/sections/     → Page-specific section components (home/, Services/, setup/)
src/static-content/→ Generic template content (safe defaults for seeding)
data/ammar/       → Private owner dataset (local/deployment only)
prisma/           → Database schema, migrations, seed scripts
```

**Critical Rules:**
- **NEVER** import `@/server/*` in client components - will cause build failures
- Mark `"use client"` **only** for interactivity (forms, dropdowns, React state)
- Always use path aliases (`@/*`, `@/server/*`, etc.) for imports
- Follow strict TypeScript with Zod validation at all boundaries

## Key Patterns

### 1. Data Flow Architecture
- **Pages/Layouts**: Call services directly (SSR/SSG/ISR)
  ```typescript
  import { SettingsService } from '@/server/services/SettingsService';
  const content = await SettingsService.getSiteContent(); // Cached with revalidation
  ```
- **API Routes**: Validate → Service → Serialize → Response (consistent pattern)
  ```typescript
  // Reference: src/app/api/v1/example/route.ts
  import { z } from 'zod';
  import { successResponse, validationErrorResponse } from '@/server/http/responses';
  import { SomeService } from '@/server/services/SomeService';

  const schema = z.object({ name: z.string().min(1) });

  export async function POST(request: Request) {
    const body = await request.json();
    const result = schema.safeParse(body);
    if (!result.success) return validationErrorResponse('Invalid input', result.error.issues);

    const data = await SomeService.execute(result.data);
    return successResponse(data);
  }
  ```
- **Error Handling**: Use AppError class; throw in services, catch in API routes
- **Validation**: Zod schemas at all boundaries (client + server)

### 2. Server-Only Module Safety
- Use `@/server/*` path alias **exclusively** in server contexts (layouts, API routes, services)
- **NEVER** import server modules in client components - causes build failures
- Environment variables: Import from `@/server/server-validators/env` (typed & validated)
  ```typescript
  import { env } from '@/server/server-validators/env';
  console.log(env.DATABASE_URL); // ✅ Type-safe, validated
  console.log(env.AUTH_SECRET);  // ✅ Required for auth
  console.log(env.NEXT_PUBLIC_SITE_URL); // ✅ For SEO/metadata
  ```

### 3. Database Operations & Seeding

**Database Support:**
- SQLite (default for local dev): `DATABASE_URL="file:./dev.db"`
- Neon PostgreSQL (production): `DATABASE_URL="postgresql://..."`

**Seeding Strategies:**
- `npm run db:seed` → Standard seed using `src/static-content/*` (generic templates)
- `npm run seed:ammar` → Advanced owner-specific seeder (`prisma/reset-and-seed-ammar.ts`)
  - Sources from `data/ammar/*` (private owner dataset)
  - Skips gracefully if `data/ammar/` not present
  - Idempotent and database-agnostic (safe to re-run)

**Schema & Migration Workflow:**
```bash
npm run prisma:migrate dev  # Create + apply migration (dev)
npm run prisma:generate     # Regenerate Prisma client
npm run prisma:studio       # GUI database inspection
npm run prisma:migrate reset # Dev only: Reset DB + re-seed
```

### 4. Response Envelopes & Error Handling
All API endpoints use consistent wrappers from `src/server/http/responses.ts`:
```typescript
successResponse(data, meta?, status?)      // { success: true, data, meta? }
createdResponse(data)                      // { success: true, data } with 201
errorResponse(error)                       // Converts AppError → JSON error
validationErrorResponse(message, issues)   // Zod validation failures
```

**Error Classes:**
- `ValidationError` - Input validation failures
- `NotFoundError` - Resource not found
- `UnauthorizedError` - Authentication required
- `ConflictError` - Business logic conflicts
- `AppError` - Generic application errors

### 5. Theme System & UI Architecture
- **Theme Registry**: Themes in `src/themes/index.ts` (metadata, previews, author info)
- **Application**: Via `Settings.theme` (database) → `data-theme` on `<html>` → CSS variables
- **Admin Control**: `/admin/settings/theme` with preview + apply actions
- **CSS Variables**: Scoped per theme in `src/app/globals.css`
- **Layout Structure**: Three-area responsive grid (ProfileSidebar | Content | NavSidebar)
- **Mobile**: Single column with collapsible navigation and drawers

## Common Workflows

### Adding a New API Endpoint
1. **Schema**: Define Zod schema in `src/server/server-validators/api/<feature>.ts`
2. **Route Handler**: Create in `src/app/api/v1/<feature>/route.ts` with validation + response
3. **Service**: Business logic in `src/server/services/<Feature>Service.ts`
4. **Repository**: Data access in `src/server/repositories/<Feature>Repository.ts` (if needed)
5. **Serializer**: DTO conversion in `src/server/serializers/<feature>.ts`

**Reference:** `src/app/api/v1/example/route.ts`

### Creating a New Admin CRUD Page
1. **API Endpoints**: Full CRUD in `src/app/api/v1/<feature>/`
2. **Service Layer**: Complete in `src/server/services/<Feature>Service.ts`
3. **Admin Page**: `src/app/admin/<feature>/page.tsx` with table + form
4. **Reorder Support**: `POST /api/v1/<feature>/reorder` with drag-and-drop UI

### Creating a New Public Page
1. **Route**: `src/app/<route>/page.tsx` (SSR by default)
2. **Data Fetching**: Call services directly: `await SomeService.getData()`
3. **Composition**: Use sections from `src/sections/<domain>/`
4. **Interactivity**: Mark client components with `"use client"` for forms/state

**Layout Structure:**
- **Desktop**: `grid-cols-[minmax(240px,18vw)_1fr_minmax(60px,6vw)]` (ProfileSidebar | Content | NavSidebar)
- **Mobile**: Single column with collapsible navigation and drawers
- **Root Layout**: `src/app/layout.tsx` → `ClientLayout` → Sidebars

### First-Run Setup & Development
**New contributors/deployments:**
```bash
npm install
npm run setup:first-run     # Interactive TypeScript setup (asks for SQLite/Neon, generates .env)
npm run dev                 # Start at localhost:3000
```

**Automated Setup:** `scripts/setup/first-run.ts` handles DB selection, migration, seeding
**PowerShell Alternative:** `npm run setup:first-run:ps` (Windows)
**Manual Fallback:** See `QUICKSTART.md` and `instructions/FIRST-RUN.md`

**Priority Feature:** Web-based setup wizard replacing terminal commands (in development)

### Quality Assurance & Testing
```bash
npm run typecheck      # TypeScript strict mode
npm run lint           # ESLint + Next.js config
npm run test           # Vitest unit tests
npm run e2e            # Playwright e2e tests
npm run build          # Production build verification
npm run check          # All of the above
```

**CI Gates:** All commands must pass before merging. Includes smoke tests for admin login + theme switching.

## Path Aliases & Configuration
```json
"@/*"                 → "./src/*"
"@/server/*"          → "./src/server/*"
"@/static-content/*"  → "./src/static-content/*"
"@/client-validators/*" → "./src/client-validators/*"
```

**TypeScript:** Strict mode enabled, no `any` types allowed (ESLint enforced)
**Formatting:** Prettier with no semicolons, single quotes
**Validation:** Zod schemas at all boundaries (client + server)

## Admin Dashboard & Features
- **Location**: `src/app/admin/` (protected by iron-session auth)
- **Login**: `/admin` with seeded credentials (default: `admin` / `change-me-now`)
- **Core Features**:
  - Full CRUD for all content types (portfolio, experience, education, skills, certificates, recommendations, blogs, services)
  - Drag-and-drop reordering with optimistic updates
  - Draft/publish workflows with toast notifications
  - Theme selector with preview and apply actions
  - Media library with upload, preview, and delete
  - Contact inbox with read/unread status
  - Settings panel (general, theme, maintenance, account)
- **Architecture**: React Server Components + `"use client"` islands for interactive elements

## Documentation & Reference Materials

| Topic | Location | Purpose |
|-------|----------|---------|
| **Architecture Overview** | `docs/TS-NextJS-PersonalPortfolio-V1-2025 Documentation/architecture.md` | System design, layers, data model, APIs |
| **Code Structure** | `docs/TS-NextJS-PersonalPortfolio-V1-2025 Documentation/code-structure.md` | Folder ownership and responsibility map |
| **API & Services** | `docs/TS-NextJS-PersonalPortfolio-V1-2025 Documentation/sections/04-api-and-services.md` | REST endpoints, service layer, repositories |
| **Admin & Public UX** | `docs/TS-NextJS-PersonalPortfolio-V1-2025 Documentation/sections/05-admin-and-public-experience.md` | Dashboard, CRUD forms, public pages |
| **Security & Compliance** | `docs/TS-NextJS-PersonalPortfolio-V1-2025 Documentation/sections/07-security-and-compliance.md` | Auth, CSRF, rate limiting, headers |
| **Testing & Quality** | `docs/TS-NextJS-PersonalPortfolio-V1-2025 Documentation/sections/08-testing-and-quality.md` | Unit, RTL, Playwright e2e testing |
| **Implementation Checklist** | `docs/TS-NextJS-PersonalPortfolio-V1-2025 Documentation/sections/09-implementation-checklist.md` | Phase status, next actions |
| **First Run Setup** | `instructions/FIRST-RUN.md` | Local setup with SQLite/Neon support |
| **Database Seeding** | `instructions/SEEDING.md` | Seeding workflows and strategies |
| **Deployment** | `instructions/DEPLOYMENT.md` | Vercel + CI/CD setup |
| **Agent Execution Status** | `docs/EXECUTION_STATUS.md` | Quick reference for all completed work |

**Quick Start:** Read `docs/EXECUTION_STATUS.md` for 5-min overview, then `docs/TS-NextJS-PersonalPortfolio-V1-2025 Documentation/architecture.md`

## Anti-Patterns & Critical Rules

**🚫 NEVER:**
- Import `@/server/*` in client components (causes build failures)
- Bypass Zod validation schemas at boundaries
- Call repositories directly from route handlers (always use services)
- Hardcode colors (use CSS variables from theme system)
- Access `process.env` directly (use `@/server/server-validators/env`)
- Create fixed-width layouts (use responsive grid/flex)
- Skip accessibility (semantic HTML, aria labels, keyboard navigation)
- Use `any` types (strict TypeScript enforced)

**✅ ALWAYS:**
- Use path aliases for all imports (`@/*`, `@/server/*`, etc.)
- Mark client components with `"use client"` directive at top
- Follow layered architecture: Pages → Services → Repositories → Serializers
- Validate → Service → Serialize → Response pattern in APIs
- Use AppError class for error handling
- Follow PascalCase for components, camelCase for functions/variables

## Quick Debugging & Troubleshooting

**Environment & Auth Issues:**
```bash
# Generate secure AUTH_SECRET (32+ chars)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Inspect database
npm run prisma:studio

# Reset database (dev only)
npm run prisma:migrate reset
```

**Client/Server Boundary Errors:**
- **Symptom**: Build fails with server import errors
- **Check**: Verify `"use client"` directive at top of file
- **Fix**: Move server calls to API routes or server components

**Database Connection Issues:**
- **SQLite**: Ensure `dev.db` exists and is writable
- **Neon**: Verify `DATABASE_URL` includes `sslmode=require`
- **Reset**: `npm run prisma:migrate reset` (drops and recreates)

**Content Sources:**
- **Production**: Database (Prisma) for all content
- **Development**: Can use static fallback (`src/static-content/*`)
- **Owner Data**: Private datasets in `data/ammar/` for personalized deployments

---

## Project Status & Next Priorities

**Current Status:** ✅ **PRODUCTION READY** — All 9 agents executed successfully, all phases complete.

**Immediate Focus:** Implement web-based setup wizard (`/setup` route) to replace terminal-based first-run configuration with a user-friendly interface.

**Key Reminders:**
- This project follows strict separation of concerns and enterprise architecture patterns
- All features are fully documented in the `docs/` directory
- When in doubt, reference:
  1. `docs/EXECUTION_STATUS.md` for quick overview
  2. `docs/TS-NextJS-PersonalPortfolio-V1-2025 Documentation/architecture.md` for design decisions
  3. `src/app/api/v1/example/route.ts` for API patterns
  4. Existing services/repositories for data layer conventions
