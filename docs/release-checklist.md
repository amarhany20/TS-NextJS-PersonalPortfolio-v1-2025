# Release Checklist

**Version:** 1.00.00
**Created:** 2026-04-20
**Last Updated:** 2026-04-20
**Author:** Ammar Hany
**Status:** Active
**Tags:** [Release, Verification, Launch]

---

## Overview

This is the active release-signoff guide for the current repo state.

Use it together with the implementation checklist and manual testing guide when preparing a real
launch push.

---

## 1. Data Safety Rules

1. Do not run `npm run e2e` against the launch database.
2. Set a dedicated `PLAYWRIGHT_DATABASE_URL` before isolated E2E if you need to preserve your real
   seeded content.
3. Treat `npm run seed:ammar` as a destructive restore-style operation for a local database, not as
   a harmless smoke-test command.
4. Back up the target database before any reset, reseed, or schema-changing verification pass.

---

## 2. Clean First-Run Verification

1. Configure `.env.local` with `DATABASE_URL`, `AUTH_SECRET`, `NEXT_PUBLIC_SITE_URL`, and the
   `ADMIN_*` bootstrap values.
2. Run `npm install`.
3. Run `npm run prisma:migrate`.
4. Run `npm run db:seed` for generic seeded data, or `npm run seed:ammar` only when you intend to
   restore Ammar-owned launch content into a local database.
5. Run `npm run dev`.
6. Open `/` and confirm the redirect to `/home`.
7. Open `/login` and sign in with the configured admin credentials.
8. Open `/admin/settings/setup` and confirm bootstrap metadata looks correct.

Expected outcome:
- public routes render,
- admin login works,
- settings bootstrap metadata is visible,
- no missing-table or missing-settings bootstrap errors appear.

---

## 3. Safe Verification Commands

Run these commands before release:

```bash
npm run clean
npm run typecheck
npm run lint
npm run format:check
npm run test
npm run build
```

Run isolated E2E only after setting a dedicated test database:

```bash
$env:PLAYWRIGHT_DATABASE_URL="postgresql://...dedicated-test-db..."
npm run e2e
```

If `PLAYWRIGHT_DATABASE_URL` is omitted, Playwright falls back to `DATABASE_URL` and seeds that
database during bootstrap. Do not do that against release data.

---

## 4. Local Database Reset And Restore

Use these only on a local or disposable PostgreSQL database.

### 4.1 Reset local schema and data

```bash
npx prisma migrate reset
```

This is destructive. It clears local data and reruns migrations.

### 4.2 Restore generic seeded content

```bash
npm run db:seed
```

### 4.3 Restore Ammar launch content locally

```bash
npm run seed:ammar
```

Use this when you explicitly want your owner dataset restored into a local database.

### 4.4 Restart the database

The repo does not manage the PostgreSQL service lifecycle for you. Restart the database through your
provider or local PostgreSQL service manager, then rerun the app and verification commands.

---

## 5. Manual Launch Verification Flow

Use [docs/architecture/sections/10-manual-testing-guidelines.md](./architecture/sections/10-manual-testing-guidelines.md)
as the deep test script.

Minimum release-day flow:

1. Open `/home`, `/portfolio`, `/services`, and `/blogs`.
2. Confirm launch content, metadata, and links look correct.
3. Sign in at `/login`.
4. Open `/admin` and verify dashboard, setup diagnostics, and theme pages.
5. Exercise one safe CRUD flow in each launch-critical admin domain on a non-production copy of the
   database.
6. Spot-check reorder behavior for services and portfolio specifically if you changed seeded order
   data or UI wiring since the last isolated verification.
7. Check browser console and server output for unexpected errors.
8. Confirm no placeholder text, demo content, or incorrect social preview data remains.

---

## 6. Corner Cases To Cover

1. Signed-out access to `/admin` redirects to `/login`.
2. Invalid login shows a clear error and does not create a session.
3. Empty-state pages render intentionally when no published content exists.
4. Publish and unpublish states change public visibility correctly.
5. Reorder actions persist after refresh.
6. Media upload rejects unsupported files and allows expected file types.
7. Theme selection persists after refresh.
8. Contact details render only when configured; no fallback template email should leak.
9. SEO metadata, canonical URL, and Open Graph image resolve to the real launch site values.

---

## 7. Release Gate

Do not push as production-ready until all of the following are true:

- safe verification commands are green,
- isolated E2E has been rerun against a dedicated test database,
- reorder flows are verified,
- public metadata and SEO values are reviewed,
- launch content is reviewed against the real seed data,
- manual launch verification is completed,
- documentation and code still agree.

Current repo truth on 2026-04-20:
- typecheck, lint, format check, unit tests, and build are green,
- targeted isolated Playwright verification for admin services and portfolio now includes reorder
   coverage against a dedicated `PLAYWRIGHT_DATABASE_URL` schema,
- the full isolated E2E suite still needs a final rerun against a dedicated test database before
   production signoff,
- production signoff is still blocked by the remaining manual/content/metadata/release checks above.

---

## 8. Changelog

| Version | Date       | Author     | Affected Files            | Description                                                       |
| ------- | ---------- | ---------- | ------------------------- | ----------------------------------------------------------------- |
| 1.00.00 | 2026-04-20 | Ammar Hany | docs/release-checklist.md | Added the active release-signoff guide for the current repo flow. |