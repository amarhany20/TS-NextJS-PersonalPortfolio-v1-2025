# Code Structure

**Last Updated:** 2026-03-26
**Status:** Active

---

## Main Areas

- `src/app/`
  Next.js routes, layouts, pages, and API handlers. Folder README now describes composition,
  routing, and thin-handler expectations.
- `src/components/`
  Reusable UI and admin components, split between shared building blocks and domain/admin UIs.
- `src/sections/`
  Public-page composition blocks.
- `src/server/`
  Server-only services, repositories, serializers, validators, security helpers, and db access.
- `prisma/`
  Schema and seed scripts.
- `data/ammar/`
  Owner-specific content.
- `src/static-content/`
  Fallback/template content and metadata for bootstrap-safe defaults.
- `tests/`
  Unit and Playwright coverage, with the isolated seeded Playwright server treated as the
  authoritative E2E gate.

---

## Alignment Notes

- The repo broadly follows the intended App Router + service/repository architecture.
- Pages and route handlers primarily go through services instead of importing repositories directly.
- Top-level source folders now carry short `README.md` files so local purpose and rules are visible
  where people work.
- Remaining structural cleanup is now incremental: verify more API contracts, keep folder docs in
  sync, and continue retiring legacy setup wording where it appears.

---

## Launch Note

The repo already has a solid structure. Launch work should prioritize cleanup and supported flows,
not broad restructuring.
