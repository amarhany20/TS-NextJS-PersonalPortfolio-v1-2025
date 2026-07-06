# 3. Data & Persistence

## 3.1 Database Baseline

| Option     | When To Use                    | Notes                                                                                                           |
| ---------- | ------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| PostgreSQL | Local, staging, and production | The active Prisma datasource is PostgreSQL and the repo no longer documents SQLite as a supported runtime path. |

The supported setup flow is migration plus bootstrap/seed, not the retired web setup wizard.

## 3.2 Content Source Precedence

The current data model uses three source tiers:

1. **Database content:** the primary runtime source for public and admin views.
2. **Env/bootstrap defaults:** first-run values for the settings row and admin account.
3. **Static TypeScript content:** seed-aligned fallback content in `src/static-content/**` and owner-specific content in `data/ammar/**`.

Once the database is seeded, the DB is the authoritative content source for launch behavior.

## 3.3 Core Models

| Model                  | Purpose                           | Key Fields                                                                                                       |
| ---------------------- | --------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `User`                 | Bootstrap/admin identity          | `username`, `email`, `displayName`, `passwordHash`, `role`, `status`                                             |
| `Settings`             | Singleton site-wide configuration | `siteTitle`, `siteSubtitle`, `hero*`, `primaryEmail`, `location`, `theme`, `maintenanceMode`, `setupCompletedAt` |
| `Portfolio`            | Public portfolio projects         | `slug`, `title`, `tagline`, `summary`, `featured`, `displayOrder`, `published`                                   |
| `Blog`                 | Public blog posts                 | `slug`, `title`, `content`, `status`, `publishedAt`, SEO metadata                                                |
| `Category` / `Tag`     | Blog taxonomy                     | `slug`, `name`                                                                                                   |
| `Experience`           | Career timeline entries           | `company`, `title`, `startDate`, `endDate`, `displayOrder`, `published`                                          |
| `Education`            | Education timeline entries        | `institution`, `degree`, `startDate`, `endDate`, `displayOrder`, `published`                                     |
| `SkillGroup` / `Skill` | Public/admin skill organization   | `slug`, `title`, `summary`, `displayOrder`, skill grouping                                                       |
| `Service`              | Public offerings                  | `slug`, `title`, `description`, `technologies`, `active`, `displayOrder`                                         |
| `Certificate`          | Credentials and awards            | `name`, `issuer`, `issuedOn`, `skills`, `displayOrder`                                                           |
| `Recommendation`       | Testimonials/references           | `name`, `company`, `content`, `receivedOn`, `displayOrder`, `published`                                          |
| `Media`                | Uploaded file metadata            | `filename`, `publicUrl`, `mimeType`, `size`, optional dimensions                                                 |
| `ContactSubmission`    | Public contact submissions        | `name`, `email`, `message`, `status`, `createdAt`                                                                |
| `ContentVersion`       | Audit/version snapshots           | `contentType`, `contentId`, `version`, `payload`, `createdById`                                                  |

## 3.4 Schema Patterns

- JSON-like lists are stored in string columns and normalized through serializers and helpers.
- Ordering is persisted through `displayOrder` rather than inferred from timestamps.
- Visibility differs by domain: some models use `published`, blog uses `status`, and services use `active`.
- Slugs are the public identity for portfolio, blog, services, skill groups, categories, and tags.
- The settings row is a singleton abstraction in application logic even though the Prisma model is a normal table row.

## 3.5 Bootstrap, Seeds, And Editable Settings

- `EnvBootstrapService` creates or repairs the settings singleton and bootstrap admin user when required.
- `npm run db:seed` loads the template-safe default dataset from `src/static-content/**`.
- `npm run seed:ammar` loads the owner-specific dataset from `data/ammar/**`.
- The active settings editing surface now includes:
  - `/admin/settings/profile`
  - `/admin/settings/visibility`
  - `/admin/settings/theme`
  - `/admin/settings/setup`
- Page and home-section visibility preferences are currently stored inside the settings singleton's SEO defaults JSON and normalized through the settings serializer.

## 3.6 Migration Workflow

1. Update `prisma/schema.prisma`.
2. Format the schema.
3. Create a Prisma migration for intentional schema changes.
4. Regenerate Prisma client as needed.
5. Rerun the relevant checks.
6. Use `prisma migrate deploy` in CI/production.

The repo should not rely on `db push` as the long-term source-of-truth path once formal migrations exist.

## 3.7 Media Persistence

- The active storage driver persists uploaded files under `public/uploads/**` and records metadata in Prisma.
- Public URLs are derived from persisted metadata, while the actual binary storage remains filesystem-based in the current implementation.
- Cloud object storage is a future extension, not the launch-default behavior.

## 3.8 Data Truth Rules

- Treat Prisma schema and active repositories/services as the implementation truth.
- Treat static content as fallback/bootstrap truth only where the runtime path explicitly uses it.
- Keep architecture docs aligned whenever the source-of-truth boundaries change.

---

[« Previous](02-architecture-layers.md) | [Next »](04-api-and-services.md)
