
# Personal Portfolio (Next.js 15 + TypeScript)

**Production-ready, enterprise-grade developer portfolio** following the Ammar Next.js Engineering Standard v1.02.00. Showcases projects (case studies), experience, education, skills, certificates, services, recommendations, and contact information with full backend architecture readiness.

Version: `00.50.06` • Stack: **Next.js 15 / React 19 / TypeScript / Tailwind CSS / Zod**

---

## ✨ Highlights

- **🏗️ Enterprise Architecture**: Full layered server architecture with separation of concerns (services, repositories, serializers)
- **📦 Static Content System**: All content sourced from structured TypeScript under `src/static-content/` (migration-ready)
- **🔒 Type-Safe & Validated**: Strict TypeScript + Zod validation at all boundaries
- **🎯 Clean API Patterns**: Consistent error handling, response envelopes, and serialization
- **📱 Responsive & Accessible**: Mobile-first layout, semantic HTML, WCAG AA compliant
- **⚡ Performance-Oriented**: Server-side rendering, prerendered pages (SSG), minimal client JS
- **🧪 Test-Ready**: Configured for Vitest (unit) and Playwright (e2e) testing
- **🔐 Security-First**: Environment validation, input sanitization, server-only secrets
- **📚 Well-Documented**: Comprehensive architecture docs and inline preambles
- **🚀 Backend-Ready**: Database, authentication, and API endpoints can be added seamlessly

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
│  ├─ blogs/page.tsx             # Blog placeholder
│  └─ api/v1/                    # API route handlers (controllers)
│     └─ example/route.ts        # Example endpoint (reference implementation)
│
├─ server/                       # 🆕 Server-side application layer
│  ├─ http/                      # HTTP infrastructure (errors, responses)
│  ├─ services/                  # Business logic (empty, ready for use)
│  ├─ repositories/              # Data access layer (empty, ready for DB)
│  ├─ security/                  # Auth, JWT, crypto helpers (empty, ready)
│  ├─ serializers/               # Response DTOs (empty, ready for APIs)
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
├─ static-content/               # 🆕 Static data (formerly temp-data)
│  ├─ routes.ts                  # Route constants
│  ├─ seo.ts                     # SEO configuration
│  ├─ portfolio/                 # Project definitions (JSON)
│  └─ *.ts                       # Domain data (experience, skills, etc.)
│
├─ client-validators/            # 🆕 Client-side Zod schemas (UX only)
├─ types/                        # Frontend-only TypeScript types
├─ hooks/                        # React hooks
├─ utils/                        # Pure isomorphic utilities
├─ lib/                          # Framework-level helpers
└─ public/                       # Static assets (images, PDFs, etc.)
```

See `docs/architecture.md` for comprehensive architecture documentation and decision log.

---

## 🧩 Data Model Overview

| Domain         | Source                                   | Notes |
|---------------:|------------------------------------------:|------:|
| Portfolio      | `src/static-content/portfolio/*.json`    | Featured flag, metadata, sections, gallery |
| Experience     | `src/static-content/experience.ts`       | Collapsible cards, achievements, skills array |
| Education      | `src/static-content/education.ts`        | Start/end dates, computed duration |
| Skills         | `src/static-content/skills.ts`           | Categorized or flat list consumed in sidebar |
| Certificates   | `src/static-content/certificates.ts`     | PDF links stored under `public/attachments/` |
| Recommendations| `src/static-content/recommendations.ts`  | Safe external + PDF link handling |
| Services       | `src/static-content/services.ts`         | Toggleable cards similar to Experience |
| Personal Meta  | `src/static-content/personal.ts`         | Name, title, location, contact/social |
| Routes         | `src/static-content/routes.ts`           | Route path constants |
| SEO            | `src/static-content/seo.ts`              | Default SEO metadata and configuration |

All data is typed, validated, and compiled at build time. Future migration to database will be seamless - just replace static imports with service layer calls.

---

## 🔁 Route Migration (Projects → Portfolio)

The public-facing portfolio listing was renamed:

- Old: `/projects` & `/projects/[slug]`
- New: `/portfolio` & `/portfolio/[slug]`
- Permanent redirects defined in `next.config.ts` so old links still resolve.

Update any external bookmarks to the new path when convenient.

---

## 🚀 Getting Started

**📖 Detailed Instructions:** See the `instructions/` folder for comprehensive guides:
- [FIRST-RUN.md](instructions/FIRST-RUN.md) — Local setup and database configuration
- [DEPLOYMENT.md](instructions/DEPLOYMENT.md) — Production deployment to Vercel
- [SEEDING.md](instructions/SEEDING.md) — Database seeding workflows
- [ADMIN-USAGE.md](instructions/ADMIN-USAGE.md) — Admin dashboard guide
- [THEMING.md](instructions/THEMING.md) — Theme customization

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

Edit your `.env` file to include these required variables:

```env
# 🔐 Session Secret (required for admin authentication)
AUTH_SECRET=your-32-character-minimum-secret-key-change-this-NOW

# 🌐 Public Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# 📦 Database (SQLite for local development)
DATABASE_URL="file:./dev.db"

# 👤 Seed Script Credentials
SEED_ADMIN_USERNAME=admin
SEED_ADMIN_PASSWORD=change-me-now
SEED_ADMIN_EMAIL=admin@example.com
SEED_ADMIN_DISPLAY_NAME=Portfolio Admin
```

**⚠️ Important:** Generate a secure `AUTH_SECRET` for production:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Then replace `your-32-character-minimum-secret-key-change-this-NOW` with the generated value.

### Database Setup (Required)

**First time only:**
```bash
# 1. Apply Prisma migrations to create schema
npm run prisma:migrate

# 2. Seed the database with initial data
#    This creates an admin user + portfolio/experience/education/skills from static-content
npm run db:seed

# 3. (Optional) Explore the database
npm run prisma:studio    # Opens http://localhost:5555 in browser
```

### Development

```bash
npm run dev          # Start dev server at http://localhost:3000
npm run typecheck    # Run TypeScript checks
npm run lint         # Lint code
npm run format       # Format with Prettier
```

**First start checklist:**
1. ✅ `.env` file exists with `AUTH_SECRET` + `DATABASE_URL`
2. ✅ `npm run prisma:migrate` completed successfully
3. ✅ `npm run db:seed` completed (watch for "Database seed complete.")
4. ✅ `npm run dev` running without "Site settings have not been initialised" errors

Open http://localhost:3000 in your browser. **Admin dashboard** at http://localhost:3000/admin (login with `admin` / `change-me-now`).

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
npm run e2e          # Run Playwright e2e tests (requires dev server running)
```

**E2E Testing Requirements:**
```bash
# Terminal 1: Start the dev server
npm run dev

# Terminal 2: Run Playwright tests
npm run e2e -- --project=chromium
```

Tests log in via the API using credentials from `E2E_ADMIN_USERNAME` / `E2E_ADMIN_PASSWORD`.

### Clean & Rebuild

```bash
npm run clean        # Remove .next and cache
npm run rebuild      # Clean + build
```

---

## 🛠️ Customization Guide

### Content Updates

1. **Portfolio Items**: Edit JSON files in `src/static-content/portfolio/` or add new ones. Each project needs a unique `slug`.
2. **Experience**: Update `src/static-content/experience.ts` with your work history.
3. **Education**: Modify `src/static-content/education.ts` with degrees and courses.
4. **Skills**: Edit `src/static-content/skills.ts` to showcase your tech stack.
5. **Services**: Update `src/static-content/services.ts` with offerings.
6. **Personal Info**: Edit `src/static-content/personal.ts` and `src/static-content/metadata.ts`.

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
- **Social Links**: Update in `src/static-content/metadata.ts`

### SEO

- **Default Metadata**: Edit `src/static-content/seo.ts`
- **Page-Specific**: Add `generateMetadata` exports to individual pages

---

## 🧪 Quality & Conventions

- Type Safety: No `any` (enforced by ESLint). Consolidated domain types (removed legacy `database.ts`).
- Accessibility: Avoid nested anchors (fixed in recommendations section); toggle buttons expose `aria-expanded`.
- Performance: Static generation + minimal client interactivity; large assets manually curated.
- Imports: Optimized for `lucide-react` via experimental `optimizePackageImports` flag.

---

## ⚙️ Scripts (package.json)

| Script              | Purpose |
|---------------------|---------:|
| `dev`               | Start development server at http://localhost:3000 |
| `dev:turbopack`     | Dev using Turbopack experiment (faster) |
| `dev:webpack`       | Explicit Webpack dev (fallback) |
| `build`             | Production build |
| `start`             | Serve production build |
| `typecheck`         | Run TypeScript type checking |
| `lint`              | ESLint + type-aware rules |
| `lint:fix`          | Auto-fix linting errors |
| `format`            | Format with Prettier |
| `format:check`      | Check formatting without changes |
| `check`             | typecheck + lint + format check (CI-ready) |
| `test`              | Run Vitest suite once |
| `test:watch`        | Run Vitest in watch mode |
| `e2e`               | Run Playwright e2e tests |
| `clean`             | Remove `.next` and caches |
| `rebuild`           | Clean then build |
| `prisma:generate`   | Generate Prisma client |
| `prisma:migrate`    | Apply Prisma migrations |
| `prisma:studio`     | Open Prisma Studio UI |
| `db:push`           | Push schema to database (prototyping only) |
| `db:seed`           | Seed database with initial content |

For complete database setup on first run, execute: `npm run prisma:migrate && npm run db:seed`

---

## 🌐 Deployment

Recommended: **Vercel** (zero-config). Also works on Netlify, Cloudflare Pages, or any Node host.

Steps (Vercel):
1. Import GitHub repo
2. Framework detected: Next.js
3. Build command: `npm run build`
4. Output: `.next`
5. (Optional) Set `NEXT_PUBLIC_APP_VERSION` manually if overriding auto version injection.

Redirects for `/projects` handled at application level (Next.js). For CDN-level rules, duplicate them in your hosting UI if required.

---

## 🧭 Roadmap (Planned / Potential)

- MDX support for rich project sections
- Tag + stack filtering on `/portfolio`
- Lightbox & swipe gestures for gallery
- Blog system (unified content pipeline)
- Analytics + basic performance telemetry
- Optional CMS adapter layer (e.g. Contentful / Sanity / Payload)
- Authentication + dashboard (v2) for dynamic editing
- RSS / JSON feed for case studies
- PDF auto-generation for resume snapshots
- i18n (multi-language content layer)

Have an idea? Open an issue or PR.

---

## 🔐 Removed (Legacy Features)

Stripped for simplicity in this static phase:

- Prisma ORM & migrations
- Auth (JWT / sessions / register / login)
- API route handlers
- Admin & dashboard UIs
- Mailer + rate limiting
- Seeding scripts & CLI utilities

All can be reintroduced modularly later (data layer → repository → UI untouched).

---

## 🧪 Testing Strategy

- **Unit**: `npm run test` executes the Vitest suite (use `npm run test -- path/to/file` for a single spec).
- **E2E**: `npm run e2e -- --project=chromium` boots the app via Playwright, logs in through the API, and runs admin smoke tests.
	- Requires seeded content (`npm run db:seed`) and a valid `AUTH_SECRET`.
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

| Area            | File / Path |
|-----------------|-------------|
| Portfolio list  | `src/app/portfolio/page.tsx` |
| Portfolio detail| `src/app/portfolio/[slug]/page.tsx` |
| Data index      | `src/temp-data/index.ts` |
| Project JSON    | `src/temp-data/portfolio/*.json` |
| Experience UI   | `src/sections/home/ExperienceSection.tsx` |
| Recommendations | `src/sections/home/RecommendationsSection.tsx` |
| Navigation      | `src/components/NavSidebar/NavLinks.tsx` |
| Version export  | `src/lib/version.ts` |

---

If you ship a modified fork, consider keeping attribution or a link back. Enjoy building your story.

