
# Personal Portfolio (Next.js + TypeScript)

**Self-hosted portfolio platform with a public site, admin CMS, Prisma persistence, and launch-prep cleanup in progress.**

Version: `00.80.01` • Stack: **Next.js 16 / React 19 / TypeScript / Tailwind CSS / Zod**

---

## ✨ Highlights

- **🏗️ Enterprise Architecture**: Full layered server architecture with separation of concerns (services, repositories, serializers)
- **📦 Database-backed Content**: Prisma-backed public/admin content with static modules retained for fallback and bootstrap-safe defaults
- **🎛️ Settings-driven Visibility**: Hide public pages from navigation and return 404s without deleting database content
- **🔒 Type-Safe & Validated**: Strict TypeScript + Zod validation at all boundaries
- **🎯 Clean API Patterns**: Consistent error handling, response envelopes, and serialization
- **📱 Responsive & Accessible**: Mobile-first layout, semantic HTML, WCAG AA compliant
- **⚡ Performance-Oriented**: Server-side rendering, prerendered pages (SSG), minimal client JS
- **🎨 Curated Theme Gallery**: Seven built-in themes with persisted admin preview/apply behavior
- **🧪 Test-Ready**: Configured for Vitest (unit) and Playwright (e2e) testing
- **🔐 Security-First**: Environment validation, input sanitization, server-only secrets
- **📚 Well-Documented**: Active architecture docs, folder READMEs, and launch tracking
- **🚀 Relaunch-Oriented**: Database, authentication, admin CMS, APIs, and E2E coverage are being launch-hardened

---

## 📁 Architecture Overview

Following the **Ammar Next.js Engineering Standard v1.02.00**:

```
src/
├─ app/                          # Next.js App Router (pages, layouts, routes)
│  ├─ layout.tsx                 # Root layout with fonts and metadata
│  ├─ page.tsx                   # Landing page (redirects to /home)
│  ├─ home/page.tsx              # Home page composing sections
│  ├─ portfolio/                 # Portfolio listing + case studies
│  │  ├─ page.tsx                # /portfolio listing
│  │  └─ [slug]/page.tsx         # /portfolio/[slug] detail pages
│  ├─ services/page.tsx          # Services overview
│  ├─ blogs/page.tsx             # Blog listing page
│  └─ api/v1/                    # API route handlers (controllers)
│     └─ example/route.ts        # Lightweight diagnostics/readiness endpoint
│
├─ server/                       # Server-side application layer
│  ├─ http/                      # HTTP infrastructure (errors, responses)
│  ├─ services/                  # Business logic for public/admin domains
│  ├─ repositories/              # Prisma-backed data access layer
│  ├─ security/                  # Auth, password, sessions, rate limits
│  ├─ serializers/               # Response mappers and DTO shaping
│  ├─ server-validators/         # Authoritative Zod schemas (env validation)
│  ├─ server-utils/              # Node-only utilities
│  ├─ integrations/              # Third-party SDK wrappers
│  ├─ cache/                     # Caching abstractions
│  ├─ db/                        # Database clients
│  ├─ jobs/                      # Background jobs
│  └─ events/                    # Domain events (pub/sub)
│
├─ sections/home/                # Page sections (Experience, Education, Skills...)
├─ components/                   # Reusable UI components
│  ├─ Portfolio/                 # Project components
│  ├─ ProfileSidebar/            # Avatar, skills, contact
│  ├─ NavSidebar/                # Navigation + social links
│  ├─ Services/                  # Service cards
│  └─ UI/                        # Base UI primitives
│
├─ static-content/               # Static fallback and seed-aligned content snapshots
│  ├─ routes.ts                  # Route constants
│  ├─ metadata.ts                # Metadata + SEO fallback configuration
│  ├─ portfolio/                 # Project definitions (JSON)
│  └─ *.ts                       # Domain data (experience, skills, etc.)
│
├─ client-validators/            # Client-side Zod schemas (UX only)
├─ types/                        # Frontend-only TypeScript types
├─ utils/                        # Pure isomorphic utilities
├─ lib/                          # Framework-level helpers
└─ public/                       # Static assets (images, PDFs, etc.)
```

See `docs/architecture/README.md` for the active architecture docs.

---

## 🧩 Data Model Overview

|          Domain |                     Primary Source |                                         Notes |
| --------------: | ---------------------------------: | --------------------------------------------: |
|       Portfolio |      Prisma via `PortfolioService` |    Featured flag, metadata, sections, gallery |
|      Experience |     Prisma via `ExperienceService` | Collapsible cards, achievements, skills array |
|       Education |      Prisma via `EducationService` |            Start/end dates, computed duration |
|          Skills |          Prisma via `SkillService` |  Categorized or flat list consumed in sidebar |
|    Certificates |    Prisma via `CertificateService` |  PDF links stored under `public/attachments/` |
| Recommendations | Prisma via `RecommendationService` |             Safe external + PDF link handling |
|        Services |        Prisma via `ServiceService` |        Toggleable cards similar to Experience |
|   Personal Meta |       Prisma via `SettingsService` |         Name, title, location, contact/social |
|          Routes |     `src/static-content/routes.ts` |                          Route path constants |
|             SEO |    Settings row + static fallbacks |        Default SEO metadata and configuration |

Static content now acts as fallback/seed material rather than the only content source. Public/admin
flows primarily read from Prisma through the service layer, with static modules still used for
bootstrap and safe defaults where appropriate.

---

## 🔁 Route Migration (Projects → Portfolio)

The public-facing portfolio listing was renamed:

- Old: `/projects` & `/projects/[slug]`
- New: `/portfolio` & `/portfolio/[slug]`
- Permanent redirects defined in `next.config.ts` so old links still resolve.

Update any external bookmarks to the new path when convenient.

---

## 🚀 Getting Started

This repo targets **PostgreSQL** with env-driven bootstrap for admin and site settings.

### Prerequisites
- Node.js LTS (v20+)
- npm (comes with Node.js)

### Installation

```bash
git clone https://github.com/amarhany20/TS-NextJS-PersonalPortfolio-v1-2025.git
cd TS-NextJS-PersonalPortfolio-v1-2025
npm install
```

### Environment Setup

Production config should be provided through environment variables.

Required production variables:

```env
# 🔐 Session Secret (required for admin authentication)
AUTH_SECRET=your-32-character-minimum-secret-key-change-this-NOW

# 🌐 Public Site URL
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app

# 📦 Database (Neon PostgreSQL for production)
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"

```

Admin bootstrap defaults:

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change-me-now
ADMIN_EMAIL=admin@example.com
ADMIN_DISPLAY_NAME=Portfolio Admin
```

The runtime bootstrap path reads `ADMIN_*`. The seed scripts still accept `SEED_ADMIN_*` as a
compatibility fallback, and Playwright can override login through `E2E_ADMIN_*`.

**⚠️ Important:** Generate a secure `AUTH_SECRET` for production:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Then replace `your-32-character-minimum-secret-key-change-this-NOW` with the generated value.

### Database Setup (Required)

**Local development / self-hosting:**
```bash
npm run prisma:migrate
npm run db:seed
npm run prisma:studio    # Opens http://localhost:5555 in browser
```

**Production:**
- Set `DATABASE_URL` in Vercel
- Run Prisma migrations during CI/build (`prisma:migrate`)
- Prisma `generate` runs during build; it cannot be triggered from the website

### Supported First-Run Path

1. Configure `.env.local` or deployment environment variables.
2. Run `npm run prisma:migrate`.
3. Run `npm run db:seed` or `npm run seed:ammar`.
4. Start the app with `npm run dev`.
5. Sign in at `/login` with the configured admin credentials.
6. Review `/admin/settings/setup` to confirm bootstrap metadata and seed state.

The old web setup flow is retired. `/setup` and legacy setup-step URLs now redirect away from the
wizard path and are not part of the supported launch onboarding.

### First-Run Verification

After the first successful seed, confirm:

1. `npm run dev` starts without Prisma or settings-bootstrap errors.
2. `/home` renders public content.
3. `/login` accepts the configured admin credentials.
4. `/admin` loads successfully.
5. `/admin/settings/setup` shows setup metadata sourced from the seeded settings row.

### Development

```bash
npm run dev          # Start dev server at http://localhost:3000
npm run typecheck    # Run TypeScript checks
npm run lint         # Lint code
npm run format       # Format with Prettier
```

**First start checklist:**
1. ✅ `DATABASE_URL` and `AUTH_SECRET` are set
2. ✅ `npm run prisma:migrate` completed successfully
3. ✅ `npm run db:seed` completed (watch for "Database seed complete.")
4. ✅ `npm run dev` running without "Site settings have not been initialised" errors

Open http://localhost:3000 in your browser. **Admin dashboard** at http://localhost:3000/admin.


### Production Build

```bash
npm run build        # Create production build
npm start            # Start production server
```

### Quality Checks

```bash
npm run check        # Run typecheck + lint + format check (CI-ready)
npm run test         # Run Vitest suite (unit tests)
npm run test:watch   # Watch mode for tests
npm run e2e          # Run Playwright e2e tests (Playwright boots the app automatically)
```

**E2E Testing Flow:**
```bash
# Playwright provisions the test app, seeds the database, authenticates,
# and runs the Chromium suite.
npm run e2e -- --project=chromium
```

Tests log in via the API using credentials from `E2E_ADMIN_USERNAME` / `E2E_ADMIN_PASSWORD`.

Important:
- Let Playwright provision its own seeded app unless you are explicitly debugging against a running server.
- The isolated Playwright bootstrap requires a PostgreSQL-compatible `PLAYWRIGHT_DATABASE_URL` or
  `DATABASE_URL`; this repo no longer has a valid SQLite fallback because the Prisma datasource is
  PostgreSQL-only.
- Isolated Playwright runs default to `http://127.0.0.1:3100`; `PLAYWRIGHT_BASE_URL` is now mainly
  for `PLAYWRIGHT_REUSE_SERVER=1` debugging against an already-running app, while
  `PLAYWRIGHT_ISOLATED_BASE_URL` controls the dedicated bootstrapped server when needed.
- `PLAYWRIGHT_REUSE_SERVER=1` is useful for local debugging, but it can produce noisy failures when the live dev server has different data, credentials, or state than the isolated E2E bootstrap path.
- The actual local `.env` may override the documented default admin credentials; treat the values in `.env.example` and this README as defaults, not guaranteed active secrets.

### Clean & Rebuild

```bash
npm run clean        # Remove .next and cache
npm run rebuild      # Clean + build
```

---

## 🛠️ Customization Guide

### Content Updates

Primary launch content is managed through the admin CMS after seeding. Use `src/static-content/*`
for fallback/bootstrap defaults only, then verify the database-backed public pages after changes.

1. **Portfolio Items**: Manage through `/admin/portfolio`; static portfolio files are fallback/seed inputs only.
2. **Experience**: Manage through `/admin/experience`; publish only entries that should appear publicly.
3. **Education**: Manage through `/admin/education`.
4. **Skills**: Manage through `/admin/skills`.
5. **Services**: Manage through `/admin/services`.
6. **Personal Info & SEO**: Bootstrap from env/settings, then verify the settings row and public metadata.

### Assets

- **Images**: Place in `public/images/` and reference as `/images/filename.jpg`
- **PDFs**: Place in `public/attachments/` for certificates and documents
- **Avatar**: Update `public/images/avatar.jpg` or change path in personal data

### Styling

- **Global Tokens**: Edit `src/app/globals.css` for color schemes and CSS variables
- **Tailwind Config**: Modify `tailwind.config.ts` for theme extensions
- **Component Styles**: Use Tailwind utilities; extract with `@apply` when needed

### Navigation

- **Routes**: Define in `src/static-content/routes.ts`
- **Nav Links**: Edit `src/components/NavSidebar/NavLinks.tsx`
- **Social Links**: Prefer settings/admin-backed social links; keep `src/static-content/metadata.ts` as fallback-safe defaults.

### SEO

- **Default Metadata**: Prefer settings/env-backed metadata, with `src/static-content/metadata.ts` retained as fallback-safe defaults.
- **Page-Specific**: Add `generateMetadata` exports to individual pages

---

## 🧪 Quality & Conventions

- Type Safety: No `any` (enforced by ESLint). Consolidated domain types (removed legacy `database.ts`).
- Accessibility: Avoid nested anchors (fixed in recommendations section); toggle buttons expose `aria-expanded`.
- Performance: Static generation + minimal client interactivity; large assets manually curated.
- Imports: Optimized for `lucide-react` via experimental `optimizePackageImports` flag.

---

## ⚙️ Scripts (package.json)

| Script            |                                           Purpose |
| ----------------- | ------------------------------------------------: |
| `dev`             | Start development server at http://localhost:3000 |
| `dev:turbopack`   |           Dev using Turbopack experiment (faster) |
| `dev:webpack`     |                   Explicit Webpack dev (fallback) |
| `build`           |                                  Production build |
| `start`           |                            Serve production build |
| `typecheck`       |                      Run TypeScript type checking |
| `lint`            |                         ESLint + type-aware rules |
| `lint:fix`        |                           Auto-fix linting errors |
| `format`          |                              Format with Prettier |
| `format:check`    |                  Check formatting without changes |
| `check`           |        typecheck + lint + format check (CI-ready) |
| `test`            |                             Run Vitest suite once |
| `test:watch`      |                          Run Vitest in watch mode |
| `e2e`             |                          Run Playwright e2e tests |
| `clean`           |    Remove `.next`, `.next-playwright`, and caches |
| `rebuild`         |                                  Clean then build |
| `prisma:generate` |                            Generate Prisma client |
| `prisma:migrate`  |                           Apply Prisma migrations |
| `prisma:studio`   |                             Open Prisma Studio UI |
| `db:push`         |        Push schema to database (prototyping only) |
| `db:seed`         |                Seed database with initial content |

For complete database setup on first run, execute: `npm run prisma:migrate && npm run db:seed`

---

## 🌐 Deployment (Vercel + Neon)

This project is deployment-ready around PostgreSQL and env-driven bootstrap.

Steps (Vercel):
1. Import the GitHub repo
2. Framework detected: Next.js
3. Build command: `npm run build`
4. Output: `.next`
5. Set Vercel Environment Variables:
   - `DATABASE_URL` (Neon)
   - `AUTH_SECRET`
   - `NEXT_PUBLIC_SITE_URL`

Notes:
- Prisma `generate` runs during build; it cannot run from the website
- Run `prisma:migrate` during CI/build to apply schema changes
- Redirects for `/projects` are handled in `next.config.ts`


---

## 🧭 Roadmap (Planned / Potential)

- MDX support for rich project sections
- Tag + stack filtering on `/portfolio`
- Lightbox & swipe gestures for gallery
- Blog system (unified content pipeline)
- Analytics + basic performance telemetry (post-launch)
- Optional CMS adapter layer (e.g. Contentful / Sanity / Payload)
- Authentication + dashboard (v2) for dynamic editing
- RSS / JSON feed for case studies
- PDF auto-generation for resume snapshots
- i18n (multi-language content layer)

Have an idea? Open an issue or PR.

---

## 🔐 Removed or Retired (Legacy Features)

Retired from the supported launch path:

- web setup wizard as onboarding
- `setup:first-run` script-based onboarding

---

## 🧪 Testing Strategy

- **Unit**: `npm run test` executes the Vitest suite (use `npm run test -- path/to/file` for a single spec).
- **E2E**: `npm run e2e -- --project=chromium` boots the app via Playwright, logs in through the API, and runs admin smoke tests.
	- Uses `tests/e2e/webserver.ts` to provision the app, push the schema, and seed test data before running the browser suite.
	- Uses `PLAYWRIGHT_DATABASE_URL` when provided; otherwise the isolated bootstrap falls back to the active PostgreSQL `DATABASE_URL`.
	- Defaults isolated runs to `http://127.0.0.1:3100` so they do not contend with a normal `npm run dev` session on `3000`.
	- Override credentials with `E2E_ADMIN_USERNAME` / `E2E_ADMIN_PASSWORD` when needed.
- **Tips**: Keep the database in sync with `static-content` so seeded fixtures match UI assertions, and prefer `npm run dev` locally while iterating on Playwright tests for faster reloads.

---

## 🛡️ License / Usage

Personal + educational use permitted. For commercial reuse or white-label adaptation, contact the author or open a discussion.

Add a proper license (MIT / Apache-2.0) if you intend to encourage external contributions.

---

## ⚡ Credits

Built with Next.js, React, TypeScript, Tailwind CSS, and lucide-react icons.

Author: **Ammar Hany** – Connect via portfolio contact section or LinkedIn.

---

## 🔎 Quick Reference

| Area             | File / Path                                    |
| ---------------- | ---------------------------------------------- |
| Portfolio list   | `src/app/portfolio/page.tsx`                   |
| Portfolio detail | `src/app/portfolio/[slug]/page.tsx`            |
| Data index       | `src/static-content/index.ts`                  |
| Project JSON     | `src/static-content/portfolio/*.json`          |
| Experience UI    | `src/sections/home/ExperienceSection.tsx`      |
| Recommendations  | `src/sections/home/RecommendationsSection.tsx` |
| Navigation       | `src/components/NavSidebar/NavLinks.tsx`       |
| Version export   | `src/lib/version.ts`                           |

---

If you ship a modified fork, consider keeping attribution or a link back. Enjoy building your story.

