## 🛡️ Backup & Troubleshooting

**Backup your database:**
```bash
# Copy the database file
cp prisma/dev.db backup/portfolio-backup-$(date +%Y%m%d).db

# Or export as SQL
sqlite3 prisma/dev.db .dump > backup/portfolio-backup-$(date +%Y%m%d).sql
```

**Restore your database:**
```bash
# Restore from file copy
cp backup/portfolio-backup-YYYYMMDD.db prisma/dev.db

# Restore from SQL dump
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

# Portfolio Development & Database Setup Guide

## 🚀 How to Install & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
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

### 5. Edit Your Data

- Use Prisma Studio for a GUI:

  ```bash
  npm run db:studio
  ```
- Or edit via code using the database services layer.

---

## 📝 Project & Database Summary

- **Modern Portfolio Stack:**
  - Next.js 15 (TypeScript, App Router, SSR/SSG)
  - Tailwind CSS for styling
  - SQLite database managed by Prisma ORM
  - All portfolio data (profile, skills, experience, etc.) is now in the database, not static files
  - Database services layer for type-safe, async data access in components

- **Key Features:**
  - Fully database-driven content (no more static TypeScript data)
  - All components use async database functions
  - Type safety everywhere (Prisma types, TypeScript)
  - Easy data editing via Prisma Studio GUI
  - Ready for production or local development

- **Database Management:**
  - Prisma schema defines all tables (PersonalInfo, Experience, Education, Skills, Certificates, Recommendations, etc.)
  - Seed script migrates all original data to the database
  - Database can be managed via CLI or GUI (Prisma Studio)
  - Easy backup/restore for SQLite

- **Development Workflow:**
  - All main content is server-rendered (SSR/SSG)
  - Only use client components for interactive UI (sidebars, toggles, etc.)
  - Responsive, accessible layout using Tailwind and CSS variables
  - All static assets in `/public`, all reusable code in `/src/components`

---

## Core Principles

- **Always use SSG/SSR unless `use client` is required**
- **Only use client components when absolutely necessary** (e.g., sidebar toggles, theme switchers, interactive elements)
- **Never use fixed/static pixel sizes for layout**, except for small elements like avatars or icons
- **Use responsive Tailwind classes, rem, %, minmax, or flex/grid utilities**

## Layout Structure

### Three-Area Layout Implementation:

1. **Left Area**: Main info/profile
   - Sticky/fixed on large screens
   - Drawer or top bar on mobile
   - Contains profile information, skills, languages, contact details

2. **Center Area**: Main content
   - Always scrollable
   - Stretches for all devices
   - Contains the main page content

3. **Right Area**: Sidebar navigation
   - Sticky/fixed on large screens
   - Bottom bar or hidden on mobile
   - Contains navigation icons and social links

## Technical Requirements

### CSS and Styling
- **Structure layout using grid or flex utilities in Tailwind**
- **Don't use `position: absolute`** unless needed for overlays
- **Use CSS variables from globals.css** for background, foreground, and fonts
- **All areas and content must be fully responsive and accessible** on laptops, tablets, mobiles

### Assets and Organization
- **All static assets (images, icons) must go in `/public`**
- **Place reusable components in `/src/components`** for organization
- **No code outside `/src/app`** except shared libs, types, config, or `/components`

### HTML and Accessibility
- **Use semantic HTML** (`aside`, `nav`, `main`) 
- **Add alt/aria attributes** for accessibility
- **Test on all screen sizes** and ensure zero overflow or unwanted scroll

## Current Implementation

### Layout Structure
```
├── ProfileSidebar (Left)
│   ├── Profile Image
│   ├── Name and Title
│   ├── Contact Information
│   ├── Core Skills
│   └── Languages
├── Main Content (Center)
│   └── Page-specific content
└── NavSidebar (Right)
    ├── Navigation buttons
    └── Social links
```

### Grid Configuration
- **Mobile**: `grid-cols-1` (single column)
- **Desktop**: `grid-cols-[minmax(240px,18vw)_1fr_minmax(60px,6vw)]`
  - Left: min 240px, max 18vw
  - Center: 1fr (takes remaining space)
  - Right: min 60px, max 6vw

### Responsive Behavior
- **Mobile/Tablet**: Only center content visible
- **Desktop (lg+)**: All three areas visible
- **Sidebars**: Hidden on mobile with `hidden lg:flex`

## File Structure
```
src/
├── app/
│   ├── layout.tsx (Main layout with grid)
│   ├── page.tsx (Home page content)
│   └── globals.css (CSS variables and theme)
├── components/
│   ├── ProfileSidebar.tsx (Left sidebar)
│   └── NavSidebar.tsx (Right sidebar)
└── public/
    └── profile.jpg (Profile image)
```

## CSS Variables Used
- `--background`: Main background color
- `--foreground`: Main text color
- `--font-geist-sans`: Primary font
- `--font-geist-mono`: Monospace font

## Component Guidelines
- **ProfileSidebar**: Server component (no interactivity)
- **NavSidebar**: Client component (has interactive state)
- **Main content**: Server component by default
- **All components**: Use Tailwind utilities, semantic HTML, and responsive design

## Core Principles

- **Always use SSG/SSR unless `use client` is required**
- **Only use client components when absolutely necessary** (e.g., sidebar toggles, theme switchers, interactive elements)
- **Never use fixed/static pixel sizes for layout**, except for small elements like avatars or icons
- **Use responsive Tailwind classes, rem, %, minmax, or flex/grid utilities**

## Layout Structure

### Three-Area Layout Implementation:

1. **Left Area**: Main info/profile
   - Sticky/fixed on large screens
   - Drawer or top bar on mobile
   - Contains profile information, skills, languages, contact details

2. **Center Area**: Main content
   - Always scrollable
   - Stretches for all devices
   - Contains the main page content

3. **Right Area**: Sidebar navigation
   - Sticky/fixed on large screens
   - Bottom bar or hidden on mobile
   - Contains navigation icons and social links

## Technical Requirements

### CSS and Styling
- **Structure layout using grid or flex utilities in Tailwind**
- **Don't use `position: absolute`** unless needed for overlays
- **Use CSS variables from globals.css** for background, foreground, and fonts
- **All areas and content must be fully responsive and accessible** on laptops, tablets, mobiles

### Assets and Organization
- **All static assets (images, icons) must go in `/public`**
- **Place reusable components in `/src/components`** for organization
- **No code outside `/src/app`** except shared libs, types, config, or `/components`

### HTML and Accessibility
- **Use semantic HTML** (`aside`, `nav`, `main`) 
- **Add alt/aria attributes** for accessibility
- **Test on all screen sizes** and ensure zero overflow or unwanted scroll

## Current Implementation

### Layout Structure
```
├── ProfileSidebar (Left)
│   ├── Profile Image
│   ├── Name and Title
│   ├── Contact Information
│   ├── Core Skills
│   └── Languages
├── Main Content (Center)
│   └── Page-specific content
└── NavSidebar (Right)
    ├── Navigation buttons
    └── Social links
```

### Grid Configuration
- **Mobile**: `grid-cols-1` (single column)
- **Desktop**: `grid-cols-[minmax(240px,18vw)_1fr_minmax(60px,6vw)]`
  - Left: min 240px, max 18vw
  - Center: 1fr (takes remaining space)
  - Right: min 60px, max 6vw

### Responsive Behavior
- **Mobile/Tablet**: Only center content visible
- **Desktop (lg+)**: All three areas visible
- **Sidebars**: Hidden on mobile with `hidden lg:flex`

## File Structure
```
src/
├── app/
│   ├── layout.tsx (Main layout with grid)
│   ├── page.tsx (Home page content)
│   └── globals.css (CSS variables and theme)
├── components/
│   ├── ProfileSidebar.tsx (Left sidebar)
│   └── NavSidebar.tsx (Right sidebar)
└── public/
    └── profile.jpg (Profile image)
```

## CSS Variables Used
- `--background`: Main background color
- `--foreground`: Main text color
- `--font-geist-sans`: Primary font
- `--font-geist-mono`: Monospace font

## Component Guidelines
- **ProfileSidebar**: Server component (no interactivity)
- **NavSidebar**: Client component (has interactive state)
- **Main content**: Server component by default
- **All components**: Use Tailwind utilities, semantic HTML, and responsive design
