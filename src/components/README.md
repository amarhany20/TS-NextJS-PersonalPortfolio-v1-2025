# `src/components`

Purpose: reusable UI building blocks and admin-facing interactive components.

Rules:
- Keep shared primitives generic and keep domain behavior in the closest domain component.
- Do not import `@/server/*` into client components.
- Prefer accessible semantics, stable labels, and high-signal docstrings/comments for non-obvious UI logic.
