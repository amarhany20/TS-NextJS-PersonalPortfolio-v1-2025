
# ammarhany.com – Personal Portfolio

This is the source code for [ammarhany.com](https://ammarhany.com), the personal portfolio website of Ammar Hany. It is a modern, database-driven portfolio built with Next.js 15, TypeScript, Tailwind CSS, and Prisma ORM (SQLite). The project showcases professional experience, skills, creative work, and contact information in a fast, accessible, and fully responsive web application.

---

## ✨ Features

- **Database-Driven Content**: All portfolio data (profile, skills, experience, education, certificates, recommendations, etc.) is managed in a SQLite database via Prisma ORM.
- **Modern Stack**: Next.js 15 (App Router, SSR/SSG), TypeScript, Tailwind CSS, and Prisma.
- **Type-Safe & Async**: All data access is type-safe and uses async database service functions.
- **Easy Data Management**: Edit your data visually with Prisma Studio or programmatically via the database services layer.
- **Responsive & Accessible**: Clean, professional design with full accessibility and mobile support.
- **Production-Ready**: Easily deployable to Vercel, your own VPS, or any Node.js hosting.

---

## 🖥️ What’s Included

- **CV/Resume**: Education, work history, skills, and achievements.
- **Portfolio**: Projects, case studies, and creative work.
- **Contact**: Contact form and social links.
- **Admin-Ready**: All data is editable via the database—no need to touch code for content updates.

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/amarhany20/TS-NextJS-PersonalPortfolio-v1-2025.git
cd TS-NextJS-PersonalPortfolio-v1-2025
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup the Database

**For Local Development:**

```bash
npx prisma generate
npx prisma migrate dev
npm run db:seed
```

Or, use the all-in-one script (for production or local):

```bash
chmod +x scripts/setup-database.sh
./scripts/setup-database.sh
```

**For Production:**

- Set your `DATABASE_URL` environment variable (see `.env.example`)
- Run the setup script:
  ```bash
  ./scripts/setup-database.sh
  ```

### 4. Start the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) (or the port shown in your terminal).

---

## 🛡️ Backup & Troubleshooting

**Backup your database:**
```bash
cp prisma/dev.db backup/portfolio-backup-$(date +%Y%m%d).db
sqlite3 prisma/dev.db .dump > backup/portfolio-backup-$(date +%Y%m%d).sql
```

**Restore your database:**
```bash
cp backup/portfolio-backup-YYYYMMDD.db prisma/dev.db
sqlite3 prisma/dev.db < backup/portfolio-backup-YYYYMMDD.sql
```

**Common issues:**
- “Database file not found”: Run `npx prisma migrate dev`
- “Prisma Client not generated”: Run `npx prisma generate`
- “Migration failed”: Check permissions, or run `npx prisma migrate reset` (dev only)

**More help:**  
- Prisma docs: https://www.prisma.io/docs  
- GUI: `npm run db:studio`  
- Reset: `npm run db:reset` (dev only)

---

## 🏗️ Project Structure

```
src/
├── app/                # Next.js app directory (routing, pages, layout)
│   ├── layout.tsx      # Main layout with responsive grid
│   ├── page.tsx        # Home page content
│   └── globals.css     # CSS variables and theme
├── components/         # Reusable UI and layout components
│   ├── ProfileSidebar/ # Left sidebar (profile, skills, languages)
│   └── NavSidebar/     # Right sidebar (navigation, social links)
├── lib/                # Database services and helpers
├── types/              # TypeScript types
└── public/             # Static assets (images, icons)
```

---

## ⚙️ Tech Stack

- **Framework**: Next.js 15 (App Router, SSR/SSG)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, CSS variables
- **Database**: SQLite (via Prisma ORM)
- **Data Access**: Typed async service functions
- **Deployment**: Vercel, Node.js server, or any platform supporting Next.js

---

## 📦 Scripts

- `npm run dev` – Start development server
- `npm run build` – Build for production
- `npm run db:seed` – Seed the database with your data
- `npm run db:studio` – Open Prisma Studio (visual DB editor)
- `npm run db:reset` – Reset database (development only)

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
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

## 📝 License

This project is for personal use. For inquiries, please contact Ammar Hany via the contact section on the website.

---

**Built with ❤️ by Ammar Hany.**