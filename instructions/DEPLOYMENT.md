# Runbook — Deployment

**Version:** 1.00.00  
**Created:** 2025-12-17  
**Last Updated:** 2025-12-17  
**Owner:** Ammar Hany  
**Contributors:** GitHub Copilot (docs)  
**Status:** Active  
**Tags:** [Runbook, Deployment, Vercel]

---

## Purpose
Steps to deploy to a managed platform (e.g., Vercel) with Postgres and Prisma migrations.

---

## Environment Variables (Production)
- `AUTH_SECRET` — generate a strong, unique value (32+ chars)
- `NEXT_PUBLIC_SITE_URL` — your site URL (e.g., https://example.com)
- `DATABASE_URL` — Postgres (e.g., Neon) connection string
- Optional seed vars (for initial setup only): `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`

---

## Database Choice
- Prefer Postgres in production. SQLite is for local/dev only.
- Neon is a good free, serverless Postgres option.

---

## Vercel Setup (Typical)
1. Create a new Vercel project and connect this GitHub repo
2. Set environment variables in Vercel → Settings → Environment Variables
3. Build command: `next build` (default)
4. Node version: 20+
5. After first deploy, run migrations (once):
```bash
# In a Vercel job or locally against the production DB
npx prisma migrate deploy
```
6. If you need initial data in production, run the seed once (from a secure environment):
```bash
npm run db:seed
```

---

## Smoke Tests
After deploy:
- Visit `/admin` and login
- Verify a public page renders (home, portfolio)
- Check theme selection in Admin → Settings → Theme

---

## CI/CD Notes
- For CI/CD, prefer `npx prisma migrate deploy` rather than `prisma migrate dev`
- Ensure `npm run test` and `npm run build` pass before deploy
