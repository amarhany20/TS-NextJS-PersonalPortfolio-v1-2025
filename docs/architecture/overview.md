# Architecture Overview

**Last Updated:** 2026-03-24
**Status:** Active

---

## Summary

This project is a Next.js portfolio platform with:
- public portfolio pages,
- an admin CMS,
- Prisma-backed persistence,
- env-driven bootstrap for settings and admin initialization.

The supported onboarding path is:
1. configure environment variables,
2. run Prisma migrations,
3. seed/bootstrap the database,
4. start the app.

The old web setup flow is no longer treated as a supported launch path.
