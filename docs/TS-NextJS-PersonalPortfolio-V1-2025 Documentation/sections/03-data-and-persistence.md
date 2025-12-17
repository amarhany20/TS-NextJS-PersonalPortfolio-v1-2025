# 3. Data & Persistence

## 3.1 Database Options
| Option | When to Use | Notes |
|--------|-------------|-------|
| SQLite (`prisma/dev.db`) | Default for local dev and single-user deployments | File-based, zero config, backed up via `.db` copy or `.dump`. |
| Neon PostgreSQL | Production, staging, or shared hosting | Configure `DATABASE_URL` during setup wizard; migrations deploy via `npx prisma migrate deploy`. |

Both targets share the same Prisma schema. The wizard records the chosen provider and prevents
re-initialization by creating a `.setup-complete` marker plus Settings row existence checks.

## 3.2 Core Entities
- **Content:** `Portfolio`, `Blog`, `Experience`, `Education`, `Skill`, `Service`, `Certificate`,
  `Recommendation` all include `displayOrder`, `published`, and JSON columns for arrays.
- **System:** `User`, `Settings`, `Media`, `ContactSubmission`, `ContentVersion`.
- **Relationships:** Many-to-many join tables for blog `categories` and `tags` handled by Prisma
  relation tables. `ContentVersion` stores polymorphic snapshots referenced by `contentType` +
  `contentId` compound indexes.

| Model | Purpose | Key Fields |
|-------|---------|------------|
| `User` | Single admin account (session auth) | `username`, `displayName`, `password`, timestamps |
| `Settings` | Global profile, SEO, theme, setup state | `theme`, `maintenanceMode`, `profile*`, `seo*`, `setupCompletedAt` (planned) |
| `Portfolio` | Project listings + detail pages | `slug`, `category`, `technologies`, `features`, `images`, `coverImage`, `published` |
| `Blog` | Posts with categories/tags | `slug`, `content`, `excerpt`, `seo*`, `published`, `publishedAt`, relations |
| `Experience` / `Education` | Career timeline data | `company`/`institution`, date range, `achievements`, `displayOrder` |
| `Skill` | Categorized skills for home/services | `category`, `proficiency`, `icon`, `displayOrder` |
| `Service` | Offerings displayed publicly and in admin | `title`, `shortDescription`, `features`, `pricing`, `published` |
| `Certificate` / `Recommendation` | Credibility artifacts | Issuer details, `skills`, `avatar`, `displayOrder` |
| `Media` | Uploaded assets metadata | `filename`, `publicUrl`, `mimeType`, `size`, optional `width`/`height` |
| `ContactSubmission` | Public form submissions | `name`, `email`, `message`, `ipAddress`, `read` flag |
| `ContentVersion` | Draft/version snapshots | `contentType`, `contentId`, serialized payload, `createdBy` |

## 3.3 Schema Patterns
- JSON columns store arrays (`technologies`, `features`, `achievements`) as stringified JSON to keep
  PostgreSQL compatibility without extra join tables.
- Tiptap HTML fields leverage `@db.Text` for rich text without length caps.
- Indexing strategy prioritizes `published + displayOrder`, `slug`, and `createdAt` for admin stats
  and SSG revalidation speed.
- Version history appends a row before each update so restores can hydrate entire payloads.

## 3.4 Migration & Tooling Workflow
1. Update `prisma/schema.prisma` following naming conventions.
2. Run `npx prisma format` then `npx prisma migrate dev --name <change>`.
3. Commit generated migration (Phase 1 introduced `20251111025935_init`).
4. Regenerate client (`npx prisma generate`) and rerun Vitest suites.
5. For CI/production, run `npx prisma migrate deploy`; seeds execute via `npm run db:seed` to import
   the curated `src/static-content` snapshot.

## 3.5 Static-Content Parity
Phase 1 delivered repositories for portfolio, experience, education, skills, services, certificates,
recommendations, and settings. Public portfolio listing/detail plus home sections already read from
Prisma via services. Outstanding parity tasks from `docs/migration_plan.md`:
- Migrate metadata/SEO ingestion to `SettingsRepository` outputs (currently referencing static files
  for a portion of meta tags).
- Validate empty-state fallbacks by comparing seeded DB snapshots to `static-content` exports.
- Run automated parity audit to confirm no drift before deleting the static data directory in a later
  release.

## 3.6 First-Run Configuration & Editable Settings
- **Setup capture:** The `/setup` wizard persists initial profile, SEO, and theme selections inside
  the `Settings` table. Upcoming migrations add `setupCompletedAt`, `setupVersion`, and
  `databaseProvider` fields so we can track how the instance was provisioned.
- **Editable configuration:** Admin users can revisit `/admin/settings` to update any values
  collected during setup (profile bio, contact info, social links, SEO defaults, maintenance mode,
  theme). These forms call `SettingsService` to ensure type-safe updates and history tracking via
  `ContentVersion` when required.
- **Future extension:** Planned `SetupConfig` table (or extension of `Settings`) will store advanced
  onboarding choices such as wizard completion checklist, optional modules enabled, and asset
  storage preferences, ensuring first-run decisions remain auditable and reversible without manual
  database edits.
