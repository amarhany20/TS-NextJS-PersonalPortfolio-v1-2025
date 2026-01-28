# 7. Security & Compliance

## 7.1 Authentication & Session Handling
- Admin login uses session-based auth powered by `iron-session` with encrypted, HttpOnly cookies.
- `requireAuth()` guard protects `/app/admin/*` layouts and every API route except login and contact.
- Session cookies adopt `secure` + `sameSite=lax` in production and expire after 7 days (sliding).
- Passwords are hashed with `bcrypt` (`SALT_ROUNDS = 12`). Env bootstrap enforces minimum length; V1
  defers stronger complexity rules but tracks them in migration plan (Phase 2 complete).


## 7.2 Authorization & Access Control
- Single admin role for V1. Future multi-user support will extend `User` entity and add role claims
  to the session payload.
- Sensitive admin API routes double-check `session.userId` and optionally inspect feature flags for
  upcoming modules (blog, media, feature locks).


## 7.3 Input Validation & Error Taxonomy
- Every inbound payload runs through server-side Zod schemas stored alongside route handlers or
  reused from `server-validators/api`.
- Custom error classes convert to consistent error responses via `errorResponse()` with structured
  codes that UI layers can translate.
- Contact form, login, and media upload endpoints include rate-limit middleware to mitigate brute
  force and spam.

## 7.4 Data Protection & Compliance
- Neon handles backups per cloud provider policy; use `pg_dump` for manual snapshots.

- Media uploads stored in `public/uploads`. Future enhancements (Phase 5) include optional storage
  provider integrations and virus scanning.
- Maintenance mode ensures public visitors see controlled messaging during migrations or sensitive
  operations.
- Known non-blocking item: TypeScript warning about `import './globals.css'` (documented in
  `docs/MIGRATION_SUMMARY.md`)—safe to ignore but can be silenced via tsconfig tweak.

## 7.5 Monitoring & Incident Handling
- Logging currently relies on Next.js/Node console output. Observability hooks (Sentry, structured
  logging) planned for Phase 7 when CI/CD and release hardening occur.
- Any auth or security regression must be reflected in this section and cross-referenced in
  `docs/CHANGELOG.md` per Ammar Documentation Guideline.
