# `src/client-validators`

Purpose: browser-safe Zod schemas used for form UX and early validation feedback.

Rules:
- Keep client validation aligned with the server validator for the same domain.
- Do not move security-critical validation here; the server remains authoritative.
- Prefer shared field naming so forms, APIs, and docs stay in sync.
