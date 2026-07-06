# Architecture

**Version:** 1.1.0
**Created:** 2026-04-19
**Last Updated:** 2026-05-07
**Author:** Ammar Hany
**Status:** Active
**Tags:** [Architecture, Relaunch, Documentation]

---

## 1. Overview

This is the canonical entry point for the active solution architecture of this repo.

Use this doc set to understand how the website is structured today: public routes, admin CMS,
server layering, persistence, bootstrap, security, operations, and verification. Keep detailed
explanations in the numbered section files. Do not use this file as a scratchpad.

---

## 2. Scope And Structure Intent

This architecture set covers the implemented website solution for this repo, not a hypothetical
future system.

The file layout follows the local documentation guideline:
- `architect.md` stays short and owns scope, structure intent, navigation, and the current high-level picture.
- `sections/01-08` explain the architecture itself.
- `sections/09` is the active implementation and launch checklist.
- `sections/10` is the manual verification guide.
- `relaunch-gap-analysis.md` remains a supporting planning/reference artifact, not the intro file.

---

## 3. How To Use This Doc Set

- Start with Section 01 for product scope and supported journeys.
- Read Sections 02-08 for the technical design by concern.
- Use Section 09 for current-state execution and launch-readiness tracking.
- Use Section 10 when performing Ammar’s manual verification pass.
- Update this intro and any touched section files together when architecture truth changes.

---

## 4. Current Architecture Summary

- The repo is a Next.js App Router implementation with React 19, TypeScript, Tailwind, Prisma, and PostgreSQL.
- The public site is server-first and reads launch content primarily from the database through services.
- The admin CMS is route-protected and exposes CRUD, media, theme, visibility controls, setup diagnostics, and site-profile editing.
- The supported first-run path is env/bootstrap-driven after migrations and seeding.
- Static content modules remain as fallback/bootstrap-aligned defaults, not the primary launch content source.
- Current verification remains incomplete: build and unit tests are green in the current pass, while repo-wide typecheck still has Playwright spec typing drift that must be resolved before release claims.

---

## 5. Table of Contents

1. [System Overview](./sections/01-system-overview.md)
2. [Architecture Layers](./sections/02-architecture-layers.md)
3. [Data and Persistence](./sections/03-data-and-persistence.md)
4. [API and Services](./sections/04-api-and-services.md)
5. [Admin and Public Experience](./sections/05-admin-and-public-experience.md)
6. [Infrastructure and Operations](./sections/06-infrastructure-and-operations.md)
7. [Security and Compliance](./sections/07-security-and-compliance.md)
8. [Testing and Quality](./sections/08-testing-and-quality.md)
9. [Implementation Checklist](./sections/09-implementation-checklist.md)
10. [Manual Testing Guidelines](./sections/10-manual-testing-guidelines.md)
11. [Relaunch Gap Analysis](./relaunch-gap-analysis.md)

---

## 6. Changelog

| Version | Date       | Author         | Affected Files                 | Description                                                                                                                                                                   |
| ------- | ---------- | -------------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.1.0   | 2026-05-07 | GitHub Copilot | docs/architecture/architect.md | Expanded the intro file into a real architecture spine with scope, structure intent, usage guidance, and an updated current-state summary aligned to the helper-doc standard. |
| 1.0.0   | 2026-04-19 | Ammar Hany     | docs/architecture/architect.md | Established the architecture intro file in the repo-standard intro format.                                                                                                    |
