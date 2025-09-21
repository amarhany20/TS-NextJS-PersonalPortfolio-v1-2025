
# ammarhany.com – Personal Portfolio (Static Version)

This repository is now a **fully static Next.js 15 + TypeScript portfolio**. All previous backend features (Prisma database, authentication, admin panel, API routes, seeding scripts, email, JWT, etc.) have been removed for simplicity and portability.

Content is sourced from simple **static placeholder functions** inside `src/data/index.ts`. Replace those objects/arrays with your real content—no database required.

---

## ✨ Features

- **Static Data**: All portfolio sections use in-repo TypeScript objects (no DB / API).
- **Modern Stack**: Next.js 15 (App Router), TypeScript, Tailwind CSS.
- **Fast & Deployable Anywhere**: Zero runtime dependencies beyond Next.js & React.
- **Simple Customization**: Edit one file: `src/data/index.ts`.
- **Fully Responsive & Accessible UI**.

---

## 🖥️ What’s Included

- **Experience / Education / Skills / Certificates / Recommendations** placeholders
- **Hero + Personal Info + Services** sections
- **Contact + Social Links** layout
- **Login Page** replaced with a static notice (auth removed)

---

## 🚀 Quick Start (Static)

### 1. Clone the Repository

```bash
git clone https://github.com/amarhany20/TS-NextJS-PersonalPortfolio-v1-2025.git
cd TS-NextJS-PersonalPortfolio-v1-2025
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Edit Your Content

Open `src/data/index.ts` and replace placeholder content with your own profile, skills, services, etc.

### 4. Start the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) (or the port shown in your terminal).

---

## �️ Removed Backend

The following were intentionally removed:

- Prisma & SQLite database
- All `/api/*` route handlers
- Admin dashboard (`/admin`)
- Auth (sessions, JWT, login/register forms)
- Seeding scripts & CLI utilities
- Email / rate limiting logic

If you want to reintroduce dynamic content later, you can restore these from version history or rebuild minimal APIs and swap the static loaders.

---

## 🏗️ Project Structure (Simplified)

```
src/
├── app/                # Next.js app directory (routing, pages, layout)
│   ├── layout.tsx      # Main layout with responsive grid
│   ├── page.tsx        # Home page content
│   └── globals.css     # CSS variables and theme
├── components/         # Reusable UI and layout components
│   ├── ProfileSidebar/ # Left sidebar (profile, skills, languages)
│   └── NavSidebar/     # Right sidebar (navigation, social links)
├── data/               # Static placeholder content
├── lib/                # Remaining lightweight utilities (no DB)
├── types/              # TypeScript types
└── public/             # Static assets (images, icons)
```

---

## ⚙️ Tech Stack

- **Framework**: Next.js 15 (App Router, SSR/SSG)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, CSS variables
- **Data Source**: Static TypeScript objects
- **Deployment**: Vercel / Static-friendly platforms

---

## 📦 Scripts

- `npm run dev` – Start development server
- `npm run build` – Build for production
- `npm run lint` – Lint codebase
- `npm run static:info` – Confirms static mode

### Creating User Accounts

User accounts can only be created via the command line. There is no public registration.

#### Linux/macOS

```bash
# Create a basic user
./scripts/create-user.sh user@example.com password123 John Doe USER

# Create an admin user
./scripts/create-user.sh admin@example.com adminpass123 Admin User ADMIN

# Create a super admin user
./scripts/create-user.sh superadmin@example.com superpass123 Super Admin SUPER_ADMIN
```

#### Windows (PowerShell)

```powershell
# Create a basic user
.\scripts\create-user.ps1 -Email user@example.com -Password password123 -FirstName John -LastName Doe -Role USER

# Create an admin user
.\scripts\create-user.ps1 -Email admin@example.com -Password adminpass123 -FirstName Admin -LastName User -Role ADMIN

# Create a super admin user
.\scripts\create-user.ps1 -Email superadmin@example.com -Password superpass123 -FirstName Super -LastName Admin -Role SUPER_ADMIN
```

---

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

## 📝 License

This static version is for personal / portfolio use. For inquiries, use the contact section.

---

**Built with ❤️ by Ammar Hany.**