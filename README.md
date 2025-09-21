
# Personal Portfolio (Next.js 15 + TypeScript)

Open-source, static-first developer portfolio showcasing projects (case studies), experience, education, skills, certificates, services, recommendations, and contact information. Designed for speed, maintainability, future extensibility (MDX / CMS / DB), and clean developer ergonomics.

Version: `00.50.04` • Stack: **Next.js 15 / React 19 / TypeScript / Tailwind (vars)**

---

## ✨ Highlights

- **Static-First Architecture**: All content sourced from structured TypeScript & JSON under `src/temp-data` (easily migrates later).
- **Portfolio Case Studies**: Featured + non-featured project separation with detail pages at `/portfolio/[slug]` (was `/projects`).
- **Clean Domain Typing**: Strong TypeScript contracts in `src/types` (simplified, legacy `database.ts` removed).
- **Responsive & Accessible**: Mobile-first layout, collapsible experience cards, semantic HTML, keyboard-safe toggles.
- **Performance-Oriented**: Prerendered pages (SSG), minimal client JS, icon package optimized via `optimizePackageImports`.
- **Redirects Included**: Legacy `/projects` → `/portfolio` via `next.config.ts` permanent redirects.
- **Future-Ready Path**: Clear migration strategy to MDX, CMS, or database without rewriting UI.
- **Modular Components**: Reusable UI in `src/components` (Portfolio, ProfileSidebar, NavSidebar, HomePage sections, Services, etc.).

---

## 📁 Key Structure

```
src/
├─ app/
│  ├─ layout.tsx                # Global shell
│  ├─ page.tsx                  # Home landing
│  ├─ portfolio/                # Portfolio listing + dynamic case study pages
│  │  ├─ page.tsx               # /portfolio listing
│  │  └─ [slug]/page.tsx        # /portfolio/[slug] detail
│  ├─ services/page.tsx         # Services overview
│  ├─ blogs/page.tsx            # Blog placeholder (future expansion)
│  └─ home/page.tsx             # (Alternate home view)
├─ components/
│  ├─ Portfolio/                # Project badges, meta grid, gallery
│  ├─ ProfileSidebar/           # Avatar, skills, languages, contact
│  ├─ NavSidebar/               # Navigation + social links
│  ├─ HomePage/                 # Section partials (Experience, Education, etc.)
│  └─ Services/                 # ServiceCard & related UI
├─ sections/home/               # Higher-order sections (Experience, Recommendations...)
├─ temp-data/                   # Static data sources (experience, portfolio, skills...)
│  └─ portfolio/                # Per-project JSON definitions
├─ types/                       # Domain models (experience, portfolio, service, skill...)
├─ utils/                       # Helpers (duration formatting, etc.)
├─ lib/                         # Version export & light utilities
└─ public/                      # Images, PDFs (certs, CV, letters), SVGs
```

See `docs/portfolio-structure.md` for a deeper dive into the portfolio content model.

---

## 🧩 Data Model Overview

| Domain         | Source                                   | Notes |
|---------------:|------------------------------------------:|------:|
| Portfolio      | `src/temp-data/portfolio/*.json` + index | Featured flag, metadata, sections, gallery |
| Experience     | `src/temp-data/experience.ts`            | Collapsible cards, achievements, skills array |
| Education      | `src/temp-data/education.ts`             | Start/end dates, computed duration |
| Skills         | `src/temp-data/skills.ts`                | Categorized or flat list consumed in sidebar |
| Certificates   | `src/temp-data/certificates.ts`          | PDF links stored under `public/attachments/` |
| Recommendations| `src/temp-data/recommendations.ts`       | Safe external + PDF link handling |
| Services       | `src/temp-data/services.ts`              | Toggleable cards similar to Experience |
| Personal Meta  | `src/temp-data/personal.ts`              | Name, title, location, contact/social |

Add or refactor data by mirroring existing shapes. Since everything is compiled at build time, no runtime API is needed.

---

## 🔁 Route Migration (Projects → Portfolio)

The public-facing portfolio listing was renamed:

- Old: `/projects` & `/projects/[slug]`
- New: `/portfolio` & `/portfolio/[slug]`
- Permanent redirects defined in `next.config.ts` so old links still resolve.

Update any external bookmarks to the new path when convenient.

---

## 🚀 Getting Started

```bash
git clone https://github.com/amarhany20/TS-NextJS-PersonalPortfolio-v1-2025.git
cd TS-NextJS-PersonalPortfolio-v1-2025
npm install
npm run dev
```

Open http://localhost:3000

Production build:
```bash
npm run build
npm start
```

Clean & rebuild (Windows safe):
```bash
npm run rebuild
```

---

## 🛠️ Customization Guide

1. Branding Assets: Replace images in `public/` (avatar, logos, gallery images). Keep paths consistent with data entries.
2. Portfolio Items: Duplicate a JSON file in `src/temp-data/portfolio/` and adjust fields (`slug`, `title`, `summary`, `meta`, `sections`, `gallery`). Ensure unique `slug`.
3. Experience: Edit `src/temp-data/experience.ts` — keep `id` stable for React keys.
4. Skills: Update `src/temp-data/skills.ts` (avoid unnecessary nesting; keep names concise).
5. Certificates & Letters: Drop PDFs into `public/attachments/` and reference relative paths.
6. Navigation: Controlled by `NavLinks` in `src/components/NavSidebar/NavLinks.tsx`.
7. Theming: Global colors & tokens live in `src/app/globals.css` (CSS variables). Adjust semantic tokens, not raw utility classes when possible.
8. SEO (Future): Add `generateMetadata` exports to page routes or create a metadata helper.

---

## 🧪 Quality & Conventions

- Type Safety: No `any` (enforced by ESLint). Consolidated domain types (removed legacy `database.ts`).
- Accessibility: Avoid nested anchors (fixed in recommendations section); toggle buttons expose `aria-expanded`.
- Performance: Static generation + minimal client interactivity; large assets manually curated.
- Imports: Optimized for `lucide-react` via experimental `optimizePackageImports` flag.

---

## ⚙️ Scripts (package.json)

| Script            | Purpose |
|-------------------|---------|
| `dev`             | Start development server |
| `dev:turbopack`   | Dev using Turbopack experiment |
| `dev:webpack`     | Explicit Webpack dev (fallback) |
| `build`           | Production build (SSG) |
| `start`           | Serve production build |
| `lint`            | ESLint + type-aware rules |
| `clean`           | Remove build + cache artifacts |
| `rebuild`         | Clean then build |

No database, seed, or auth scripts are present in this static iteration.

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

## 🧪 Testing Strategy (Future Suggestion)

Currently manual + visual verification. Suggested next steps:
- Add unit tests for helpers in `src/utils`.
- Snapshot test portfolio rendering.
- Validate JSON schema for portfolio items using `zod` at build time.

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

