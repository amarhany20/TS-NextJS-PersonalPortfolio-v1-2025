# 5. Admin & Public Experience

## 5.1 Layout Principles
- Three-area grid (`ProfileSidebar`, main content, `NavSidebar`) on desktop collapses to a single
  column on mobile with drawers for navigation and profile metadata.
- Tailwind utility grid: mobile `grid-cols-1`; desktop
  `grid-cols-[minmax(240px,18vw)_1fr_minmax(60px,6vw)]` to honor Ammar Next.js Engineering Standard.
- Semantic HTML (`aside`, `nav`, `main`) plus accessible aria labels, focus management, and keyboard
  ordering are mandatory for all sections.

## 5.2 Theme System
- Theme registry under `src/themes` exposes metadata (colors, previews, author, version).
- Each theme ships isolated layouts, components, and CSS tokens; switching themes updates CSS
  variables via `<html data-theme>`.
- Admin settings expose preview cards with apply + preview actions; theme choices persist in
  `Settings.theme`.
- Theme 1 (Professional Dark) is live. Theme 2 (Modern Gradient) and Theme 3 (Minimal Light) are
  planned with their own component directories, typography scales, and motion presets so adopters
  can switch entire experiences without editing code. Theme-specific tokens live in
  `src/themes/<theme>/styles/theme.css`, and shared primitives (buttons, badges) stay under
  `src/components/UI` for reuse.

## 5.3 Admin Dashboard Scope
- Protected via `requireAuth()` in `/app/admin/layout.tsx`.
- Navigation covers dashboard overview, CRUD sections for every entity, reordering interfaces,
  media library, contact inbox, and settings (general, theme, maintenance, account).
- Forms use React Hook Form + Zod resolvers; rich text editing handled by Tiptap.
- Services now ship a production-ready drag-and-drop reorder board powered by `@dnd-kit`. The UI
  renders in `/admin/services`, talks to `POST /api/v1/services/reorder`, and supports pointer,
  touch, and keyboard sensors (space/enter to pick up, arrows to move, enter/space to drop). Every
  change is persisted through `ServiceService.reorderServices` so the public site immediately honors
  the new `displayOrder` values. Reusable patterns from this work will seed future reorder boards
  (portfolio, experience, skills) without rebuilding interaction logic.

## 5.4 Media Library & Assets
- Media uploads now flow through `MediaService` + `MediaRepository` using a storage driver
  abstraction (`MEDIA_STORAGE_DRIVER`). The local driver persists buffers to
  `public/uploads/<year>/<month>/` and stores metadata (size, mimeType, dimensions, checksum) in
  Prisma.
- Validation enforces ≤10 MB per file, allows whitelisted MIME families (images, MP4, PDF), and
  captures width/height for image previews via `image-size`.
- `/admin/media` renders the `MediaLibrary` client component, giving admins upload controls, inline
  metadata, copy-link actions, previews (lightbox for images), and delete confirmations backed by
  `DELETE /api/v1/media/{id}`.
- Future Phase 5 milestones focus on plugging in alternative storage providers (S3, R2, etc.) by
  swapping the storage driver and surfacing cloud URLs in the same UI.

## 5.5 Public Pages
- `/` (Home) assembles hero, experience, education, skills, recommendations, and CTA components
  using async server components backed by Prisma services.
- `/portfolio` + `/portfolio/[slug]` leverage `PortfolioService` and theme-specific galleries; slug
  uniqueness enforced by services.
- `/services`, `/blogs`, `/blogs/[slug]`, `/contact`, `/login` complete the customer-facing surface.
- SEO metadata (routes, seo, metadata static files) rewired to Prisma-backed settings as part of
  outstanding parity tasks.

## 5.6 Page & Module Inventory
| Area | Route(s) | Data Source | Notes |
|------|----------|-------------|-------|
| Setup wizard | `/setup` multi-step | `Settings`, `SetupService`, env validation | Runs until `setupCompletedAt` is set; handles DB selection, admin creation, theme + profile capture. |
| Home | `/` | `SettingsService`, `ExperienceService`, `EducationService`, `PortfolioService`, `RecommendationService` | Async server components feed hero, stats, carousels. |
| Portfolio | `/portfolio`, `/portfolio/[slug]` | `PortfolioService` | Grid/list plus detail pages with galleries, badges, metadata. |
| Services | `/services` | `ServiceService`, `SettingsService` | Cards with pricing, features, CTAs. |
| Blog | `/blogs`, `/blogs/[slug]` | `BlogService`, `CategoryService`, `TagService` | Draft/publish, read-time, related posts. |
| Contact | `/contact` | `ContactSubmissionService` + email/webhook (future) | Public form with rate limiting, admin inbox visibility. |
| Admin dashboard | `/admin/dashboard` | Aggregated counts from repositories | KPIs, quick actions, parity alerts (Phase 4). |
| Admin CRUD | `/admin/<module>` | Corresponding services | Consistent table + form templates with reorder experiences. |
| Media manager | `/admin/media` | `MediaService` | Uploads, metadata, preview/delete, future cloud abstraction. |
| Settings center | `/admin/settings/*` | `SettingsService` | General profile, theme, maintenance, account, and upcoming setup-history editor. |

## 5.7 First-Run Configuration & Settings Editing
- The setup wizard captures database choice, admin credentials, theme, profile, SEO, and contact data
  up front. All values live in `Settings` so the information is editable later.
- After completion, `/admin/settings` presents tabs for General (profile/contact), Theme, Metadata,
  Maintenance Mode, and Account. Editing these tabs reuses the same validators as the wizard and
  writes back through `SettingsService` to keep parity between onboarding answers and ongoing
  configuration.
- Planned enhancements include a Setup History panel that surfaces timestamps, wizard version, and a
  "Re-run wizard" action guarded by permissions. This ensures first-run configuration stays
  traceable and revisitable without DB edits.

## 5.8 Theme QA Checklist (Phase 5+)
1. **Registry sanity:** Load `/admin/settings/theme` and confirm each card renders the declared `previewGradient`, badge tags, and version metadata from `src/themes/index.ts`.
2. **Preview path:** Click *Preview* on every theme. Ensure the transient preview banner appears, `document.documentElement.dataset.theme` updates, and canceling restores the persisted theme.
3. **Apply path:** Use *Apply theme* then refresh the page; verify the persisted choice flows through `SettingsService.getThemeTokens()` into `app/layout.tsx` CSS variables (inspect computed styles for `--background`, `--accent-primary`, etc.).
4. **Visual spot-check:** Run `npm run dev`, visit `/`, `/portfolio`, `/services`, `/blogs`, and `/admin`. Compare against saved screenshots (capture + store under `/public/attachments/theme-baseline/` when missing) so regressions are easy to diff. Validate focus states, nav/sidebar contrast ratios ≥ 4.5:1, and button text legibility over gradients.
5. **Regression sweep:** Re-run `npm run lint` and `npm run test` after theme changes to catch CSS token typos surfacing as ESLint + Vitest failures. Document anomalies and fixes in `docs/CHANGELOG.md` + Section 09 roadmap when discovered.
