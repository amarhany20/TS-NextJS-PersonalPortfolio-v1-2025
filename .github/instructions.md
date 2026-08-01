# Contributor Instructions

This repository follows Ammar's documentation and engineering standards. Every change must keep
code, docs, and launch tracking in sync.

## 1. Required Standards

- Read `AGENTS.md` first, then `.github/copilot-instructions.md`.
- Read the relevant top-level folder `README.md` files under `src/**` before changing that area.
- Track launch/roadmap work in `AGENTS.md` and this repo's issue tracker.

## 2. Environment Setup

1. Clone the repo.
   ```bash
   git clone <your-repo-url>
   cd TS-NextJS-PersonalPortfolio-v1-2025
   ```
2. Install dependencies.
   ```bash
   npm install
   ```
3. Configure environment variables.
   - Copy `.env.example` to `.env.local`.
   - Set `DATABASE_URL`, `AUTH_SECRET`, and the `ADMIN_*` bootstrap variables.
   - Use PostgreSQL-compatible connection strings; the active Prisma datasource is not SQLite.
4. Provision the database.
   ```bash
   npx prisma generate
   npx prisma migrate dev
   npm run db:seed
   ```
5. Start developing.
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000`, which redirects to `/home`.

## 3. Supported Bootstrap Flow

- The supported first-run path is env/bootstrap-driven.
- `/setup` is retained only as a backwards-compatible redirect surface.
- Do not reintroduce the retired web setup wizard or `setup:first-run` script flow.
- Confirm `/login`, `/admin`, and `/admin/settings/setup` after migrations and seeding.

## 4. Verification Commands

Use the scripts in `package.json` as the command source of truth:

```bash
npm run typecheck
npm run lint
npm run format:check
npm run test
npm run build
npm run e2e
```

Run `npm run clean` before verification when route files or generated Next output changed.

## 5. Development Workflow

- Use server components by default; mark components `use client` only when interactivity requires it.
- Keep the layered flow: Route/Page -> Service -> Repository -> Serializer/Response.
- Keep API route handlers thin: validate input, enforce auth, delegate to services, return shared
  response helpers.
- Use typed env access from `src/server/server-validators/env.ts` instead of scattered raw
  `process.env` usage in active server code.
- Admin-only routes require `requireAuth()`.
- Keep public content, metadata, and docs aligned with the database-backed CMS flow; static content
  is fallback/bootstrap data, not the primary launch content source.

## 6. Content & Layout Guardrails

- `ProfileSidebar` and `NavSidebar` stay server-driven where possible and collapse cleanly on mobile.
- Extend CSS variables and theme metadata deliberately instead of scattering hard-coded values.
- Semantic HTML and accessible labels are non-negotiable. Audit alt text, aria labels, keyboard
  flows, and focus order when editing UI.

## 7. Documentation Sync

- Update active docs in the same pass as behavior, setup, route, command, or verification changes.
- Prefer updating canonical docs over creating duplicate narratives.
- Archive stale material instead of leaving conflicting active guidance.
- Do not mark launch-ready until the implementation checklist, automated checks, manual verification,
  public content, metadata, and release docs all agree.
