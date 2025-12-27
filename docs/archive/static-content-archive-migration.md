# Static Content Archive Migration (Agent E)

Date: 2025-12-17
Status: Completed

> NOTE (2025-12-24): The `backups/static-content-archive/` approach has been decommissioned.
> `src/static-content/*` is now the generic template content (repo-safe defaults), and private owner data lives under `data/ammar/*`.

## Summary
All static, hand-authored portfolio/profile content previously under `src/static-content/**` has been relocated to a dated archive at:

- backups/static-content-archive/2025-12-17
- Manifest: backups/static-content-archive/2025-12-17/manifest.json

Temporary compatibility stubs remain at the original import path so the app and tests continue to work without code changes.

## What moved
- Top-level TypeScript content modules (metadata, personal, education, experience, skills, services, certificates, recommendations, routes, seo, etc.).
- Portfolio JSON files and `portfolio/index.ts` (typed aggregator).

See the full file list in the manifest.

## How it works now
- Runtime imports like `@/static-content/*` still resolve via thin re-export stubs that forward to the archived files.
- Historical note: this document originally advised editing `backups/static-content-archive/...`. That approach is now removed; edit `src/static-content/*` (template) or `data/ammar/*` (private) instead.

## Why
- We’re transitioning to a seed-driven database model. Static content acts as a canonical source for initial seed data and reproducible environments.
- Archiving by date enables traceability and idempotent reseeds.

## Next steps (Agent F)
- Implement `prisma/reset-and-seed-ammar.ts` to read the archive (prefer `manifest.json`) and seed the database.
- Make the seeder idempotent and cover portfolio, experience, skills, certificates, etc.

## After Agent F
- Deprecate direct imports from `@/static-content/*` in application code in favor of DB-backed queries.
- Remove the compatibility stubs when all consumers are migrated.

## Rollback
- Historical note: rollback steps referenced the removed archive folder. Current rollback is simply to revert Git changes affecting `src/static-content/*` and/or `data/ammar/*`.
