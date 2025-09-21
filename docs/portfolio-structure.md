# Portfolio / Case Study Structure

This project implements a static-first but future-ready portfolio (case study) system. Data lives in TypeScript for now (`src/data/portfolio.ts`) with strong domain typing (`src/types/portfolio.ts`). Later it can migrate to MDX, a headless CMS, or database with minimal refactor.

## Domain Types
Defined in `src/types/portfolio.ts`:
- `ProjectCaseStudy`: Full rich case study
- `ProjectMeta`: Operational metadata (status, visibility, access, stack, timelines, role, features, etc.)
- `ProjectGalleryItem`: Image assets (future: video / embed support)
- `ProjectContentSection`: Narrative blocks (overview, architecture, outcomes, etc.)
- `ProjectListItem`: Lightweight projection used for listing (derived via `deriveListItem`)

Key enums/flags:
- `visibility`: `public | private | internal`
- `access`: `open-source | proprietary | client-owned`
- `status`: `planning | in-progress | live | archived`

## Data Source
File: `src/data/portfolio.ts`
Exports:
- `portfolio`: Array of `ProjectCaseStudy`
- `findProject(slug)` helper

Loaders added to `src/data/index.ts`:
- `projectCaseStudies()` → full array
- `projectList()` → derived lightweight listing
- `projectBySlug(slug)` → lookup

## Routes
- Listing: `app/portfolio/page.tsx` (uses `projectList()`)
- Detail: `app/portfolio/[slug]/page.tsx` (uses `projectBySlug()` + static params)

## Reusable Components
Located under `src/components/Portfolio/`:
- `ProjectBadges` – status / visibility / access tokens
- `ProjectMetaGrid` – side metadata panel with features, stack, timeline (duration formatting via `formatProjectDuration`)
- `ProjectGallery` – accordion + horizontal swipe container (simple, dependency-free)

## Adding a New Project
1. Open `src/data/portfolio.ts`.
2. Duplicate an existing object in the `portfolio` array.
3. Choose a unique `slug` (kebab-case).
4. Fill minimal required fields:
   - `title`, `tagline`, `intro`, `summary`
   - `meta`: `visibility`, `access`, `status`, `start`, `role`, `stack[]`, `features[]`
   - At least one section in `sections[]` with unique `id` + incremental `order`.
5. (Optional) Add `gallery` items. Place images under `public/images/portfolio/<project>/...`.
6. (Optional) Add `seo` overrides.
7. Keep timestamps (`createdAt`, `updatedAt`) as ISO strings (can generate with `new Date().toISOString()`).

## Future Migration Strategy
- MDX: Replace `body: string` in `ProjectContentSection` with MDX imports; loader can hydrate compiled content.
- CMS/DB: Map DB rows or API payloads into the same `ProjectCaseStudy` shape; UI untouched.
- Image Optimization: Swap plain `gallery.image` paths with an asset manifest or metadata (dimensions, blur placeholder).
- Rich Blocks: Introduce `type` discriminator in `ProjectContentSection` (e.g., `markdown`, `metrics`, `quote`, `code`).

## Design & UX Notes
- Listing card focuses on quick scanning: badges + tagline + trimmed intro + top stack tokens.
- Case study page emphasizes narrative first, visuals second (gallery after sections).
- Confidential notes only appear if provided (e.g., NDA context).

## Utilities
- `formatProjectDuration(start, end?)` in `src/utils/helpers.ts` yields compact `1y 3m` style durations.

## Best Practices Followed
- Separation of data layer & presentation
- Strong TypeScript contracts for future migration
- Minimal UI coupling (components consume shaped data only)
- Static params for detail routes enabling pre-render

## TODO Ideas (Optional Enhancements)
- Add `generateMetadata` for per-project SEO
- Introduce filtering (status/visibility/access) on listing
- Add swipe gestures (pointer events) for gallery
- Add lightbox modal viewer
- Provide MDX pipeline for sections

---
Feel free to extend this documentation as the system evolves.
