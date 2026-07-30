# Contributing to TS-NextJS-PersonalPortfolio-v1-2025

Thanks for your interest in contributing. This is a single-admin, self-hosted
portfolio template. Contributions that improve the template, fix bugs, or
broaden the supported feature surface are welcome.

## Ground Rules

- Read [`AGENTS.md`](./AGENTS.md) and [`.github/copilot-instructions.md`](./.github/copilot-instructions.md) before opening a PR.
- Keep code, docs, and the launch checklist in sync in the same PR.
- One change set per PR — split unrelated fixes.
- Do not introduce a web setup wizard, multi-user roles, or a SQLite fallback
  without an explicit, prior issue discussion. These are deliberate non-goals.

## Development Setup

```bash
git clone https://github.com/amarhany20/TS-NextJS-PersonalPortfolio-v1-2025.git
cd TS-NextJS-PersonalPortfolio-v1-2025
npm install
cp .env.example .env.local
# Fill in DATABASE_URL, AUTH_SECRET, and the ADMIN_* bootstrap variables.
npm run prisma:migrate
npm run db:seed
npm run dev
```

The supported first-run path is **env + bootstrap-driven**. `/setup` is only a
backwards-compatible redirect to `/home`.

## Verification Commands

Run these locally before opening a PR. Do not mark a PR ready unless each
command passed in your environment.

```bash
npm run typecheck
npm run lint
npm run format:check
npm run test
npm run build
npm run clean    # if routes or generated Next output changed
```

End-to-end tests use Playwright and require PostgreSQL:

```bash
PLAYWRIGHT_DATABASE_URL=postgresql://... npm run e2e
```

The isolated Playwright server defaults to `http://127.0.0.1:3100` so it does
not collide with `npm run dev` on `3000`.

## Code Style

- TypeScript strict mode. No `any` (enforced by ESLint).
- Follow the layered flow: `Route/Page -> Service -> Repository -> Serializer/Response`.
- Never import `@/server/*` from a client component.
- Validate all API input with Zod at the boundary
  (`src/server/server-validators/**`).
- Use typed env access from `src/server/server-validators/env.ts` instead of
  raw `process.env` in active server code.
- Server components by default; mark `use client` only when interactivity
  requires it.

## Documentation Style

- Update the relevant `README.md` in the folder you touched.
- Add or update a short entry in
  `TS-NextJS-PersonalPortfolio-v1-2025 Technical Docs/09-implementation-checklist.md`
  if the PR closes a tracked item.
- Update `AGENTS.md` if your change affects repo-reality, commands, or
  architecture rules, and append a changelog row.

## Pull Request Process

1. Fork and create a topic branch: `git checkout -b short-topic`.
2. Make focused commits.
3. Push the branch and open a PR against `main`.
4. Fill in the PR template (what / why / how verified / docs).
5. Wait for a maintainer review. Expect at least one round of review.

## Reporting Issues

Use the GitHub issue templates. For security issues, follow
[`SECURITY.md`](./SECURITY.md) instead of opening a public issue.
