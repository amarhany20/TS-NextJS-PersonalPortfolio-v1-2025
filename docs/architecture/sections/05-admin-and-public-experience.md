# 5. Admin & Public Experience

## 5.1 Public Experience

The public surface is a server-first marketing and portfolio experience.

| Route               | Purpose                  | Main Data Sources                                                                                                         |
| ------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| `/`                 | Canonical entry redirect | Redirects to `/home`                                                                                                      |
| `/home`             | Main landing page        | `SettingsService`, `ExperienceService`, `EducationService`, `RecommendationService`, skill/services data used by sections |
| `/portfolio`        | Portfolio index          | `PortfolioService`, `SettingsService`                                                                                     |
| `/portfolio/[slug]` | Portfolio detail         | `PortfolioService`, `SettingsService`                                                                                     |
| `/services`         | Public services listing  | `ServiceService`, `SettingsService`                                                                                       |
| `/blogs`            | Public blog index        | `BlogService`, `SettingsService`                                                                                          |
| `/blogs/[slug]`     | Blog detail              | `BlogService`, `SettingsService`                                                                                          |
| `/login`            | Admin sign-in entry      | Auth API                                                                                                                  |

The public contact experience is embedded in `/home#contact`, not a standalone public route.

## 5.2 Public Layout Model

- The public shell uses a three-area desktop layout with sidebars and a main content band.
- Mobile collapses this into a single-column experience with drawer-style sidebars and compact navigation.
- Theme tokens, settings-driven profile content, and settings-driven visibility rules feed the public shell.

## 5.3 Admin Experience

The admin is a route-protected CMS that sits under `/admin/**`.

| Route Group                     | Purpose                   | Notes                                                                         |
| ------------------------------- | ------------------------- | ----------------------------------------------------------------------------- |
| `/admin` and `/admin/dashboard` | Dashboard                 | Metrics, quick links, and current-state visibility.                           |
| `/admin/portfolio`              | Project CRUD              | Includes create/edit/delete and reorder support.                              |
| `/admin/experience`             | Experience CRUD           | Timeline management.                                                          |
| `/admin/education`              | Education CRUD            | Timeline management.                                                          |
| `/admin/services`               | Services CRUD             | Includes reorder.                                                             |
| `/admin/blogs`                  | Blog CRUD                 | Draft/publish authoring surface.                                              |
| `/admin/media`                  | Media library             | Upload, preview, copy link, delete.                                           |
| `/admin/contact`                | Contact inbox             | Review and manage submissions.                                                |
| `/admin/certificates`           | Certificates CRUD         | Credential management.                                                        |
| `/admin/recommendations`        | Testimonials CRUD         | Recommendation management.                                                    |
| `/admin/skills`                 | Skills CRUD               | Skill-group management.                                                       |
| `/admin/settings/profile`       | Site profile editing      | Name, role/title, hero copy, email, location, timezone.                       |
| `/admin/settings/visibility`    | Public visibility control | Hide public pages from nav and toggle home sections without deleting content. |
| `/admin/settings/theme`         | Theme preview/apply       | Persisted theme choice.                                                       |
| `/admin/settings/setup`         | Setup diagnostics         | Bootstrap and setup metadata.                                                 |

## 5.4 Admin Shell Principles

- `requireAuth()` protects the admin layout.
- The desktop sidebar is sticky so navigation remains available while content panels scroll.
- Mobile uses a separate collapsible drawer/header pattern.
- Client-side forms call authenticated API routes and show feedback through toast or inline status messaging.

## 5.5 Theme System

- Theme metadata lives under `src/themes/**`.
- The current curated gallery contains seven built-in themes.
- Theme selection is stored in the settings singleton row.
- The active HTML root receives the selected theme through `data-theme`.
- Theme preview/apply is handled in the admin settings center.

## 5.6 Site Profile And Settings Center

The settings center is now a real four-surface admin area:

- **Profile:** site title, role/title, hero copy, contact basics, and timezone.
- **Visibility:** toggle public page exposure and home-page section rendering.
- **Theme:** preview and apply curated themes.
- **Setup:** display bootstrap metadata and supported first-run status.

This settings row also feeds public profile/sidebar content, the hero section, metadata fallbacks, contact section rendering, and page-level public availability.

## 5.7 Media And Contact UX

- Media uploads are handled through the admin library, stored locally, and surfaced as DB-backed metadata.
- Contact submissions enter through the public API surface and are reviewed inside the admin inbox.
- Both domains are part of the launch-scope operational experience, not placeholder modules.

## 5.8 UX Truth Notes

- Do not document a standalone public `/contact` page as active.
- Do not document a web setup wizard as active.
- Do not document broader SEO or maintenance editing screens as active unless they are actually restored.

---

[« Previous](04-api-and-services.md) | [Next »](06-infrastructure-and-operations.md)
