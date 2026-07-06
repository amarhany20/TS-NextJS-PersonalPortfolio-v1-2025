# 1. System Overview

## 1.1 Purpose

TS-NextJS-PersonalPortfolio-v1-2025 is a self-hosted portfolio platform that combines a public
website, a protected admin CMS, and a Prisma-backed content model. Its goal is to let one owner
publish and maintain a professional portfolio without relying on an external CMS service.

## 1.2 Product Shape

The current solution has four main parts:
- **Public website:** `/home`, `/portfolio`, `/services`, `/blogs`, and detail routes for portfolio and blog content.
- **Admin CMS:** `/admin/**` pages for content management, dashboarding, media, contact inbox, theme control, visibility control, setup diagnostics, and site-profile editing.
- **API surface:** `/api/v1/**` route handlers that back admin mutations, auth, media, themes, settings, contact, and diagnostics.
- **Bootstrap and seed path:** env/bootstrap plus Prisma migration and seed flows for first-run initialization.

## 1.3 Primary Users

- **Owner/admin:** Ammar or another single-tenant site owner who edits content, theme, visibility, and basic profile settings.
- **Public visitors:** recruiters, clients, employers, collaborators, or readers consuming the public portfolio and blog.
- **Operator/deployer:** a technical user responsible for environment configuration, migrations, seeding, and deployment.

## 1.4 Supported Scope

| Surface               | Scope Today | Notes                                                           |
| --------------------- | ----------- | --------------------------------------------------------------- |
| Public marketing site | Active      | Uses database-backed content through server-side services.      |
| Admin CMS             | Active      | Covers the launch-critical content domains and settings center. |
| Session auth          | Active      | Single-admin model with iron-session cookies.                   |
| Theme switching       | Active      | Theme preview/apply is persisted in the settings singleton.     |
| First-run bootstrap   | Active      | Env/bootstrap-driven after migrations and supported seed flow.  |
| Multi-user roles      | Not active  | Current implementation is single-admin only.                    |
| Web setup wizard      | Retired     | `/setup` now redirects to `/home`.                              |

## 1.5 Core Journeys

### First Run

1. Configure environment variables.
2. Run Prisma migrations against PostgreSQL.
3. Run a supported seed command.
4. Start the app.
5. Let env/bootstrap ensure the admin user and settings row exist if the tables are present but empty.

### Daily Admin Use

1. Open `/login` and sign in.
2. Land in the admin dashboard at `/admin`.
3. Manage content in the domain pages under `/admin/*`.
4. Adjust site-level values under `/admin/settings/profile`, `/admin/settings/visibility`, `/admin/settings/theme`, and `/admin/settings/setup`.
5. Publish or update content so the public site reflects the latest state.

### Public Visitor Flow

1. Visit `/`, which redirects to `/home`.
2. Explore the home page plus any public pages currently enabled by visibility settings.
3. Open detail pages for portfolio items or blog posts.
4. Use the contact section on `/home#contact` to read contact information or submit to the contact API where supported.

## 1.6 Constraints And Non-Goals

- The launch target is single-tenant and single-admin.
- PostgreSQL is the supported runtime database; there is no active SQLite fallback.
- The public contact experience lives on the home page instead of a dedicated public contact route.
- Static content modules are fallback/bootstrap-aligned content, not the authoritative launch dataset once the DB is seeded.
- Cloud media storage, multi-user roles, richer observability, and broader workflow automation remain post-launch extensions.

## 1.7 Launch-Reality Notes

- The repo is structurally complete enough to document as a full website solution architecture.
- Launch verification is still incomplete and must not be described as fully signed off.
- Current architecture docs must stay tied to verified code and command results, not historical intent.

---

[« Back to Start](../architect.md) | [Next »](02-architecture-layers.md)
