# Quick Start Guide

Follow these steps to get the portfolio running locally on your machine.

## 1️⃣ Prerequisites

- **Node.js**: v20+ ([Download](https://nodejs.org/))
- **npm**: Included with Node.js
- **Git**: For cloning the repository

## 2️⃣ Clone & Install

```bash
git clone https://github.com/amarhany20/TS-NextJS-PersonalPortfolio-v1-2025.git
cd TS-NextJS-PersonalPortfolio-v1-2025
npm install
```

## 3️⃣ Update Environment File

Your `.env` file already exists. Add or verify these required variables:

```env
# 🔐 Session Secret (REQUIRED - generate new for production)
AUTH_SECRET=local-dev-secret-32-characters-minimum-length-OK

# 🌐 Public Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# 📦 Database
DATABASE_URL="file:./dev.db"

# 👤 Seed Credentials
SEED_ADMIN_PASSWORD=change-me-now
SEED_ADMIN_EMAIL=admin@example.com
```

**To generate a production-grade `AUTH_SECRET`:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 4️⃣ Setup Database

```bash
# Create database schema
npm run prisma:migrate

# Populate with sample data (projects, experience, education, etc.)
npm run db:seed
```

You should see: **"Database seed complete."**

## 5️⃣ Start Development Server

```bash
npm run dev
```

Open **http://localhost:3000** in your browser.

### 🔐 Admin Dashboard

- URL: http://localhost:3000/admin
- Username: `admin`
- Password: `change-me-now`

## ✅ Verify Setup

All of these should work without errors:

```bash
npm run typecheck    # Type checking
npm run lint         # Code linting
npm run test         # Unit tests
npm run build        # Production build
```

## 🆘 Troubleshooting

### "Site settings have not been initialised"

This error means the database wasn't seeded. Make sure you ran:

```bash
npm run db:seed
```

If the error persists, reset the database:
```bash
rm dev.db
npm run prisma:migrate
npm run db:seed
```

### "AUTH_SECRET must be 32+ characters"

Your `.env` file is missing or has an invalid `AUTH_SECRET`. Add this to `.env`:

```env
AUTH_SECRET=local-dev-secret-32-characters-minimum-length-OK
```

Or generate a secure one:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Port 3000 is already in use

Change the port:
```bash
npm run dev -- -p 3001
```

Then open http://localhost:3001

## 📚 Next Steps

- **Admin Dashboard**: Access `/admin` to manage all content (portfolio, experience, education, skills, certificates, recommendations, blogs, services)
- **Change theme**: Visit `/admin/settings/theme` to switch between 4 available themes:
  - Professional Dark (default)
  - Modern Gradient
  - Minimal Light
  - Ocean Blue
- **Deploy**: Push to GitHub and deploy via Vercel (zero-config)

## 🎨 Admin Features

All admin CRUD operations are now complete:

- ✅ **Portfolio**: Create, edit, delete, and reorder projects
- ✅ **Experience**: Manage work experience entries
- ✅ **Education**: Track academic achievements
- ✅ **Skills**: Organize skills by category
- ✅ **Certificates**: Document professional certifications
- ✅ **Recommendations**: Collect and curate testimonials
- ✅ **Blogs**: Full-featured blog editor with rich text
- ✅ **Services**: Manage service offerings
- ✅ **Media**: Upload and manage media files
- ✅ **Contact**: View contact form submissions
- ✅ **Settings**: Configure theme, maintenance mode, and profile

See [README.md](README.md) for complete documentation.
