# Project Overview Prompt for ChatGPT

Use the following as context when asking ChatGPT to research, analyze, or advise on this project.

---

## Project Identity

**Name:** TS-NextJS-PersonalPortfolio-v1-2025
**Version:** 00.80.01
**Author:** Ammar Hany
**Status:** Relaunch preparation (near launch-ready)
**Description:** Self-hosted portfolio platform combining a public website, a protected admin CMS, Prisma-backed persistence, theme support, and env/bootstrap-driven first-run setup.

---

## Full Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| UI Library | React 19 |
| Styling | Tailwind CSS 4 |
| Database ORM | Prisma 5 + PostgreSQL |
| Auth | iron-session (encrypted cookies, bcrypt password hashing) |
| Validation | Zod 4 (server + client validators) |
| Unit Tests | Vitest 4 |
| E2E Tests | Playwright |
| Drag-and-Drop | @dnd-kit (admin reorder UI) |
| Icons | lucide-react |
| Rich Text Editor | Quill 2 (admin blog editing) |
| 3D Rendering | Three.js + react-three-fiber (optional/public decoration) |
| Linting | ESLint 9 with eslint-config-next |
| Formatting | Prettier |
| Deployment | Vercel + Neon (PostgreSQL) |

---

## Architecture Pattern

The dominant runtime flow follows a strict layered architecture:

```
Page/Route Handler
  -> Service (business logic)
  -> Repository (Prisma data access)
  -> Serializer (DTO normalization)
  -> Prisma Client
  -> PostgreSQL
```

Key architectural rules:
- Route handlers must be thin; business rules live in services.
- Repositories own query shape and persistence only.
- Serializers normalize DB output into DTOs for API responses and UI consumption.
- `@/server/*` must NOT be imported from client components.
- All API boundaries use Zod validation.
- Public pages are server-first (async App Router); client components only where interactivity requires them.

---

## Directory Structure (src/)

```
src/
  app/                          # Next.js App Router
    layout.tsx                  # Root layout (fonts, metadata)
    page.tsx                    # / redirects to /home
    globals.css                 # Global styles + CSS variables
    (public)/                   # Shared public layout shell
    home/page.tsx               # Main landing page
    portfolio/                  # Public portfolio listing + [slug] details
    services/page.tsx           # Public services listing
    blogs/                      # Public blog listing + [slug] details
    login/page.tsx              # Admin login page
    admin/                      # Protected admin CMS
      layout.tsx                # Admin shell with requireAuth()
      page.tsx                  # Admin dashboard
      dashboard/                # Dashboard metrics & quick links
      portfolio/                # Portfolio CRUD + reorder
      experience/               # Experience CRUD
      education/                # Education CRUD
      services/                 # Services CRUD + reorder
      blogs/                    # Blog CRUD with rich editor
      media/                    # Media library (upload, preview, copy link, delete)
      contact/                  # Contact inbox (review submissions)
      certificates/             # Certificates CRUD
      recommendations/          # Recommendations CRUD
      skills/                   # Skills CRUD
      settings/
        profile/                # Site profile editing
        visibility/             # Public page/section visibility toggles
        theme/                  # Theme preview & apply
        setup/                  # Bootstrap & setup diagnostics
    api/v1/                     # Route handlers (14 domains)
      auth/                     # POST login, POST logout
      portfolio/                # CRUD + reorder
      blogs/                    # CRUD
      experience/               # CRUD
      education/                # CRUD
      services/                 # CRUD + reorder
      skills/                   # CRUD
      certificates/             # CRUD
      recommendations/          # CRUD
      media/                    # Upload, list, delete
      contact/                  # Public submit + admin inbox
      themes/                   # List themes, apply theme
      settings/                 # PATCH profile, PATCH visibility
      example/                  # Diagnostics / readiness probe
  server/
    services/                   # Business logic (per domain)
    repositories/               # Prisma data access (per model)
    serializers/                # DTO mappers
    security/                   # Auth, sessions, rate limits, password hashing
    http/                       # Error classes, response envelopes
    server-validators/          # Zod schemas (env validation, API contracts)
    server-utils/               # Node-only utilities
    db/                         # Prisma client singleton
  sections/home/                # Home page sections (hero, experience, education, skills, etc.)
  components/                   # Reusable UI (Portfolio, ProfileSidebar, NavSidebar, UI primitives)
  static-content/               # Fallback/bootstrap content (seed-aligned defaults)
  client-validators/            # Client-side Zod schemas (UX helpers only)
  types/                        # TypeScript types
  utils/                        # Isomorphic utilities
  lib/                          # Framework-level helpers
  themes/                       # 7 built-in CSS theme definitions
  public/                       # Static assets, uploads, attachments
```

---

## Public Routes

| Route | Purpose | Data Source |
|---|---|---|
| `/` | Canonical entry | Redirects to `/home` |
| `/home` | Main landing page | SettingsService + Experience/Education/Recommendation services |
| `/portfolio` | Portfolio project index | PortfolioService (published only) |
| `/portfolio/[slug]` | Portfolio detail | PortfolioService |
| `/services` | Services listing | ServiceService (active only) |
| `/blogs` | Blog index | BlogService (published only) |
| `/blogs/[slug]` | Blog detail | BlogService |
| `/login` | Admin sign-in | Auth API |

The contact experience is embedded on `/home#contact` (no standalone `/contact` route).

---

## Admin CMS Routes (protected by requireAuth())

| Route Group | Purpose |
|---|---|
| `/admin` / `/admin/dashboard` | Dashboard with metrics and quick links |
| `/admin/portfolio` | Project CRUD + drag-and-drop reorder |
| `/admin/experience` | Career timeline CRUD |
| `/admin/education` | Education timeline CRUD |
| `/admin/services` | Services CRUD + drag-and-drop reorder |
| `/admin/blogs` | Blog CRUD with Quill rich text editor |
| `/admin/media` | Media library (upload, preview, copy link, delete) |
| `/admin/contact` | Contact inbox (review, manage submissions) |
| `/admin/certificates` | Certificates CRUD |
| `/admin/recommendations` | Recommendations CRUD |
| `/admin/skills` | Skills/skill-groups CRUD |
| `/admin/settings/profile` | Edit site title, hero copy, email, location, timezone |
| `/admin/settings/visibility` | Toggle public page visibility + home section rendering |
| `/admin/settings/theme` | Preview and apply one of 7 built-in themes |
| `/admin/settings/setup` | Read-only bootstrap diagnostics |

---

## API Endpoints (`/api/v1/`)

| Area | Routes | Notes |
|---|---|---|
| Auth | POST `/auth/login`, POST `/auth/logout` | Session-based, rate-limited |
| Portfolio | GET/POST `/portfolio`, GET/PATCH/DELETE `/portfolio/[slug]`, POST `/portfolio/reorder` | + reorder |
| Blogs | GET/POST `/blogs`, GET/PATCH/DELETE `/blogs/[slug]` | Draft/publish workflow |
| Experience | GET/POST `/experience`, GET/PATCH/DELETE `/experience/[id]` | Timeline |
| Education | GET/POST `/education`, GET/PATCH/DELETE `/education/[id]` | Timeline |
| Services | GET/POST `/services`, GET/PATCH/DELETE `/services/[slug]`, POST `/services/reorder` | + reorder |
| Skills | GET/POST `/skills`, GET/PATCH/DELETE `/skills/[slug]` | Skill-group management |
| Certificates | GET/POST `/certificates`, GET/PATCH/DELETE `/certificates/[id]` | Credentials |
| Recommendations | GET/POST `/recommendations`, GET/PATCH/DELETE `/recommendations/[id]` | Testimonials |
| Media | GET/POST `/media`, DELETE `/media/[id]` | Upload to `public/uploads/` |
| Contact | POST `/contact`, GET `/contact`, PATCH/DELETE `/contact/[id]` | Public submit + admin inbox, rate-limited |
| Themes | GET `/themes`, POST `/themes/apply` | Registry + apply |
| Settings | PATCH `/settings/profile`, PATCH `/settings/visibility` | Site profile + visibility |
| Example | GET/POST `/example` | Readiness/diagnostics probe |

All API responses use a consistent envelope:
```json
{ "success": true, "data": {}, "meta": {} }
{ "success": false, "error": { "code": "...", "message": "...", "details": {} } }
```

---

## Database Models (Prisma / PostgreSQL)

| Model | Purpose | Key Fields |
|---|---|---|
| User | Admin identity | username, email, displayName, passwordHash, role, status |
| Settings | Singleton site config | siteTitle, siteSubtitle, hero*, primaryEmail, location, theme, maintenanceMode, socialLinks, seoDefaults, contactConfig, setupCompletedAt |
| Portfolio | Projects | slug, title, tagline, summary, featured, stack, gallery, sections, displayOrder, published |
| Blog | Posts | slug, title, content, status (draft/published), publishedAt, readingTime, seo |
| Category | Blog taxonomy | slug, name |
| Tag | Blog taxonomy | slug, name |
| Experience | Career entries | company, title, startDate, endDate, achievements, displayOrder, published |
| Education | Education entries | institution, degree, startDate, endDate, displayOrder, published |
| SkillGroup | Skill categories | slug, title, displayOrder |
| Skill | Individual skills | name, groupId, level, keywords, displayOrder |
| Service | Offerings | slug, title, description, technologies, active, displayOrder |
| Certificate | Credentials | name, issuer, issuedOn, skills, verifyUrl, displayOrder |
| Recommendation | Testimonials | name, company, content, rating, published, displayOrder |
| Media | Uploaded files | filename, mimeType, size, width, height, url |
| ContactSubmission | Inbox items | name, email, message, status (new/read/archived) |
| ContentVersion | Audit trail | contentType, contentId, version, data, createdById |

---

## Auth & Security

- Single-admin only (no multi-user roles)
- Session-based auth via iron-session (HttpOnly, SameSite=lax, secure in production)
- Passwords hashed with bcrypt
- Rate limiting on login and public contact submission
- Zod validation at all API boundaries
- `requireAuth()` guard on admin layout + protected API routes
- Secrets managed through environment variables only

---

## Theme System

- 7 built-in themes
- Theme metadata lives in `src/themes/`
- Selection persisted in Settings singleton
- Applied via `data-theme` attribute on HTML root
- Preview/apply managed through admin settings UI

---

## Bootstrap & First-Run

1. Configure `.env.local` with `DATABASE_URL`, `AUTH_SECRET`, `NEXT_PUBLIC_SITE_URL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_EMAIL`, `ADMIN_DISPLAY_NAME`
2. Run `npm run prisma:migrate`
3. Run `npm run db:seed` (generic) or `npm run seed:ammar` (owner data)
4. Start app with `npm run dev`
5. `EnvBootstrapService` creates settings row + admin user if DB exists but records are missing
6. Sign in at `/login` and manage content via `/admin/`

The old web setup wizard is retired. `/setup` now redirects to `/home`.

---

## Testing

| Check | Command | Status |
|---|---|---|
| Unit tests | `npm run test` (Vitest) | Green |
| Build | `npm run build` | Green |
| Typecheck | `npm run typecheck` (tsc --noEmit) | Currently failing (Playwright spec typing drift) |
| Lint | `npm run lint` | Green (in recent pass) |
| E2E | `npm run e2e` (Playwright) | Needs final rerun against dedicated test DB |
| Format check | `npm run format:check` (Prettier) | N/A |

E2E uses an isolated seeded web server on port 3100 by default. Use `PLAYWRIGHT_DATABASE_URL` to avoid mutating shared data.

---

## Deployment (Vercel + Neon)

- Build: `npm run build` / `npm run vercel-build` (prisma generate + migrate deploy + next build)
- Start: `npm run start`
- Env vars: `DATABASE_URL`, `AUTH_SECRET`, `NEXT_PUBLIC_SITE_URL`
- Redirects for old `/projects` routes handled in `next.config.ts`
- Prisma migrations run during CI/build, not from the website

---

## Current Relaunch Status

- Documentation is up-to-date and architecture-complete
- Build and unit tests are green
- Typecheck has a known Playwright spec typing drift issue (needs fix)
- Full isolated E2E needs a final rerun before launch signoff
- Public content, metadata, and SEO still need a dedicated review pass
- Core flows (admin CRUD, reorder, auth, theme, settings, media, contact) are verified
- The repo is NOT yet marked as production-ready

---

## Key Links Within Project

- Architecture overview: `docs/architecture/architect.md`
- Detailed architecture: `docs/architecture/sections/01-08`
- Implementation checklist: `docs/architecture/sections/09-implementation-checklist.md`
- Manual testing guide: `docs/architecture/sections/10-manual-testing-guidelines.md`
- Release checklist: `docs/release-checklist.md`
- Prisma schema: `prisma/schema.prisma`
- Package scripts: `package.json`

---

## Questions I Want You To Research / Help With

[Insert your specific questions or areas of research here]
