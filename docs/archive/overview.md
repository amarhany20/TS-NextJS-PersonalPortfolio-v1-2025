# TS-NextJS PersonalPortfolio v1-2025 Architecture

**Version:** 2.0.0
**Created:** 2025-12-02
**Last Updated:** 2026-03-24
**Author:** Ammar Hany
**Maintainer:** Ammar Hany
**Status:** Active
**Tags:** [Next.js, Architecture, Portfolio, Relaunch]

---

## Overview

This document is the current architecture baseline for the implementation repo.

The codebase is a Next.js App Router portfolio platform with a public site, an admin CMS, Prisma
data models, API routes, theming, and content management features. It is being revived for public
launch, so this document focuses on:
- what exists now,
- what is partially implemented or inconsistent,
- what must be stabilized before launch.

This file replaces the older "production-ready" framing with a relaunch architecture view grounded
in current code inspection.

---

## Table of Contents

1. [System Overview](./sections/01-system-overview.md)
2. [Architecture Layers](./sections/02-architecture-layers.md)
3. [Data & Persistence](./sections/03-data-and-persistence.md)
4. [API & Services](./sections/04-api-and-services.md)
5. [Admin & Public Experience](./sections/05-admin-and-public-experience.md)
6. [Infrastructure & Operations](./sections/06-infrastructure-and-operations.md)
7. [Security & Compliance](./sections/07-security-and-compliance.md)
8. [Testing & Quality](./sections/08-testing-and-quality.md)
9. [Implementation Checklist](./sections/09-implementation-checklist.md)

Related:
- [Code Structure](./code-structure.md)
- [Relaunch Gap Analysis](./relaunch-gap-analysis.md)
- [Execution Status](../EXECUTION_STATUS.md)

---

## 1. Solution Summary

### 1.1 What This System Is

The application serves two audiences:
- public visitors consuming portfolio, experience, education, services, blog, and contact content,
- the portfolio owner managing that content through the admin interface.

### 1.2 Core Platform Shape

- Frontend: Next.js App Router pages and reusable UI components.
- Backend-in-repo: route handlers, services, repositories, serializers, auth/session helpers, and
  server validators.
- Persistence: Prisma models for settings, users, portfolio, blog, media, contact submissions, and
  other portfolio domains.
- Content strategy: database-backed primary model with owner-specific content under `data/ammar/`
  and generic/template content under `src/static-content/`.

### 1.3 Current Architecture Tension

The main architectural tension is first-run/bootstrap:
- setup pages and setup components still exist,
- setup APIs are disabled,
- env bootstrap can populate admin/settings data,
- setup scripts are referenced but currently missing.

Launch prep must resolve this into one documented, supported onboarding path.

---

## 2. Layered Architecture

The codebase generally follows:

```text
Page / Route
  -> Validation
  -> Service
  -> Repository
  -> Serializer / Response helper
```

Primary implementation areas:
- `src/app/**` for pages and route handlers
- `src/server/services/**` for business logic
- `src/server/repositories/**` for data access
- `src/server/serializers/**` for API/public DTO shaping
- `src/server/security/**` for auth/session/password/rate-limit logic
- `src/server/server-validators/**` for schema validation

This is the correct architectural direction and should be preserved during the revamp.

---

## 3. Current-State Findings

### 3.1 What Looks Structurally Strong

- broad domain coverage already exists across public pages, admin pages, APIs, and services
- Prisma schema is substantial and aligned with a real CMS-backed portfolio
- repositories/services/serializers are present for major content types
- tests exist for serializers, services, APIs, and e2e admin/public flows

### 3.2 What Is Out of Sync

- docs still overclaim verification and completion
- setup runtime story is inconsistent
- setup script references are broken
- verification status is unknown in the current workspace until dependencies are installed and checks
  are run
- some repo narratives still mention older assumptions such as SQLite-first or fully active setup
  flows, while the current schema/runtime have moved toward PostgreSQL + env bootstrap

---

## 4. Launch Readiness Focus

The relaunch should proceed in this order:

1. Documentation truth reset
2. Environment and dependency restore
3. Verification pass
4. Setup-path decision and cleanup
5. Bug fixing and UX cleanup
6. Content polish and launch prep

This keeps architecture, implementation, and launch operations aligned instead of treating them as
separate efforts.

---

## 5. Architecture Decisions for the Revamp

### 5.1 Source of Truth

For this relaunch cycle:
- code is the source of truth for current behavior,
- refreshed docs are the source of truth for the intended next state,
- old verification docs remain historical evidence only.

### 5.2 Documentation Scope

This repo should hold implementation-depth documentation only:
- architecture,
- code structure,
- APIs,
- persistence,
- infra,
- security,
- testing,
- launch checklist.

### 5.3 First-Run Direction

One supported first-run mode must be chosen and documented:
- env/bootstrap-driven setup, or
- restored web setup wizard.

Keeping both partially active is a launch risk.

---

## 6. Relaunch Deliverables

The current architecture revamp should leave the repo with:
- truthful project guidance in `AGENTS.md`
- a clean docs index
- a relaunch gap analysis
- a current implementation checklist
- evidence logs for what was inspected and what still needs verification

---

## Changelog

| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 2.0.0 | 2026-03-24 | Codex | Reframed architecture around the actual current codebase and relaunch needs. Removed stale production-ready claims and documented the setup/bootstrap ambiguity as a primary architecture concern. |
| 1.02.00 | 2025-12-17 | Ammar Hany | Marked the earlier documentation pass as fully executed. |
| 1.00.00 | 2025-12-02 | GitHub Copilot | Initial architecture baseline. |
