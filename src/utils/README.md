# `src/utils`

Purpose: isomorphic utility helpers that are not tied to React rendering or server-only modules.

Rules:

- Keep utilities pure where possible and avoid hidden environment-specific side effects.
- Document launch-scope limitations clearly when a utility is intentionally lightweight, like analytics.
- Move Node-only behavior to `src/server/server-utils` instead of keeping it here.
