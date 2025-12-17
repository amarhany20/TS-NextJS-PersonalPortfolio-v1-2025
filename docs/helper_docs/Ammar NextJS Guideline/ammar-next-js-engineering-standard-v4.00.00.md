# Ammar Next.js Engineering Standard

**Version:** 4.00.00  
**Created:** 2023-06-01  
**Last Updated:** 2025-11-13  
**Maintainer:** Ammar Hany  
**Status:** Active  
**Applies To:** All Ammar-led Next.js App Router projects with TypeScript, Tailwind, and `src/` layout  
**Tags:** [Next.js, Standards, App Router, Concise]

---

## Overview
Single source for Next.js engineering standards. Our approach: **concise yet comprehensive**—include all essential patterns, eliminate redundancy, and structure for fast reference. Each link jumps to a focused section covering architecture, security, testing, and operational conventions.

---

## Table of Contents
0. [Principles](./sections/00-principles.md)
1. [Tech Baseline](./sections/01-tech-baseline.md)
2. [Folder Layout](./sections/02-folder-layout-under-src.md)
3. [Pages, Sections, Components](./sections/03-pages-sections-components.md)
4. [Styling](./sections/04-styling-and-design-tokens.md)
5. [Data & Validation](./sections/05-data-types-and-validation.md)
6. [Server Architecture](./sections/06-server-architecture.md)
7. [API Design](./sections/07-api-architecture-design.md)
8. [Client vs Server Components](./sections/08-client-vs-server-components.md)
9. [Data Fetching & Middleware](./sections/09-data-fetching-and-caching.md)
10. [Accessibility](./sections/10-accessibility.md)
11. [Security](./sections/11-security-hardening.md)
12. [Logging](./sections/12-logging-and-observability.md)
13. [Testing](./sections/13-testing-strategy.md)
14. [CI/CD](./sections/14-ci-cd.md)
15. [Routing & SEO](./sections/15-routing-metadata-and-seo.md)
16. [Performance](./sections/16-performance.md)
17. [Code Style](./sections/17-code-style-and-preamble.md)
18. [PR Checklist](./sections/18-pr-checklist.md)
19. [Decision Guides](./sections/24-decision-guides.md)

---

## Quick Reference
- Intro file: `ammar-next-js-engineering-standard-vX.YY.ZZ.md`
- Sections: `sections/NN-section-title.md`
- Core pattern: Route → Controller → Service → Repository
- Validation: 3 layers (Client → API → Business)
- Auth: Session-based (iron-session) or JWT
- Update TOC when adding/removing sections

---

## Changelog

| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 4.00.00 | 2025-11-13 | Ammar Hany | Major: Aligned to Ammar Documentation Guideline v5. Established concise-yet-comprehensive approach. Streamlined all sections. |
| 3.01.00 | 2025-11-13 | Ammar Hany | Condensed verbose sections, removed redundancy, kept essential patterns. |
| 3.00.00 | 2025-11-11 | Ammar Hany | Merged full and compact standards. Added auth, RBAC, middleware, 3-layer validation. |

---
