# Contributor Instructions

This repository follows Ammar's documentation and engineering standards. Every change must keep
code, docs, and data in sync.

## 1. Required Standards
- Read `docs/TS-NextJS-PersonalPortfolio-V1-2025 Documentation/architecture.md` before touching code.
- Follow `docs/helper_docs/Ammar Documentation Guideline/` when authoring markdown.
- Apply patterns from `docs/helper_docs/NextJS Coding Guideline/` across App Router features.
- Review `docs/helper_docs/Ammar Agents Guideline/ammar-agent-operations-guideline-v1.00.00.md` each
  session (commit discipline, version bumps, documentation alignment).
- Keep `docs/migration_plan.md` and `docs/MIGRATION_SUMMARY.md` accurate when scope changes.

## 2. Environment Setup
1. Clone the repo
   ```bash
   git clone <your-repo-url>
   cd TS-NextJS-PersonalPortfolio-v1-2025
   ```
2. Install dependencies
   ```bash
   npm install
   ```
3. Configure environment vars
  - Copy `.env.example` to `.env.local`.
  - Set `AUTH_SECRET` (32+ chars), `DATABASE_URL`, and any provider keys noted in docs.
4. Provision the database (SQLite by default)
   ```bash
   npx prisma generate
   npx prisma migrate dev
   npm run db:seed
   ```
   Use `scripts/setup-database.sh` for one-command setup locally or in CI/CD.
5. Start developing
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000` (App Router). Use `npm run lint`, `npm run test`, and
   `npm run test:e2e` before opening a PR.

## 3. Database Operations
### 3.1 Backup
```bash
cp prisma/dev.db backup/portfolio-backup-$(date +%Y%m%d).db
sqlite3 prisma/dev.db .dump > backup/portfolio-backup-$(date +%Y%m%d).sql
```

### 3.2 Restore
```bash
cp backup/portfolio-backup-YYYYMMDD.db prisma/dev.db
sqlite3 prisma/dev.db < backup/portfolio-backup-YYYYMMDD.sql
```

### 3.3 Troubleshooting
- `npx prisma migrate dev` fixes missing database files.
- `npx prisma generate` rebuilds the client.
- `npx prisma migrate reset` (dev only) recreates schema and reruns seeds.
- Launch Prisma Studio with `npm run db:studio`; reset scripted via `npm run db:reset`.

## 4. Development Workflow
- Use SSR/SSG first. Mark components `use client` only when interactivity is mandatory.
- Keep layout responsive (grid/flex + Tailwind). Avoid fixed pixels except avatars/icons.
- Reuse primitives from `src/components`, shared helpers from `src/server`, and keep assets under
  `public/`.
- Validate at every boundary: client validators (`src/client-validators`), API validators
  (`src/server/server-validators`), and service-level business rules.
- Follow the server stack pattern: Route → Controller/Handler → Service → Repository → Serializer.
- Admin-only routes require `requireAuth()`. Update session helpers if cookie policies change.
- Media uploads live in `public/uploads/<year>/<month>/`. Persist metadata through
  `MediaRepository`.

## 5. Content & Layout Guardrails
- ProfileSidebar (left) and NavSidebar (right) stay server-driven on desktop, collapse on mobile.
- Grid defaults: mobile `grid-cols-1`; desktop
  `grid-cols-[minmax(240px,18vw)_1fr_minmax(60px,6vw)]`.
- `globals.css` defines CSS variables—extend tokens there before using hard-coded colors.
- Semantic HTML and accessible labels are non-negotiable. Audit alt text, aria labels, and focus
  order when editing UI.

## 6. Support Links
- Prisma docs: <https://www.prisma.io/docs>
- Database GUI: `npm run db:studio`
- Contact project maintainer before altering documented architecture or migration scope.
