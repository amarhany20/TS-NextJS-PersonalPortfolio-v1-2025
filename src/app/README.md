# `src/app`

Purpose: Next.js App Router routes, layouts, metadata boundaries, and HTTP route handlers.

Rules:
- Keep `page.tsx` files focused on composition and server-safe orchestration.
- Call services from pages and route handlers instead of reaching into repositories directly.
- Keep route handlers thin: validate input, delegate work, and return the shared response format.
- Use route groups only for organization and shared layout/auth behavior.
