# `src/types`

Purpose: shared UI-facing TypeScript types and view models.

Rules:

- Keep frontend types aligned with serializers and public service outputs.
- Avoid duplicating Prisma model shapes when a view-model type is what the UI actually needs.
- Update the related docs/checklists when a shared contract changes.
