# Agent Guidelines for TS-NextJS-PersonalPortfolio-v1-2025

**Version:** 2.0.0
**Updated:** 2025-12-27
**Status:** Production Ready - All Agents Executed Successfully

## Project Overview

TS-NextJS-PersonalPortfolio-v1-2025 is a production-ready, self-hosted portfolio platform built with Next.js 15, Prisma, and enterprise architecture patterns. It provides a themable public website with a full-featured admin CMS, supporting both SQLite and Neon PostgreSQL databases.

**All 9 Agents Completed Successfully:**
- [x] Agent A: Codebase Alignment (structure verification)
- [x] Agent B: Documentation Overhaul (comprehensive docs)
- [x] Agent C: First-Run Setup (automated configuration)
- [x] Agent D: Admin Panel Layout (consolidated dashboard)
- [x] Agent E: Content Separation (generic + private datasets)
- [x] Agent F: Seed Generator (owner-specific seeding)
- [x] Agent G: Auth Simplification (security hardening)
- [x] Agent H: Architecture Review (gap analysis)
- [x] Agent I: Test Coverage (unit + e2e testing)

## Build/Lint/Test Commands
- Build: `npm run build`
- Lint: `npm run lint` (fix with `npm run lint:fix`)
- Typecheck: `npm run typecheck`
- Format: `npm run format` (check with `npm run format:check`)
- Unit tests: `npm run test` (single test: `npm run test -- path/to/test.spec.ts`)
- E2E tests: `npm run e2e`
- All checks: `npm run check`

## Code Style Guidelines
- **Imports**: Use path aliases (`@/*`, `@/server/*`, etc.). Type imports: `import type { } from '@/types/...'` (ESLint enforced)
- **Formatting**: Prettier auto-formats; no semicolons, single quotes
- **Types**: Strict TypeScript, no `any` (ESLint enforced). Use Zod for validation at boundaries
- **Naming**: PascalCase for components, camelCase for functions/variables, UPPER_SNAKE for constants
- **Error Handling**: Use AppError class; throw in services, catch in API routes with errorResponse()
- **Client/Server**: `"use client"` only for interactivity; **NEVER** import `@/server/*` in client code
- **Architecture**: Pages -> Services -> Repositories; validate -> service -> serialize -> response

## Layered Architecture Reference

```
src/app/          -> Next.js App Router (SSR-first, route handlers)
src/server/       -> Enterprise backend architecture
  -  services/    -> Business logic layer (orchestrates repositories)
  -  repositories/-> Data access abstraction (Prisma queries)
  -  serializers/ -> Response DTOs (DB models -> API responses)
  -  http/        -> Error classes, response envelopes, helpers
  -  security/    -> Auth, password hashing, sessions, rate limiting

src/components/   -> Reusable UI (Admin/, UI/, NavSidebar/, ProfileSidebar/)
src/sections/     -> Page-specific sections (home/, Services/, setup/)
src/static-content/-> Generic template content (safe defaults)
data/ammar/       -> Private owner dataset (local/deployment only)
```

## Key Rules & Anti-Patterns

**? NEVER:**
- Import `@/server/*` in client components (build failures)
- Bypass Zod validation schemas
- Call repositories directly from route handlers
- Use `any` types (strict TypeScript)
- Hardcode colors (use theme CSS variables)
- Access `process.env` directly (use `@/server/server-validators/env`)

**[x] ALWAYS:**
- Use path aliases for all imports
- Mark client components with `"use client"` at top
- Follow layered architecture patterns
- Validate -> Service -> Serialize -> Response in APIs

## Setup & Development Quick Start

```bash
# First-time setup
npm install
npm run setup:first-run     # Interactive setup (SQLite/Neon selection)
npm run dev                 # Start development server

# Advanced seeding (owner-specific content)
npm run seed:ammar          # Seeds from data/ammar/* if present

# Quality checks
npm run check               # typecheck + lint + format + test
```

## Documentation & Reference

**Primary Documentation:**
- `docs/EXECUTION_STATUS.md` - Quick project overview
- `docs/TS-NextJS-PersonalPortfolio-V1-2025 Documentation/architecture.md` - System design
- `docs/TS-NextJS-PersonalPortfolio-V1-2025 Documentation/code-structure.md` - Folder map
- `instructions/FIRST-RUN.md` - Local setup guide
- `instructions/SEEDING.md` - Database seeding workflows

**All documentation follows Ammar Documentation Guideline v5.01.00 with metadata headers, versioning, and cross-references.**

## Copilot Instructions

**Follow `.github/copilot-instructions.md` for:**
- Detailed layered architecture patterns
- Data flow and API patterns
- Anti-patterns and critical rules
- Common workflows and debugging
- Theme system and UI architecture
- Database operations and seeding
- Testing commands and quality gates

The copilot instructions are the comprehensive reference for development patterns, workflows, and project conventions. Always consult them when implementing new features or debugging issues.

---

**Status:** All phases complete, production-ready. Next priority: Implement web-based setup wizard to replace terminal configuration.