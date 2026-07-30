# `tests`

Purpose: automated verification for the relaunch, split into unit coverage and Playwright end-to-end coverage.

Rules:

- Use `tests/unit` for focused service, serializer, and utility verification.
- Use `tests/e2e` for launch-critical user flows only.
- Treat the isolated seeded Playwright server as the authoritative E2E gate; reused live dev servers are useful for debugging but can produce noisy results.
- The default isolated Playwright gate now runs serially because the admin suite mutates one shared seeded database and app instance.
