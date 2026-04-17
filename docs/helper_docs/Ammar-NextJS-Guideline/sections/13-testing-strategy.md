# 13. Testing Strategy

- **Unit (Vitest):** utils, small services, repositories.
- **Component (Vitest + RTL):** components and sections.
- **e2e (Playwright):** critical flows, SEO checks, redirects.
- Snapshots are allowed only for stable UI.

Keep factories or fixtures under `tests/fixtures/*`.

---
