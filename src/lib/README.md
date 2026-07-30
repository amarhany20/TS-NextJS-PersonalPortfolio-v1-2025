# `src/lib`

Purpose: framework-safe helpers that can be shared across server components and app composition code.

Rules:

- Keep modules small, dependency-light, and safe for the environments where they are imported.
- Avoid mixing browser-only and server-only behavior in the same helper.
- Add docstrings when exposing utility helpers that may be reused across domains.
