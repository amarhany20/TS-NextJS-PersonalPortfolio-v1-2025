# 7. Security & Compliance

## 7.1 Authentication Model

- Admin authentication is session-based through `iron-session`.
- The login route accepts username/password and persists an encrypted server-side session cookie.
- Passwords are hashed with bcrypt-compatible hashing before storage.

## 7.2 Authorization Model

- The active release scope is single-admin.
- `/app/admin/layout.tsx` enforces auth for the admin UI.
- Protected API routes also call `requireAuth()`.
- Public routes and selected public APIs remain unauthenticated by design.

## 7.3 Session And Cookie Rules

- Cookies are `HttpOnly` and `SameSite=lax`.
- Production uses secure cookies.
- Isolated Playwright HTTP test environments can relax secure-cookie enforcement so local browser automation still works against non-HTTPS test origins.
- Session lifetime is bounded and intended for admin-console usage, not public consumer identity.

## 7.4 Input Validation And Error Safety

- Server-side Zod validation is required at the API boundary.
- Client validation improves UX but does not replace server enforcement.
- Errors are mapped into a consistent application error envelope so clients do not need to parse ad hoc failures.
- Validation, not-found, unauthorized, and conflict paths are all part of the expected contract.

## 7.5 Rate Limiting And Abuse Controls

- Auth login is rate-limited.
- Public contact submission is rate-limited.
- Additional endpoint-level hardening can expand later, but launch-critical public-input surfaces are already treated as sensitive.

## 7.6 Secrets And Sensitive Data

- Secrets belong in environment variables, not tracked markdown or source files.
- `AUTH_SECRET` and database credentials are server-only runtime concerns.
- Client code must not import secret-bearing server modules.

## 7.7 Media And Data Protection

- Media uploads currently land in `public/uploads/**`, which is operationally simple but not the final long-term hardening target.
- Cloud storage, virus scanning, and richer upload governance remain follow-up hardening work.
- Backups and DB recovery remain infrastructure-level concerns tied to PostgreSQL/Neon operations.

## 7.8 Compliance And Hardening Reality

- This repo is a portfolio platform, not a formal compliance-certified product surface.
- The architecture should still follow sound baseline practices: auth guards, secret isolation, validated input, bounded uploads, and explicit operator control.
- Remaining security hardening should be tracked in Section 09 instead of hidden in stale historical docs.

## 7.9 Incident And Monitoring Notes

- Logging is currently console-first.
- Structured monitoring and alerting are not yet the active baseline.
- Security regressions or auth-flow changes must be reflected here and in the implementation checklist.

---

[« Previous](06-infrastructure-and-operations.md) | [Next »](08-testing-and-quality.md)
