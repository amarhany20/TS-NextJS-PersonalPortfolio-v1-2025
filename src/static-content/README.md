# `src/static-content`

Purpose: fallback/template content and metadata used for bootstrap, safe defaults, and development-safe rendering.

Rules:
- Do not leave launch-facing placeholder identity data or demo records in active fallback exports.
- Keep these modules aligned with seeded/runtime behavior and public docs.
- Treat database-backed content as the primary source of truth when both layers exist.
