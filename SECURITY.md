# Security Policy

## Supported Versions

This repository tracks an actively maintained single-admin portfolio template.
Only the latest commit on the default branch receives security fixes. Older
commits are not backported.

## Reporting a Vulnerability

Please do **not** open a public GitHub issue for security vulnerabilities.

Report privately by email to the maintainer (Ammar Hany) via the address listed
on his GitHub profile. Include:

- A clear description of the issue and its impact.
- Reproduction steps, including sample input where possible.
- The commit hash or tag you observed the issue on.
- Any known mitigations or workarounds.

You should receive an acknowledgement within 7 days. The maintainer will work
with you on coordinated disclosure and a fix timeline.

## Scope

In scope for the security policy:

- Authentication, session handling, password storage, and rate limiting.
- Server-side input validation and authorization checks (admin vs. public).
- Secret handling, environment variable processing, and the
  `iron-session` cookie configuration.
- Dependency-level vulnerabilities reported via `npm audit` against
  `package.json` and the lockfile.

Out of scope:

- Vulnerabilities in user-supplied content (admin-authored portfolio, blog,
  media uploads). Treat the admin account as trusted.
- Denial of service against a self-hosted single-tenant deployment.

## Hardening Checklist for Self-Hosters

- Use a real `AUTH_SECRET` of at least 32 random characters
  (`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`).
- Set `AUTH_SALT_ROUNDS` to at least 12.
- Serve over HTTPS in production so the session cookie stays `Secure`.
- Restrict database network access. Neon + Vercel private networking is the
  supported reference deployment.
- Keep `DATABASE_URL`, `AUTH_SECRET`, and `ADMIN_PASSWORD` out of the repo and
  out of CI logs. Use your hosting provider's secret store.
