# 1. Tech Baseline

- **Next.js:** latest stable (App Router)
- **TypeScript:** `strict: true`
- **Runtime:** Node LTS (set `engines.node` in `package.json`)
- **Styling:** Tailwind CSS + CSS Variables (tokens) in `globals.css`
- **Package Manager:** npm (lockfile committed)
- **Lint/Format:** ESLint (Next + Tailwind), Prettier
- **Testing:** Vitest (unit) + Playwright (e2e)
- **DB (optional):** Prisma + Postgres (or adapter as needed)
- **CI:** GitHub Actions for typecheck, lint, test, build

> Keep a short `README.md` in the repo root with setup steps.

---
