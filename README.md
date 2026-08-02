<div align="center">

# Personal Portfolio — Next.js + TypeScript

**A free, self-hosted portfolio platform with a public site, admin CMS, and database-backed content.**

`Next.js 16` · `React 19` · `TypeScript` · `Tailwind CSS 4` · `Prisma` · `PostgreSQL` · `Vercel` · `Neon`

[Deploy for free](#deploy-to-vercel) · [Quick start](#quick-start) · [Documentation](#table-of-contents) · [License](#license)

</div>

---

## Table of Contents

- [What is this?](#what-is-this)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [The 100% Free Hosting Stack](#the-100-free-hosting-stack)
- [Repository Structure](#repository-structure)
- [Prerequisites](#prerequisites)
- [Step 1 — Create a Free PostgreSQL Database (Neon)](#step-1--create-a-free-postgresql-database-neon)
- [Step 2 — Clone & Configure Locally](#step-2--clone--configure-locally)
- [Step 3 — Run Locally](#step-3--run-locally)
- [Step 4 — Push to GitHub](#step-4--push-to-github)
- [Step 5 — Deploy to Vercel](#step-5--deploy-to-vercel)
- [Step 6 — Connect a Domain](#step-6--connect-a-domain)
- [Step 7 — Add Your Content (Admin CMS)](#step-7--add-your-content-admin-cms)
- [Backup & Restore](#backup--restore)
- [Customization](#customization)
- [Media & File Uploads](#media--file-uploads)
- [Scripts](#scripts)
- [Testing](#testing)
- [Security](#security)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)
- [Credits](#credits)

---

## What is this?

This repository is a **complete, open-source personal portfolio template**. It ships
a public portfolio website **and** a full database-backed admin CMS, so you can
manage your projects, experience, skills, services, certificates, recommendations,
blog posts, and site settings without touching code.

It is designed to be cloned, configured with a few environment variables, and
deployed **100% free** on Vercel (Hobby plan) + Neon (free PostgreSQL tier).

---

## Features

**Public site**

- Home page with hero, summary, experience, education, skills, certificates,
  recommendations, and contact sections.
- Portfolio listing with **stack-based filtering** (`/portfolio?stack=next.js`) and
  rich case-study pages with **MDX content**.
- Services overview page.
- Blog with categories, tags, and full posts.
- **RSS 2.0** (`/feed.xml`) and **JSON Feed v1.1** (`/feed.json`) feeds.
- **Dynamic SEO**: per-page Open Graph / Twitter cards, `robots.txt`, `sitemap.xml`.
- **Lightbox gallery** with swipe gestures for project images.
- Responsive, accessible, mobile-first UI.

**Admin CMS** (`/admin`, single admin account)

- Dashboard with metrics.
- CRUD managers for portfolio, experience, education, skills, services,
  certificates, recommendations, and blog posts.
- Attachments library (images, PDFs, and other files) with copy-link / copy-path.
- Contact inbox for form submissions.
- Settings: **profile**, **visibility**, **theme** (7 built-in themes),
  **backup/restore**, and setup diagnostics.

**Platform**

- Session-based admin auth (`iron-session`, bcrypt, rate-limited login).
- **JSON backup & restore** for all content (export / import from the admin UI).
- Attachment storage via **Vercel Blob** (public blob) — no local disk driver.
- Env + bootstrap-driven first-run setup (no web wizard needed).
- Layered architecture: Route/Page → Service → Repository → Serializer/Response.
- Strict TypeScript and Zod validation at every server boundary.
- Full automated test suite (Vitest unit tests + Playwright end-to-end tests).

---

## Tech Stack

| Layer        | Technology                                          |
| ------------ | --------------------------------------------------- |
| Framework    | Next.js 16 (App Router), React 19                   |
| Language     | TypeScript (strict)                                 |
| Styling      | Tailwind CSS 4, CSS variables, 7 built-in themes    |
| Database     | PostgreSQL (Prisma ORM)                             |
| Auth         | iron-session (HttpOnly cookies) + bcrypt            |
| Validation   | Zod                                                 |
| MDX          | Rich project/blog sections (custom component suite) |
| Testing      | Vitest (unit) + Playwright (e2e)                    |
| Hosting      | Vercel (recommended)                                |
| Database Ops | Neon (free tier), Prisma Migrate                    |

---

## The 100% Free Hosting Stack

This project is designed to run at **zero cost** using free tiers:

| Service                    | Purpose             | Free tier                                                                      |
| -------------------------- | ------------------- | ------------------------------------------------------------------------------ |
| **Neon**                   | PostgreSQL database | 0.5 GB storage, branchable, autosleeps when idle, built-in snapshot backups    |
| **Vercel**                 | Web hosting         | Hobby plan: serverless deployment, free `*.vercel.app` subdomain, HTTPS, CI/CD |
| **GitHub**                 | Code storage/CI     | Free public or private repos, Actions minutes                                  |
| **Vercel Blob** (optional) | File uploads        | Hobby plan storage — needed only if you upload images/PDFs in production       |

No credit card is required to start on any of these.

---

## Repository Structure

```text
├─ prisma/
│  ├─ schema.prisma              # Data model (Portfolio, Experience, Blog, Settings, ...)
│  ├─ migrations/                # Baseline + future migrations (applied by `migrate deploy`)
│  └─ seed.ts                    # Seeds the DB with template/demo content (local dev)
│
├─ src/
│  ├─ app/                       # Next.js App Router: pages, layouts, route handlers
│  │  ├─ home/                   # Public home page
│  │  ├─ portfolio/              # Portfolio listing + case-study detail ([slug])
│  │  ├─ services/               # Services page
│  │  ├─ blogs/                  # Blog listing + post detail
│  │  ├─ feed.xml/ feed.json/    # RSS 2.0 + JSON Feed v1.1
│  │  ├─ login/                  # Admin sign-in
│  │  ├─ admin/                  # Admin CMS (dashboard, CRUD, media, contact, settings)
│  │  └─ api/v1/                 # API route handlers (REST controllers)
│  ├─ server/                    # Server layer: services, repositories, serializers,
│  │  │                          #   validators, security, db, integrations
│  ├─ components/                # Reusable UI (public + admin)
│  ├─ sections/                  # Home-page section blocks
│  ├─ static-content/            # Template-safe fallback content + seed defaults
│  ├─ themes/                    # 7 CSS-token theme definitions
│  ├─ types/                     # TypeScript types
│  ├─ utils/                     # Isomorphic utilities
│  └─ lib/                       # Framework helpers (version, etc.)
│
├─ public/                       # Static assets (images, documents)
├─ tests/                        # Vitest (unit) + Playwright (e2e) suites
└─ package.json
```

---

## Prerequisites

- **Node.js 20+** and npm — [download](https://nodejs.org)
- A **GitHub** account — [github.com](https://github.com)
- A **Vercel** account (free) — [vercel.com](https://vercel.com)
- A **Neon** account (free) — [neon.tech](https://neon.tech)

---

## Step 1 — Create a Free PostgreSQL Database (Neon)

Neon provides a free PostgreSQL database with a branching workflow and built-in
snapshots — plenty for a portfolio.

1. Go to [neon.tech](https://neon.tech) and **Sign up** (or Sign in).
2. Click **Create a project**.
3. Give it a name (e.g. `my-portfolio`), pick a region close to you, and select a
   PostgreSQL version.
4. On the **Connect** screen you will find two connection strings — **copy both**:

   - **Pooled connection string** (PgBouncer-compatible, host contains `-pooler`):
     this is your runtime `DATABASE_URL`.
   - **Direct connection string** (non-pooled, host has **no** `-pooler`):
     this is your `DIRECT_URL`, used by Prisma Migrate.

   > **Why two URLs?** Neon routes connections through a pooler by default.
   > Prisma Migrate needs session-based advisory locks, which require a **direct**
   > (non-pooled) connection. This project reads both `DATABASE_URL` and
   > `DIRECT_URL`; deployments run `prisma migrate deploy` automatically.

5. Keep this tab open — you will paste the strings in the next steps.

---

## Step 2 — Clone & Configure Locally

```bash
git clone https://github.com/amarhany20/TS-NextJS-PersonalPortfolio-v1-2025.git
cd TS-NextJS-PersonalPortfolio-v1-2025
npm install
cp .env.example .env.local
```

> Using your own fork? Replace the clone URL with your fork's URL.

Open `.env.local` and set the required values:

```env
# Session secret (at least 32 random characters)
AUTH_SECRET=replace-with-a-long-random-string

# Your site URL (the footer and SEO use this)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Neon database — pooled connection string (from Step 1)
DATABASE_URL=postgresql://user:pass@your-project-pooler.example.com/db?sslmode=require

# Neon database — direct (non-pooled) connection string (from Step 1)
DIRECT_URL=postgresql://user:pass@your-project-direct.example.com/db?sslmode=require

# Initial admin account (created by the bootstrap on first run / seed)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change-me-now
ADMIN_EMAIL=you@example.com
ADMIN_DISPLAY_NAME=Your Name
```

Generate a secure `AUTH_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Step 3 — Run Locally

```bash
# Create the tables (applies the Prisma migrations)
npm run prisma:migrate

# Seed the database with template content (demo projects, experience, etc.)
npm run db:seed

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects to `/home`.

- **Public site:** http://localhost:3000/home
- **Admin sign-in:** http://localhost:3000/login (use `ADMIN_USERNAME` / `ADMIN_PASSWORD`)
- **Admin CMS:** http://localhost:3000/admin
- **Database browser:** `npm run prisma:studio` → http://localhost:5555

The seeded content is **generic template/demo data** — replace it with your own via
the admin CMS (see [Step 7](#step-7--add-your-content-admin-cms)).

---

## Step 4 — Push to GitHub

1. Create a new repository on GitHub (public or private) — e.g. `my-portfolio`.
2. Push this repo to it:

```bash
git remote set-url origin https://github.com/<your-username>/my-portfolio.git
git push -u origin main
```

---

## Step 5 — Deploy to Vercel

Deploy directly with the button (clones this template into your GitHub account):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/amarhany20/TS-NextJS-PersonalPortfolio-v1-2025&env=DATABASE_URL%2CDIRECT_URL%2CAUTH_SECRET%2CNEXT_PUBLIC_SITE_URL%2CADMIN_USERNAME%2CADMIN_PASSWORD%2CADMIN_EMAIL&envDescription=DATABASE_URL%20is%20your%20pooled%20Postgres%20connection%20string%20from%20Neon.%20DIRECT_URL%20is%20the%20non-pooled%20connection%20string%20%28remove%20-pooler%20from%20the%20host%29%20required%20for%20Prisma%20migrations.%20AUTH_SECRET%20must%20be%20at%20least%2032%20random%20characters.%20The%20ADMIN_%20variables%20bootstrap%20the%20initial%20admin%20account.)

Or, manually:

1. Go to [vercel.com/new](https://vercel.com/new).
2. **Import** your GitHub repository.
3. Vercel auto-detects Next.js — the framework preset is fine.
4. Add the **Environment Variables**:

   | Variable               | Value                                                       |
   | ---------------------- | ----------------------------------------------------------- |
   | `DATABASE_URL`         | Neon **pooled** connection string                           |
   | `DIRECT_URL`           | Neon **direct** connection string (no `-pooler`)            |
   | `AUTH_SECRET`          | A secure 32+ character random string                        |
   | `NEXT_PUBLIC_SITE_URL` | Your deployment URL, e.g. `https://my-portfolio.vercel.app` |
   | `ADMIN_USERNAME`       | Your admin username                                         |
   | `ADMIN_PASSWORD`       | Your admin password                                         |
   | `ADMIN_EMAIL`          | Your admin email                                            |

5. Click **Deploy**.

**How migrations work on Vercel:** the build runs `vercel-build` =
`prisma generate && prisma migrate deploy && next build`, so your schema is
migrated automatically on every deploy. No SSH/CLI needed.

**First run:** when the deployed app boots and finds no settings/admin row,
`EnvBootstrapService` creates them from your env vars automatically. Sign in at
`/login` with the `ADMIN_USERNAME` / `ADMIN_PASSWORD` you set.

> **Optional — seed content on your deployed DB:** the seed script is skipped in
> production, so a fresh deploy starts with an empty (CMS-managed) database. If you
> want the demo content, run the seed once from a local clone pointed at the Neon
> DB:
>
> ```bash
> # from a local clone, with .env.local set to the same Neon DATABASE_URL/DIRECT_URL
> npm run db:seed
> ```
>
> Otherwise just add your own content through the admin CMS.

---

## Step 6 — Connect a Domain

### Option A — Free Vercel subdomain (zero setup)

Every Vercel deployment gets a free `https://<your-project>.vercel.app` URL
automatically. Set `NEXT_PUBLIC_SITE_URL` to it and you are done.

### Option B — Your own domain

1. **Buy a domain** from any registrar (e.g. Namecheap, GoDaddy, Cloudflare,
   Google Domains). Expect ~$8–15/year for a `.com`-style domain.
2. In the **Vercel dashboard**, open your project → **Settings → Domains**.
3. Enter your domain (e.g. `example.com` or `www.example.com`) and click **Add**.
4. Follow the DNS instructions Vercel shows. Two common setups:

   - **Apex domain** (`example.com`): point an **A record** at Vercel's IP
     `76.76.21.21`.
   - **Subdomain / www** (`www.example.com`): create a **CNAME record** pointing
     at `cname.vercel-dns.com`.

5. Vercel provisions an **HTTPS certificate** automatically (Let's Encrypt).
   Wait a few minutes and visit your domain.
6. Update `NEXT_PUBLIC_SITE_URL` to `https://your-domain.com` and redeploy so the
   footer, SEO, sitemap, and feeds use the new URL.

---

## Step 7 — Add Your Content (Admin CMS)

Sign in at `/login`, then open `/admin`. Everything is editable there:

| Manager                   | Purpose                                          |
| ------------------------- | ------------------------------------------------ |
| **Dashboard**             | Metrics and quick links                          |
| **Portfolio**             | Projects, case studies, MDX sections, gallery    |
| **Experience**            | Work history timeline                            |
| **Education**             | Degrees and education records                    |
| **Skills**                | Skill groups and individual skills               |
| **Services**              | Service offerings                                |
| **Certificates**          | Certificates and credentials                     |
| **Recommendations**       | Testimonials                                     |
| **Blog**                  | Posts, categories, tags                          |
| **Media**                 | Uploaded files                                   |
| **Contact**               | Submitted contact-form messages (inbox)          |
| **Settings → Profile**    | Site name, hero, photo, contact details, socials |
| **Settings → Visibility** | Show/hide pages and home sections (404-safe)     |
| **Settings → Theme**      | Preview and apply one of the 7 built-in themes   |
| **Settings → Backup**     | Export / import a full JSON backup               |
| **Settings → Setup**      | Diagnostics: bootstrap and migration status      |

**Profile photo:** upload an image via **Media**, then set its URL in
**Settings → Profile → Profile Avatar Photo URL**. If none is set, a neutral
default avatar is shown.

---

## Backup & Restore

You have two layers of backup:

**1. Application backup (admin UI)**

- Go to **Admin → Settings → Backup**.
- **Export** downloads a JSON file containing all your content (portfolio,
  experience, education, skills, services, certificates, recommendations, blog,
  and settings).
- **Import** restores content from a previously exported JSON file.

> This is a content backup — ideal for moving between environments or before
> destructive changes.

**2. Database-level backups (Neon)**

- Neon's free tier keeps automatic snapshots and provides **Time Travel** /
  **Branching** so you can restore the database at any point in time.
- Open your project in the Neon console → **Branches** / **Snapshots** to create
  or restore backups.

---

## Customization

- **Content** — use the admin CMS (recommended) or edit
  `src/static-content/*` (template-safe fallback data used by the seed).
- **Themes** — edit `src/themes/index.ts` (7 themes) and apply them from
  **Settings → Theme**.
- **Styling tokens** — CSS variables in `src/app/globals.css`.
- **Navigation routes** — `src/static-content/routes.ts`.
- **SEO defaults** — set in **Settings → Profile** and
  `src/static-content/seo.ts` (fallback).
- **Avatar default** — replace `public/images/avatar.svg`.

---

## Attachments & File Storage

- The admin **Attachments** library stores images, PDFs, and other files as a
  public **Vercel Blob**, and lets you copy either the full link or the location
  to paste into URL fields (profile photo, certificate URL, recommendation letter).
- **Setup (required for uploads):**
  1. Create a Blob store in your Vercel project (**Storage → Create Blob Store**).
  2. Add the `BLOB_READ_WRITE_TOKEN` to your project's environment variables
     (and to `.env.local` for local development).
  3. Uploads are stored in Blob automatically. Without the token, uploads fail
     with a clear error.

---

## Scripts

| Script                   | Purpose                                                                |
| ------------------------ | ---------------------------------------------------------------------- |
| `npm run dev`            | Start the dev server at http://localhost:3000                          |
| `npm run build`          | Production build (`prisma generate` + `migrate deploy` + `next build`) |
| `npm start`              | Serve a production build                                               |
| `npm run typecheck`      | Run TypeScript checks                                                  |
| `npm run lint`           | Run ESLint                                                             |
| `npm run format`         | Format with Prettier                                                   |
| `npm run format:check`   | Check formatting without changes                                       |
| `npm run check`          | `typecheck` + `lint` + `format:check`                                  |
| `npm run test`           | Run the Vitest unit suite                                              |
| `npm run e2e`            | Run the Playwright end-to-end suite                                    |
| `npm run prisma:migrate` | Apply migrations (`prisma migrate dev`)                                |
| `npm run prisma:studio`  | Open the Prisma Studio database browser                                |
| `npm run db:seed`        | Seed the database with template content                                |
| `npm run clean`          | Remove build/cache artifacts                                           |
| `npm run rebuild`        | `clean` + `build`                                                      |

---

## Testing

```bash
npm run check    # typecheck + lint + format
npm run test     # unit tests (Vitest)
npm run e2e      # end-to-end tests (Playwright, needs a Postgres DATABASE_URL)
```

- **Unit tests** cover services, repositories, serializers, validators, feeds, MDX,
  media storage, and API route handlers.
- **E2E tests** provision an isolated app + database, seed it, and run browser
  flows (auth, admin CRUD, settings, backup, public content).
- Use `PLAYWRIGHT_DATABASE_URL` to give the isolated e2e run its own database so it
  never touches your real data.

---

## Security

- Single-admin, session-based auth with `iron-session` (HttpOnly, `SameSite=lax`,
  secure cookies in production) and bcrypt password hashing.
- Auth login and public contact submission are rate-limited.
- API input is validated with Zod at every boundary.
- Security headers (`X-Frame-Options`, `X-Content-Type-Options`,
  `Referrer-Policy`) are set for all routes.
- Never commit real secrets. Keep secrets in `.env.local` locally and in your
  hosting provider's environment-variable store in production.

For reporting a security issue, see [`SECURITY.md`](./SECURITY.md).

---

## Troubleshooting

**`prisma migrate deploy` fails with an advisory-lock / P3005 error on Neon**
Your `DATABASE_URL` points at the pooler. Set `DIRECT_URL` to the **non-pooled**
Neon connection string (host without `-pooler`).

**Build fails with "Environment variable not found: DATABASE_URL"**
The build runs Prisma generate/migrate, so both `DATABASE_URL` and `DIRECT_URL`
must be present at build time (Vercel → Project → Settings → Environment
Variables).

**Admin can't sign in**
The admin account is created from `ADMIN_USERNAME` / `ADMIN_PASSWORD` on first
boot. After changing them, ensure the value you type at `/login` matches exactly.

**Uploads disappear after a Vercel redeploy**
Local uploads are ephemeral on Vercel. Enable **Vercel Blob** (see
[Media & File Uploads](#media--file-uploads)) for durable production media.

**`npm run e2e` interferes with my real database**
Provide a dedicated `PLAYWRIGHT_DATABASE_URL` so the e2e bootstrap seeds its own
database.

**I want a fresh start**
`npm run db:seed` resets and reseeds the database with template content (local
dev only). For production, use the admin Backup/Import or Neon snapshots instead.

---

## Contributing

Contributions are welcome — see [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the
setup, verification, and pull-request process. By participating you agree to the
[`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md).

---

## License

This project is released under the [MIT License](./LICENSE). You are free to fork,
modify, and ship your own portfolio off this template — including commercially.

---

## Credits

Built with [Next.js](https://nextjs.org), [React](https://react.dev),
[TypeScript](https://www.typescriptlang.org), [Tailwind CSS](https://tailwindcss.com),
[Prisma](https://www.prisma.io), [Vercel](https://vercel.com), and
[Neon](https://neon.tech).

Author: **Ammar Hany** — if this template helps you, a star or a link back is
always appreciated. Enjoy building your story.
