# 2. Folder Layout (under `src/`)

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
    controllers/                # Request orchestration (called by route handlers)
      UserController.ts
      PostController.ts
      AuthController.ts
    services/                   # Business logic and use-cases
    repositories/               # DB queries (Prisma) and external API calls
    db/
      prisma.ts                 # Prisma client singleton
    security/                   # Auth and security helpers
      jwt.ts                    # JWT sign/verify, claims shaping
      crypto.ts                 # Hashing, random, key mgmt wrappers
      session.ts                # Session management (iron-session)
      auth.ts                   # Auth helpers (requireAuth, requirePermission)
      auth-middleware.ts        # Shared helpers for Next middleware enforcement
      rbac.ts                   # Role-based access control definitions
    middleware/                 # Middleware modules and rules
      auth.middleware.ts        # Auth enforcement middleware
      rateLimit.middleware.ts   # Rate limiting middleware
      security.middleware.ts    # Security headers, CORS, etc.
      index.ts                  # Barrel export of all middleware
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

## Route Groups: `(public)`, `(protected)`, and Custom Groups

In Next.js App Router, folders wrapped in parentheses like `(public)` and `(protected)` are **route groups**. They:

- **Do NOT** appear in the URL path (i.e., `/app/(public)/about/page.tsx` renders at `/about`, not `/(public)/about`).
- **Allow** you to organize routes logically without changing their URL structure.
- **Enable** shared layouts: all routes in a group can share the same parent layout.

### Common Patterns

**1. Public and Protected Route Separation**
```
src/app/
  (public)/                    # Routes visible without authentication
    layout.tsx                 # Shared public layout (navbar, footer)
    page.tsx                   # Home
    about/
      page.tsx                 # /about
    blog/
      [slug]/
        page.tsx               # /blog/[slug]
  
  (protected)/                 # Routes requiring authentication
    layout.tsx                 # Shared protected layout (dashboard nav)
    dashboard/
      page.tsx                 # /dashboard
    settings/
      page.tsx                 # /settings
    profile/
      page.tsx                 # /profile
  
  (admin)/                     # Admin-only section (even stricter auth)
    layout.tsx                 # Admin layout with role check
    users/
      page.tsx                 # /admin/users
    settings/
      page.tsx                 # /admin/settings
```

**2. Public Layout (`src/app/(public)/layout.tsx`)**
```typescript
// Visible to everyone; no auth guard
export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PublicNavBar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
```

**3. Protected Layout (`src/app/(protected)/layout.tsx`)**
```typescript
// Requires authentication; redirects to /login if not signed in
import { redirect } from 'next/navigation';
import { getSession } from '@/server/security/session';
import { DashboardNav } from '@/components/layouts/DashboardNav';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session.isAuthenticated) {
    redirect('/login');
  }

  return (
    <>
      <DashboardNav user={session} />
      <main>{children}</main>
    </>
  );
}
```

**4. Admin Layout (`src/app/(admin)/layout.tsx`)**
```typescript
// Requires ADMIN or SUPER_ADMIN role
import { redirect } from 'next/navigation';
import { getSession } from '@/server/security/session';
import { AdminSidebar } from '@/components/layouts/AdminSidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session.isAuthenticated) {
    redirect('/login');
  }

  // Check if user has admin role
  if (!['ADMIN', 'SUPER_ADMIN'].includes(session.role)) {
    redirect('/forbidden');
  }

  return (
    <>
      <AdminSidebar />
      <main>{children}</main>
    </>
  );
}
```

### URL Mapping Examples

| File Path | Route Group | URL |
|-----------|-------------|-----|
| `(public)/page.tsx` | public | `/` |
| `(public)/about/page.tsx` | public | `/about` |
| `(protected)/dashboard/page.tsx` | protected | `/dashboard` |
| `(protected)/settings/page.tsx` | protected | `/settings` |
| `(admin)/users/page.tsx` | admin | `/admin/users` |
| `(admin)/settings/page.tsx` | admin | `/admin/settings` |

### Why Use Route Groups?

1. **Organize by access level** without adding URL segments.
2. **Share layouts** for all routes in a group (same nav, styling, auth guard).
3. **Avoid flat folder structures** when your app grows (easier to navigate the project).
4. **Defense in depth**: Combine middleware redirects + layout redirects so no protected route is accidentally exposed.

### Defense-in-Depth Strategy

Always use **both** middleware and layout guards:

1. **Middleware (`src/middleware.ts`):** First line of defense; catches requests early.
2. **Layout Guard (`app/(protected)/layout.tsx`):** Second line; verified permission before rendering children.
3. **Page Guard (optional):** Extra permission check inside a page component if needed.

---

## Database (Prisma)

- Models: PascalCase, Fields: camelCase, Tables: snake_case via `@@map()`
- Always include: `id`, `createdAt`, `updatedAt`
- Soft deletes: `deletedAt DateTime?`
- Index: foreign keys, unique fields, WHERE/ORDER BY columns
- Always use explicit `select` (never select passwords)
- Migrations: `prisma migrate dev` (dev), `prisma migrate deploy` (prod)
- Seed data via `prisma/seed.ts`

---
