# Agent Guidelines for TS-NextJS-PersonalPortfolio-v1-2025

## Build/Lint/Test Commands
- Build: `npm run build`
- Lint: `npm run lint` (fix with `npm run lint:fix`)
- Typecheck: `npm run typecheck`
- Format: `npm run format` (check with `npm run format:check`)
- Unit tests: `npm run test` (single test: `npm run test -- path/to/test.spec.ts`)
- E2E tests: `npm run e2e`
- All checks: `npm run check`

## Code Style Guidelines
- **Imports**: Use path aliases (`@/*`, `@/server/*`, etc.). Type imports: `import type { } from '@/types/...'` 
- **Formatting**: Prettier auto-formats; no semicolons, single quotes.
- **Types**: Strict TypeScript, no `any` (ESLint enforced). Use Zod for validation at boundaries.
- **Naming**: PascalCase for components, camelCase for functions/variables, UPPER_SNAKE for constants.
- **Error Handling**: Use AppError class; throw in services, catch in API routes with errorResponse().
- **Client/Server**: `"use client"` only for interactivity; never import `@/server/*` in client code.
- **Architecture**: Pages → Services → Repositories; validate → service → serialize → response.

## Copilot Instructions
Follow .github/copilot-instructions.md for layered architecture, data flow patterns, anti-patterns (e.g., no server imports in client), and common workflows.