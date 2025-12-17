# Portfolio Creator - System Architecture

**Version:** 2.00.00  
**Created:** 2025-10-27  
**Updated:** 2025-10-28  
**Author:** Ammar Hany  
**Status:** Active  
**Tags:** [Architecture, Portfolio, Next.js, Dynamic, CMS, Open-Source]

---

## Table of Contents

- [1. Executive Summary](#1-executive-summary)
- [2. Product Vision](#2-product-vision)
- [3. System Architecture Overview](#3-system-architecture-overview)
- [4. Core Principles](#4-core-principles)
- [5. Technology Stack](#5-technology-stack)
- [6. Database Architecture](#6-database-architecture)
- [7. Authentication & Security](#7-authentication--security)
- [8. Initial Setup Wizard](#8-initial-setup-wizard)
- [9. Theme System](#9-theme-system)
- [10. Admin Panel Architecture](#10-admin-panel-architecture)
- [11. Content Management System](#11-content-management-system)
- [12. Media Management](#12-media-management)
- [13. Blog System](#13-blog-system)
- [14. Contact System](#14-contact-system)
- [15. Maintenance Mode](#15-maintenance-mode)
- [16. API Architecture](#16-api-architecture)
- [17. File Structure](#17-file-structure)
- [18. Data Flow](#18-data-flow)
- [19. Deployment Strategy](#19-deployment-strategy)
- [20. Development Phases](#20-development-phases)
- [21. Testing Strategy](#21-testing-strategy)
- [22. Security Considerations](#22-security-considerations)
- [23. Performance Optimization](#23-performance-optimization)
- [24. Decision Log (ADRs)](#24-decision-log-adrs)
- [25. V2 Roadmap](#25-v2-roadmap)
- [26. Glossary](#26-glossary)

---

## 1. Executive Summary

**Portfolio Creator** is an open-source, self-hosted personal portfolio framework built with Next.js 15, TypeScript, and Prisma. It allows developers to clone, deploy, and configure their professional portfolio website through an intuitive admin panel without touching code.

### Key Features

- 🚀 **Easy Deployment**: Clone, deploy to Vercel/hosting, run setup wizard
- 🎨 **Multi-Theme System**: Completely different layouts (Theme 1 existing, Theme 2+ planned)
- 📝 **Full Content Management**: Projects, Blog, Experience, Education, Skills, Services, Certificates, Recommendations
- 🖼️ **Media Library**: Upload and manage images, PDFs with organized storage
- 🔐 **Secure Admin Panel**: Session-based authentication, no email/password complexity for V1
- 💾 **Database Flexibility**: Choose SQLite (local) or Neon PostgreSQL (cloud) during setup
- 🛠️ **Setup Wizard**: Guided first-run configuration for admin account and database
- 🔄 **Maintenance Mode**: Global toggle with custom messages ("Coming Soon", "Under Maintenance")
- 📱 **Fully Responsive**: Both public site and admin panel work on all devices
- ✏️ **Rich Content Editing**: Tiptap rich text editor for descriptions and blog posts
- 📑 **Draft System**: Save drafts, publish when ready, version history tracking
- 🔀 **Drag & Drop Reordering**: Organize content order visually

### Version Strategy

- **V1 (Current Scope):** Open-source, self-hosted, clone-and-deploy model
- **V2 (Future):** SaaS platform with multi-tenancy (not covered in this document)

### Target Users (V1)

- **Primary:** Individual developers seeking a professional portfolio
- **Secondary:** Freelancers, designers, consultants needing online presence
- **Technical Level:** Comfortable with Git, basic deployment concepts, environment variables

---

## 2. Product Vision

### Problem Statement

Developers and professionals need a personal portfolio website to showcase their work, but:
- Building from scratch is time-consuming (design, development, testing)
- Template marketplaces lock you into proprietary platforms or require subscription fees
- Static site generators require content updates in code/markdown files
- Existing CMS platforms are over-engineered for simple portfolio needs
- Designers want professional result without learning React/Next.js

### Solution

Portfolio Creator provides a **professional, production-ready portfolio framework** that can be deployed in minutes and managed through an intuitive admin panel:
- **One-time setup:** Clone repo → Deploy → Run setup wizard → Done
- **No code changes needed:** All content managed through admin dashboard
- **Full ownership:** Self-hosted, open-source, no vendor lock-in
- **Production quality:** Built with industry-standard technologies (Next.js, TypeScript, Prisma)
- **Flexible database:** Choose SQLite for simplicity or Neon PostgreSQL for scale
- **Theme flexibility:** Switch entire layout themes, not just colors

### User Journey (First-Time Setup)

1. **Discovery:** User finds Portfolio Creator on GitHub
2. **Deployment:** Clones repo, deploys to Vercel/hosting platform
3. **First Visit:** System detects no database setup, redirects to `/setup`
4. **Setup Wizard (5 steps):**
   - **Step 1:** Choose database (SQLite local or Neon PostgreSQL cloud)
   - **Step 2:** Configure database connection (auto for SQLite, connection string for Neon)
   - **Step 3:** Create admin account (username, display name, password)
   - **Step 4:** Select theme (Theme 1 existing, more coming soon)
   - **Step 5:** Enter basic information (name, title, bio, social links)
5. **Admin Access:** Redirected to `/admin` dashboard
6. **Content Management:** Start adding portfolio projects, experiences, skills, and other content
7. **Public Site:** Website live at root domain with selected theme

### User Journey (Daily Use)

1. **Admin Login:** Visit `/admin/login` with credentials
2. **Dashboard View:** Quick stats, recent content, quick actions
3. **Content Editing:** Navigate to section (Portfolio, Blog, Experience, etc.)
4. **Make Changes:** Add/edit/reorder content with rich text editor
5. **Save Draft:** Save work-in-progress without publishing
6. **Preview:** See changes on public site before publishing
7. **Publish:** Make changes live when ready
8. **Media Upload:** Add images/PDFs to media library as needed
9. **Settings:** Update theme, maintenance mode, profile info

---

## 3. System Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        PUBLIC WEBSITE                            │
│                        (Next.js App Router)                      │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  /            → Home (dynamic theme-based rendering)      │  │
│  │  /portfolio   → Projects Grid/List                        │  │
│  │  /portfolio/[slug] → Project Details                      │  │
│  │  /blogs       → Blog Posts List                           │  │
│  │  /blogs/[slug] → Blog Post Details                        │  │
│  │  /services    → Services Showcase                         │  │
│  │  /contact     → Contact Form                              │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ▲
                              │ (reads content)
                              │
┌─────────────────────────────▼─────────────────────────────────┐
│                     SETUP WIZARD (First-Run Only)              │
│                     /setup (multi-step wizard)                 │
│                                                                 │
│  Step 1: Database Selection (SQLite / Neon)                   │
│  Step 2: Database Configuration                                │
│  Step 3: Admin Account Creation                                │
│  Step 4: Theme Selection                                       │
│  Step 5: Basic Information                                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        ADMIN PANEL                               │
│                   /admin (authenticated area)                    │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  /admin/dashboard    → Stats, Quick Actions               │  │
│  │  /admin/portfolio    → CRUD Projects + Reorder            │  │
│  │  /admin/blog         → CRUD Blog Posts + Categories/Tags  │  │
│  │  /admin/experience   → CRUD Work Experience + Reorder     │  │
│  │  /admin/education    → CRUD Education + Reorder           │  │
│  │  /admin/skills       → CRUD Skills + Reorder              │  │
│  │  /admin/services     → CRUD Services + Reorder            │  │
│  │  /admin/certificates → CRUD Certificates + Reorder        │  │
│  │  /admin/recommendations → CRUD Recommendations + Reorder  │  │
│  │  /admin/media        → Media Library Upload/Manage        │  │
│  │  /admin/contact      → View Contact Submissions           │  │
│  │  /admin/settings     → Theme, Maintenance, Profile        │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ (API calls)
┌─────────────────────────────────────────────────────────────────┐
│                         API LAYER                                │
│                     /api/v1/* (REST endpoints)                   │
│                                                                   │
│  Auth:         POST /api/v1/auth/login, /logout                 │
│  Portfolio:    GET, POST, PUT, DELETE /api/v1/portfolio         │
│  Blog:         GET, POST, PUT, DELETE /api/v1/blog              │
│  Experience:   GET, POST, PUT, DELETE /api/v1/experience        │
│  Education:    GET, POST, PUT, DELETE /api/v1/education         │
│  Skills:       GET, POST, PUT, DELETE /api/v1/skills            │
│  Services:     GET, POST, PUT, DELETE /api/v1/services          │
│  Certificates: GET, POST, PUT, DELETE /api/v1/certificates      │
│  Recommendations: GET, POST, PUT, DELETE /api/v1/recommendations│
│  Media:        POST /api/v1/media/upload, GET /media/{id}       │
│  Contact:      POST /api/v1/contact                             │
│  Settings:     GET, PUT /api/v1/settings                        │
│  Setup:        POST /api/v1/setup/database, /admin, /settings  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ (Zod validation → route handlers)
┌─────────────────────────────────────────────────────────────────┐
│                       SERVER LAYER                               │
│              src/server/* (business logic layer)                 │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  CONTROLLERS (controllers/)  → Handle requests/responses  │  │
│  │  ├─ PortfolioController                                   │  │
│  │  ├─ BlogController                                        │  │
│  │  ├─ AuthController                                        │  │
│  │  └─ ... (per feature)                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  SERVICES (services/)    → Business logic & validation    │  │
│  │  ├─ PortfolioService                                      │  │
│  │  ├─ BlogService                                           │  │
│  │  ├─ AuthService                                           │  │
│  │  └─ ... (per feature)                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  REPOSITORIES (repositories/) → Data access layer         │  │
│  │  ├─ PortfolioRepository                                   │  │
│  │  ├─ BlogRepository                                        │  │
│  │  ├─ UserRepository                                        │  │
│  │  └─ ... (per entity)                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  SERIALIZERS (serializers/) → Transform DB to API format  │  │
│  │  ├─ serializePortfolioProject()                           │  │
│  │  ├─ serializeBlogPost()                                   │  │
│  │  └─ ... (per entity)                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ (Prisma ORM)
┌─────────────────────────────────────────────────────────────────┐
│                       DATABASE LAYER                             │
│                   (SQLite or Neon PostgreSQL)                    │
│                                                                   │
│  Tables:                                                         │
│  ├─ User (admin account)                                        │
│  ├─ Settings (theme, maintenance, profile)                      │
│  ├─ Portfolio (projects)                                        │
│  ├─ Blog (posts)                                                │
│  ├─ Category (blog organization)                                │
│  ├─ Tag (blog tagging)                                          │
│  ├─ Experience (work history)                                   │
│  ├─ Education (academic background)                             │
│  ├─ Skill (technical skills)                                    │
│  ├─ Service (offerings)                                         │
│  ├─ Certificate (certifications)                                │
│  ├─ Recommendation (testimonials)                               │
│  ├─ Media (uploaded files)                                      │
│  ├─ ContactSubmission (contact form entries)                    │
│  └─ ContentVersion (version history for drafts)                 │
└─────────────────────────────────────────────────────────────────┘
```

### Request Flow Examples

#### Example 1: Public Page Load (`GET /portfolio`)

```
User Browser
     │
     ▼
[1] GET /portfolio (Next.js Page Component)
     │
     ▼
[2] Server Component fetches data
     │──> PortfolioRepository.findAllPublished()
     │         │
     │         ▼
[3] Prisma query: prisma.portfolio.findMany({ where: { published: true } })
     │         │
     │         ▼
[4] Database returns portfolio records
     │         │
     │         ▼
[5] serializePortfolioProject() transforms data
     │         │
     │         ▼
[6] Next.js renders page with data
     │
     ▼
User sees portfolio grid
```

#### Example 2: Admin Content Update (`PUT /api/v1/portfolio/123`)

```
Admin Panel UI
     │
     ▼
[1] User clicks "Save" on portfolio edit form
     │
     ▼
[2] Client-side validation (Zod schema)
     │
     ▼
[3] PUT /api/v1/portfolio/123 (Request with JSON body)
     │
     ▼
[4] API Route Handler (route.ts)
     │──> Auth middleware checks session
     │──> Server-side validation (Zod schema)
     │
     ▼
[5] PortfolioController.update(id, data)
     │
     ▼
[6] PortfolioService.update(id, data)
     │──> Business logic validation
     │──> Slug generation/uniqueness
     │
     ▼
[7] PortfolioRepository.update(id, data)
     │
     ▼
[8] Prisma update: prisma.portfolio.update({ where: { id }, data })
     │
     ▼
[9] Database persists changes
     │
     ▼
[10] serializePortfolioProject() formats response
     │
     ▼
[11] successResponse() returns JSON
     │
     ▼
Admin Panel shows success message + updated data
```

#### Example 3: Media Upload (`POST /api/v1/media/upload`)

```
Admin Media Library UI
     │
     ▼
[1] User selects file(s) and clicks "Upload"
     │
     ▼
[2] FormData with file(s) sent to POST /api/v1/media/upload
     │
     ▼
[3] API Route Handler
     │──> Auth middleware validates session
     │──> File validation (type, size, dimensions)
     │
     ▼
[4] MediaController.upload(files)
     │
     ▼
[5] MediaService.upload(files)
     │──> Generate unique filename
     │──> Resize/optimize image (if applicable)
     │──> Save to /public/uploads/
     │
     ▼
[6] MediaRepository.create(metadata)
     │
     ▼
[7] Prisma create: prisma.media.create({ data: { filename, path, type, size } })
     │
     ▼
[8] Database stores media metadata
     │
     ▼
[9] serializeMedia() formats response with public URL
     │
     ▼
[10] successResponse() returns media data
     │
     ▼
Admin sees uploaded file in media library
```

---

## 4. Core Principles

### Engineering Principles

1. **Separation of Concerns**
   - API layer (route handlers) focuses on HTTP concerns
   - Services layer contains business logic
   - Repositories handle data access
   - Serializers transform data shapes
   - Clear boundaries between layers

2. **Validation at Boundaries**
   - Client-side validation for UX (Zod schemas in `@/client-validators`)
   - Server-side validation for security (Zod schemas in `@/server/server-validators`)
   - API validates all incoming requests
   - Services validate business rules

3. **Type Safety**
   - TypeScript strict mode enabled
   - Prisma generates type-safe database client
   - Zod ensures runtime type validation
   - Type definitions in `@/types`

4. **Error Handling**
   - Custom error classes with HTTP status codes
   - Consistent error response format
   - User-friendly error messages
   - Development vs. production error details

5. **Security First**
   - Session-based authentication with secure cookies
   - Password hashing with bcrypt
   - CSRF protection on forms
   - Input sanitization for XSS prevention
   - SQL injection prevention via Prisma ORM

6. **Performance**
   - Static generation where possible (Next.js)
   - Dynamic rendering only when needed
   - Database query optimization
   - Image optimization (Next.js Image component)
   - Caching strategy for public content

### Development Principles

1. **Code Quality**
   - ESLint + Prettier for consistent formatting
   - TypeScript strict mode
   - Comprehensive testing (unit + integration + E2E)
   - Code reviews via pull requests

2. **Documentation**
   - Inline JSDoc comments for complex logic
   - API endpoint documentation
   - Database schema documentation
   - Setup and deployment guides

3. **Maintainability**
   - Clear folder structure
   - Consistent naming conventions
   - DRY (Don't Repeat Yourself)
   - Single Responsibility Principle

4. **Scalability**
   - Modular architecture (easy to add features)
   - Database agnostic (SQLite → PostgreSQL migration path)
   - Theme system extensible
   - API versioning (`/api/v1/`)

---

## 5. Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.4.1 | React framework with App Router, SSR, SSG |
| **React** | 19.1.0 | UI component library |
| **TypeScript** | 5.x | Type safety, developer experience |
| **Tailwind CSS** | 4.x | Utility-first CSS framework |
| **Tiptap** | Latest | Rich text editor for content |
| **React Hook Form** | Latest | Form handling with validation |
| **Zod** | Latest | Schema validation (client + server) |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 20+ | JavaScript runtime |
| **Prisma** | Latest | ORM for database access |
| **SQLite** | - | Development/simple deployments database |
| **Neon PostgreSQL** | - | Production cloud database option |
| **bcrypt** | Latest | Password hashing |
| **iron-session** | Latest | Encrypted session management |
| **Zod** | Latest | Server-side validation |

### Development Tools

| Tool | Purpose |
|------|---------|
| **ESLint** | Code linting |
| **Prettier** | Code formatting |
| **Vitest** | Unit + integration testing |
| **Playwright** | End-to-end testing |
| **TypeScript** | Static type checking |
| **Git** | Version control |

### Deployment

| Platform | Usage |
|----------|-------|
| **Vercel** | Recommended (zero-config Next.js hosting) |
| **Netlify** | Alternative hosting |
| **Self-hosted** | VPS/server deployment option |
| **Neon** | Cloud PostgreSQL database |

### Key Dependencies (package.json)

```json
{
  "dependencies": {
    "next": "15.4.1",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "@prisma/client": "latest",
    "zod": "latest",
    "bcrypt": "latest",
    "iron-session": "latest",
    "@tiptap/react": "latest",
    "@tiptap/starter-kit": "latest",
    "react-hook-form": "latest",
    "@hookform/resolvers": "latest",
    "clsx": "latest",
    "tailwind-merge": "latest"
  },
  "devDependencies": {
    "@types/node": "latest",
    "@types/react": "latest",
    "typescript": "5.x",
    "eslint": "latest",
    "eslint-config-next": "latest",
    "prettier": "latest",
    "prisma": "latest",
    "vitest": "latest",
    "@playwright/test": "latest",
    "tailwindcss": "4.x",
    "postcss": "latest",
    "autoprefixer": "latest"
  }
}
```

### Why These Technologies?

- **Next.js 15:** Latest version with App Router for modern React patterns, excellent performance, SEO
- **TypeScript:** Catch errors at compile time, better IDE support, self-documenting code
- **Prisma:** Type-safe database access, migrations, supports multiple databases
- **Tailwind CSS:** Rapid UI development, consistent design system, small bundle size
- **Tiptap:** Modern WYSIWYG editor built on ProseMirror, extensible, TypeScript support
- **Zod:** Runtime validation with TypeScript inference, works client + server
- **iron-session:** Secure stateless session management, no database needed for sessions
- **bcrypt:** Industry-standard password hashing, proven security
- **SQLite:** Zero-config database for simple deployments, perfect for personal portfolios
- **Neon PostgreSQL:** Serverless PostgreSQL for scalability, generous free tier

---

## 6. Database Architecture

### Database Selection Strategy

Users choose between two database options during setup wizard:

| Option | Use Case | Pros | Cons |
|--------|----------|------|------|
| **SQLite** | Personal portfolios, simple hosting | Zero config, file-based, portable, no external dependencies | Single file limits, not ideal for high traffic |
| **Neon PostgreSQL** | Production deployments, scalability | Cloud-hosted, scalable, free tier available, backups | Requires internet connection, external dependency |

### Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite" // or "postgresql"
  url      = env("DATABASE_URL")
}

// ==================== CORE ====================

model User {
  id           String   @id @default(cuid())
  username     String   @unique
  displayName  String
  password     String   // bcrypt hashed
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@map("users")
}

model Settings {
  id              String   @id @default(cuid())
  theme           String   @default("theme-1") // theme identifier
  maintenanceMode Boolean  @default(false)
  maintenanceMessage String? // custom message for maintenance page
  profileName     String
  profileTitle    String
  profileBio      String   @db.Text
  profileEmail    String?
  profilePhone    String?
  profileLocation String?
  socialGithub    String?
  socialLinkedin  String?
  socialTwitter   String?
  socialYoutube   String?
  socialWebsite   String?
  seoTitle        String?
  seoDescription  String?
  seoKeywords     String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@map("settings")
}

// ==================== CONTENT ====================

model Portfolio {
  id              String   @id @default(cuid())
  slug            String   @unique
  title           String
  shortDescription String  @db.Text
  fullDescription  String  @db.Text // Tiptap HTML
  category        String   // "Web Development", "Mobile App", etc.
  client          String?
  year            Int
  duration        String?  // "3 months", "Ongoing", etc.
  technologies    String   // JSON array: ["React", "Node.js"]
  features        String   // JSON array: ["Feature 1", "Feature 2"]
  challenges      String?  @db.Text
  solutions       String?  @db.Text
  results         String?  @db.Text
  liveUrl         String?
  githubUrl       String?
  images          String   // JSON array: ["/uploads/project1-1.jpg"]
  coverImage      String   // Main image URL
  published       Boolean  @default(false)
  displayOrder    Int      @default(0)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@map("portfolio")
}

model Blog {
  id              String   @id @default(cuid())
  slug            String   @unique
  title           String
  excerpt         String   @db.Text
  content         String   @db.Text // Markdown/MDX or Tiptap HTML
  coverImage      String?
  published       Boolean  @default(false)
  publishedAt     DateTime?
  readTime        Int?     // minutes
  views           Int      @default(0)
  seoTitle        String?
  seoDescription  String?
  seoKeywords     String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  categories Category[]
  tags       Tag[]

  @@map("blog")
}

model Category {
  id        String   @id @default(cuid())
  name      String   @unique
  slug      String   @unique
  description String?
  createdAt DateTime @default(now())

  blogs Blog[]

  @@map("categories")
}

model Tag {
  id        String   @id @default(cuid())
  name      String   @unique
  slug      String   @unique
  createdAt DateTime @default(now())

  blogs Blog[]

  @@map("tags")
}

model Experience {
  id              String   @id @default(cuid())
  company         String
  position        String
  location        String?
  startDate       DateTime
  endDate         DateTime?
  current         Boolean  @default(false)
  description     String   @db.Text // Tiptap HTML
  technologies    String?  // JSON array
  achievements    String?  // JSON array
  displayOrder    Int      @default(0)
  published       Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@map("experience")
}

model Education {
  id              String   @id @default(cuid())
  institution     String
  degree          String
  field           String
  location        String?
  startDate       DateTime
  endDate         DateTime?
  current         Boolean  @default(false)
  grade           String?  // "3.8 GPA", "First Class", etc.
  description     String?  @db.Text
  achievements    String?  // JSON array
  displayOrder    Int      @default(0)
  published       Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@map("education")
}

model Skill {
  id              String   @id @default(cuid())
  name            String
  category        String   // "Frontend", "Backend", "Database", etc.
  proficiency     Int      // 1-100
  icon            String?  // icon identifier or URL
  displayOrder    Int      @default(0)
  published       Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@map("skills")
}

model Service {
  id              String   @id @default(cuid())
  title           String
  shortDescription String  @db.Text
  fullDescription  String  @db.Text // Tiptap HTML
  icon            String?  // icon identifier
  pricing         String?  // "Starting at $500", "Contact for quote"
  features        String   // JSON array
  displayOrder    Int      @default(0)
  published       Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@map("services")
}

model Certificate {
  id              String   @id @default(cuid())
  title           String
  issuer          String
  issueDate       DateTime
  expiryDate      DateTime?
  credentialId    String?
  credentialUrl   String?
  description     String?  @db.Text
  skills          String?  // JSON array
  image           String?
  displayOrder    Int      @default(0)
  published       Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@map("certificates")
}

model Recommendation {
  id              String   @id @default(cuid())
  name            String
  position        String
  company         String?
  relationship    String   // "Manager", "Client", "Colleague"
  text            String   @db.Text
  avatar          String?
  linkedinUrl     String?
  displayOrder    Int      @default(0)
  published       Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@map("recommendations")
}

// ==================== MEDIA ====================

model Media {
  id              String   @id @default(cuid())
  filename        String
  originalName    String
  path            String   // relative path from public/
  publicUrl       String   // full public URL
  mimeType        String
  size            Int      // bytes
  width           Int?     // for images
  height          Int?     // for images
  alt             String?
  createdAt       DateTime @default(now())

  @@map("media")
}

// ==================== CONTACT ====================

model ContactSubmission {
  id        String   @id @default(cuid())
  name      String
  email     String
  subject   String?
  message   String   @db.Text
  ipAddress String?
  userAgent String?
  read      Boolean  @default(false)
  createdAt DateTime @default(now())

  @@map("contact_submissions")
}

// ==================== VERSIONING ====================

model ContentVersion {
  id          String   @id @default(cuid())
  contentType String   // "portfolio", "blog"
  contentId   String   // ID of Portfolio or Blog (polymorphic, no direct relation)
  content     String   @db.Text // JSON snapshot of content
  createdAt   DateTime @default(now())
  createdBy   String?  // User ID

  // NOTE: No Prisma relations here due to polymorphic nature
  // Query manually in application code based on contentType
  // Example: prisma.contentVersion.findMany({ where: { contentType: 'portfolio', contentId: portfolioId } })

  @@index([contentType, contentId])
  @@map("content_versions")
}
```

### Database Relationships

```
User (1) ──────────────────────> (N) ContentVersion [createdBy, no Prisma relation]

Settings (1) ────────────────────> [Global singleton]

Portfolio (1) ──────────────────> (N) ContentVersion [via contentType + contentId, queried manually]
Blog (1) ────────────────────────> (N) ContentVersion [via contentType + contentId, queried manually]

Blog (N) ───────────────────────> (N) Category [many-to-many]
Blog (N) ───────────────────────> (N) Tag [many-to-many]

Media (N) ───────────────────────> [Standalone, referenced by URLs in other tables]

ContactSubmission (N) ───────────> [Standalone]

NOTE: ContentVersion uses polymorphic pattern - no direct Prisma relations.
Query versions using: prisma.contentVersion.findMany({ where: { contentType, contentId } })
```

### Indexes for Performance

```prisma
// Add to models for query optimization

@@index([published, displayOrder]) // Portfolio, Experience, etc.
@@index([slug]) // Portfolio, Blog (already unique, but explicitly indexed)
@@index([published, publishedAt]) // Blog
@@index([createdAt]) // ContactSubmission
```

### Migration Strategy

1. **Initial Setup:** `npx prisma migrate dev --name init`
2. **Schema Changes:** Create new migration with descriptive name
3. **Production Deployment:** `npx prisma migrate deploy`

### Data Import from Static Content

**Important:** The `src/static-content/` directory contains reference data from the original static portfolio. This data is:
- **One-time use only**: Serves as a reference for the initial portfolio structure
- **Will be deleted**: After V1 is complete, this directory will be removed
- **Not auto-imported**: Users manually add their own content through the admin panel

The static-content exists to:
1. Provide a working example of the current portfolio
2. Serve as a reference during migration from static to dynamic
3. Help developers understand the data structure

**Migration Note:** Developers can optionally create a one-time migration script to import their personal static-content data, but this is not part of the core setup wizard.

---

## 7. Authentication & Security

### Authentication Flow

#### Session-Based Authentication (iron-session)

```typescript
// src/server/security/session.ts

import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

export interface SessionData {
  userId: string;
  username: string;
  isAuthenticated: boolean;
}

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), {
    cookieName: 'portfolio_session',
    password: process.env.SESSION_SECRET!, // 32+ characters
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  });
}

export async function createSession(userId: string, username: string) {
  const session = await getSession();
  session.userId = userId;
  session.username = username;
  session.isAuthenticated = true;
  await session.save();
}

export async function destroySession() {
  const session = await getSession();
  session.destroy();
}
```

#### Login Flow

```
1. User submits credentials on /admin/login
2. POST /api/v1/auth/login
3. Server validates credentials:
   - Find user by username
   - Compare password with bcrypt.compare()
4. If valid:
   - Create session with createSession()
   - Return success response
5. Client redirects to /admin/dashboard
```

#### Protected Route Middleware

```typescript
// src/server/security/auth.ts

export async function requireAuth() {
  const session = await getSession();
  
  if (!session.isAuthenticated) {
    throw new UnauthorizedError('Authentication required');
  }
  
  return session;
}
```

#### API Route Protection

```typescript
// src/app/api/v1/portfolio/route.ts

export async function POST(request: Request) {
  try {
    // Require authentication
    const session = await requireAuth();
    
    // ... rest of handler
  } catch (error) {
    return errorResponse(error);
  }
}
```

### Password Security

```typescript
// src/server/services/AuthService.ts

import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

export class AuthService {
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }
  
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
  
  async login(username: string, password: string) {
    const user = await this.userRepository.findByUsername(username);
    
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }
    
    const valid = await this.verifyPassword(password, user.password);
    
    if (!valid) {
      throw new UnauthorizedError('Invalid credentials');
    }
    
    await createSession(user.id, user.username);
    
    return {
      userId: user.id,
      username: user.username,
      displayName: user.displayName,
    };
  }
}
```

### Security Best Practices

1. **Password Requirements (V1 - Simple):**
   - Minimum 8 characters
   - No complexity requirements for V1
   - Stored as bcrypt hash

2. **Session Security:**
   - HttpOnly cookies (no JavaScript access)
   - Secure flag in production (HTTPS only)
   - SameSite: 'lax' (CSRF protection)
   - 7-day expiration with sliding window

3. **CSRF Protection:**
   - SameSite cookies
   - Next.js built-in CSRF handling
   - Token validation for sensitive operations

4. **XSS Prevention:**
   - Input sanitization on API boundaries
   - React's built-in XSS protection
   - Content Security Policy headers

5. **SQL Injection Prevention:**
   - Prisma ORM (parameterized queries)
   - No raw SQL queries

6. **Rate Limiting:**
   - Login endpoint: 5 attempts per IP per 15 minutes
   - Contact form: 3 submissions per IP per hour
   - API endpoints: 100 requests per IP per minute

### Admin Panel Access Control

```typescript
// src/app/admin/layout.tsx

import { redirect } from 'next/navigation';
import { getSession } from '@/server/security/session';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  
  if (!session.isAuthenticated) {
    redirect('/admin/login');
  }
  
  return (
    <div className="admin-layout">
      {/* Admin navigation */}
      {children}
    </div>
  );
}
```

---

## 8. Initial Setup Wizard

### Setup Wizard Flow

The setup wizard runs on first application launch and creates the foundational configuration.

#### Wizard Steps

```
┌─────────────────────────────────────────────────────────────┐
│ Step 1: Welcome & Database Selection                        │
│                                                               │
│  ○ SQLite (Local file-based database)                       │
│     • Best for: Personal portfolios, simple hosting         │
│     • No configuration needed                                │
│                                                               │
│  ○ Neon PostgreSQL (Cloud database)                         │
│     • Best for: Production deployments, scalability         │
│     • Requires connection string                             │
│                                                               │
│  [Next →]                                                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Step 2: Database Configuration                               │
│                                                               │
│  IF SQLite:                                                  │
│    ✓ Auto-configured (file: ./prisma/dev.db)                │
│    [Next →]                                                  │
│                                                               │
│  IF Neon PostgreSQL:                                         │
│    Connection String:                                        │
│    [postgresql://user:pass@host/db_____________________]    │
│    [Test Connection]  [Next →]                              │
│                                                               │
│    ⚠️ If database already exists: Will detect and skip      │
│       initialization (prevents data loss)                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Step 3: Create Admin Account                                │
│                                                               │
│  Username:      [ammar__________________________]           │
│  Display Name:  [Ammar Hany_____________________]           │
│  Password:      [••••••••_______________________]           │
│  Confirm:       [••••••••_______________________]           │
│                                                               │
│  [Next →]                                                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Step 4: Select Theme                                         │
│                                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │ Theme 1  │  │ Theme 2  │  │ Theme 3  │                 │
│  │ (Current)│  │ (Coming) │  │ (Coming) │                 │
│  │ [●]      │  │ [ ]      │  │ [ ]      │                 │
│  └──────────┘  └──────────┘  └──────────┘                 │
│                                                               │
│  [Next →]                                                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Step 5: Basic Information                                    │
│                                                               │
│  Full Name:     [Ammar Hany_____________________]           │
│  Title:         [Full-Stack Developer___________]           │
│  Email:         [ammar@example.com______________]           │
│  Phone:         [+1 234 567 8900________________]           │
│  Location:      [Cairo, Egypt___________________]           │
│                                                               │
│  Bio:                                                        │
│  [Full-stack developer with 5+ years...________]           │
│  [______________________________________________]           │
│                                                               │
│  Social Links (optional):                                   │
│  GitHub:        [github.com/ammar_______________]           │
│  LinkedIn:      [linkedin.com/in/ammar_________]           │
│  Twitter:       [twitter.com/ammar_____________]           │
│                                                               │
│  [Complete Setup →]                                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Setup Progress                                               │
│                                                               │
│  ✓ Database configured                                       │
│  ✓ Admin account created                                     │
│  ✓ Theme selected                                            │
│  ✓ Basic information saved                                   │
│  ⏳ Finalizing setup...                                       │
│     [████████████████████████] 100%                          │
│                                                               │
│  Please wait...                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Setup Complete! 🎉                                           │
│                                                               │
│  Your portfolio is ready!                                   │
│                                                               │
│  You can now start adding your content:                     │
│  • Portfolio projects                                       │
│  • Work experiences                                         │
│  • Education background                                     │
│  • Skills & expertise                                       │
│  • Services offered                                         │
│  • Certificates & achievements                              │
│  • Recommendations & testimonials                           │
│                                                               │
│  [Go to Admin Dashboard →]                                   │
└─────────────────────────────────────────────────────────────┘
```

### Implementation Details

#### Setup Detection

```typescript
// src/middleware.ts or app check

import { prisma } from '@/server/db/prisma';

export async function checkSetupComplete() {
  try {
    // Check if Settings table exists and has data
    const settings = await prisma.settings.findFirst();
    return !!settings;
  } catch {
    return false;
  }
}

// In root layout or middleware
const setupComplete = await checkSetupComplete();
if (!setupComplete && pathname !== '/setup') {
  redirect('/setup');
}
```

#### API Endpoints

```typescript
// POST /api/v1/setup/database
// - Validates connection string (if Neon)
// - Checks if database already exists (prevents re-initialization)
// - If new: Updates .env and runs migrations
// - If exists: Skip initialization, use existing database
// - Returns success/error

// POST /api/v1/setup/admin
// - Creates User record with hashed password
// - Returns success

// POST /api/v1/setup/settings
// - Creates Settings record with theme, profile info
// - Returns success
```

#### Setup Lock

Once setup completes, prevent re-running:

```typescript
// Create .setup-complete marker file
await fs.writeFile('.setup-complete', new Date().toISOString());

// Check in setup route
if (await checkSetupComplete() || fs.existsSync('.setup-complete')) {
  redirect('/admin/dashboard');
}
```

---

## 9. Theme System

### Theme Architecture

Themes are **completely different layouts**, not just color variations. Each theme has its own:
- Component structure
- Layout patterns
- Navigation styles
- Content presentation
- Animations/interactions

### Theme Structure

```
src/
├── themes/
│   ├── theme-1/              # Current existing theme
│   │   ├── components/
│   │   │   ├── Hero.tsx
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── BlogCard.tsx
│   │   │   └── ...
│   │   ├── layouts/
│   │   │   ├── HomeLayout.tsx
│   │   │   ├── PortfolioLayout.tsx
│   │   │   └── BlogLayout.tsx
│   │   ├── styles/
│   │   │   └── theme.css     # Theme-specific styles
│   │   └── config.ts         # Theme metadata
│   │
│   ├── theme-2/              # Future theme
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── styles/
│   │   └── config.ts
│   │
│   └── index.ts              # Theme registry
```

### Theme Configuration

```typescript
// src/themes/theme-1/config.ts

export const themeConfig = {
  id: 'theme-1',
  name: 'Professional Dark',
  description: 'Modern dark theme with sidebar navigation',
  preview: '/themes/theme-1-preview.jpg',
  author: 'Ammar Hany',
  version: '1.0.0',
  colors: {
    primary: '#00D4FF',
    secondary: '#FF6B6B',
    background: '#0A0E1A',
    surface: '#151923',
    text: '#E5E7EB',
  },
  features: [
    'Sidebar navigation',
    'Project grid layout',
    'Smooth animations',
    'Dark mode optimized',
  ],
};
```

### Theme Registry

```typescript
// src/themes/index.ts

import { themeConfig as theme1 } from './theme-1/config';
// import { themeConfig as theme2 } from './theme-2/config';

export const AVAILABLE_THEMES = {
  'theme-1': theme1,
  // 'theme-2': theme2,
};

export function getThemeConfig(themeId: string) {
  return AVAILABLE_THEMES[themeId as keyof typeof AVAILABLE_THEMES];
}
```

### Dynamic Theme Loading

```typescript
// src/app/layout.tsx or page components

import { prisma } from '@/server/db/prisma';
import { getThemeConfig } from '@/themes';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Fetch current theme from settings
  const settings = await prisma.settings.findFirst();
  const currentTheme = settings?.theme || 'theme-1';
  
  // Load theme config
  const themeConfig = getThemeConfig(currentTheme);
  
  return (
    <html lang="en" data-theme={currentTheme}>
      <head>
        <style>{`:root {
          --color-primary: ${themeConfig.colors.primary};
          --color-secondary: ${themeConfig.colors.secondary};
          --color-background: ${themeConfig.colors.background};
          --color-surface: ${themeConfig.colors.surface};
          --color-text: ${themeConfig.colors.text};
        }`}</style>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
```

### Theme Switching

```typescript
// Admin Settings Page

async function handleThemeChange(newThemeId: string) {
  const response = await fetch('/api/v1/settings/theme', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ theme: newThemeId }),
  });
  
  if (response.ok) {
    // Reload page to apply new theme
    window.location.reload();
  }
}
```

### Theme Preview

Admin can preview themes before applying:

```typescript
// /admin/settings/themes with preview mode

<div className="theme-grid">
  {Object.values(AVAILABLE_THEMES).map((theme) => (
    <ThemeCard
      key={theme.id}
      theme={theme}
      isCurrent={theme.id === currentTheme}
      onPreview={() => openPreview(theme.id)}
      onApply={() => handleThemeChange(theme.id)}
    />
  ))}
</div>
```

---

## 10. Admin Panel Architecture

### Admin Panel Structure

```
/admin
├── /login                    → Login page (public)
├── /dashboard                → Main dashboard (authenticated)
│   ├── Quick stats (DB counts)
│   ├── Recent content
│   └── Quick actions
│
├── /portfolio
│   ├── /                     → List all projects (with search, filter)
│   ├── /new                  → Create new project
│   ├── /[id]/edit            → Edit project
│   └── /reorder              → Drag-drop reordering
│
├── /blog
│   ├── /                     → List all posts
│   ├── /new                  → Create new post
│   ├── /[id]/edit            → Edit post
│   ├── /categories           → Manage categories
│   └── /tags                 → Manage tags
│
├── /experience
│   ├── /                     → List experiences
│   ├── /new                  → Add experience
│   ├── /[id]/edit            → Edit experience
│   └── /reorder              → Reorder
│
├── /education
│   ├── /                     → List education
│   ├── /new                  → Add education
│   ├── /[id]/edit            → Edit education
│   └── /reorder              → Reorder
│
├── /skills
│   ├── /                     → List skills (grouped by category)
│   ├── /new                  → Add skill
│   ├── /[id]/edit            → Edit skill
│   └── /reorder              → Reorder within categories
│
├── /services
│   ├── /                     → List services
│   ├── /new                  → Add service
│   ├── /[id]/edit            → Edit service
│   └── /reorder              → Reorder
│
├── /certificates
│   ├── /                     → List certificates
│   ├── /new                  → Add certificate
│   ├── /[id]/edit            → Edit certificate
│   └── /reorder              → Reorder
│
├── /recommendations
│   ├── /                     → List recommendations
│   ├── /new                  → Add recommendation
│   ├── /[id]/edit            → Edit recommendation
│   └── /reorder              → Reorder
│
├── /media
│   ├── /                     → Media library grid
│   └── /upload               → Upload interface
│
├── /contact
│   └── /                     → View contact submissions
│
└── /settings
    ├── /general              → Profile info, SEO
    ├── /theme                → Theme selection with previews
    ├── /maintenance          → Maintenance mode toggle
    └── /account              → Change password
```

### Responsive Design

Admin panel must be fully responsive:

```css
/* Mobile-first approach */

/* Mobile (< 768px) */
.admin-layout {
  display: flex;
  flex-direction: column;
}

.admin-sidebar {
  position: fixed;
  transform: translateX(-100%);
  transition: transform 0.3s;
}

.admin-sidebar.open {
  transform: translateX(0);
}

/* Tablet (≥ 768px) */
@media (min-width: 768px) {
  .admin-layout {
    flex-direction: row;
  }
  
  .admin-sidebar {
    position: static;
    transform: none;
  }
}

/* Desktop (≥ 1024px) */
@media (min-width: 1024px) {
  .admin-content {
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

---

## 11. Content Management System

### CRUD Operations

All content types follow the same pattern:

**CREATE:**
```typescript
POST /api/v1/{contentType}
Body: { title, ...fields }
Response: { id, ...createdContent }
```

**READ:**
```typescript
GET /api/v1/{contentType}           # List all
GET /api/v1/{contentType}/{id}      # Get by ID
GET /api/v1/{contentType}/slug/{slug}  # Get by slug
```

**UPDATE:**
```typescript
PUT /api/v1/{contentType}/{id}
Body: { ...updatedFields }
Response: { ...updatedContent }
```

**DELETE:**
```typescript
DELETE /api/v1/{contentType}/{id}
Response: { success: true }
```

**REORDER:**
```typescript
PUT /api/v1/{contentType}/reorder
Body: [{ id: "1", displayOrder: 0 }, { id: "2", displayOrder: 1 }]
Response: { success: true }
```

### Draft & Publish System

```typescript
// Portfolio example (same pattern for Blog)

interface Portfolio {
  published: boolean;  // Draft when false, Published when true
  updatedAt: DateTime; // Track last modification
}

// Save as draft
await prisma.portfolio.update({
  where: { id },
  data: { ...content, published: false },
});

// Publish
await prisma.portfolio.update({
  where: { id },
  data: { published: true },
});
```

### Version History

```typescript
// Before updating content, save current version

async function saveVersion(contentType: string, contentId: string) {
  const current = await prisma[contentType].findUnique({
    where: { id: contentId },
  });
  
  await prisma.contentVersion.create({
    data: {
      contentType,
      contentId,
      content: JSON.stringify(current),
      createdBy: session.userId,
    },
  });
}

// Restore from version
async function restoreVersion(versionId: string) {
  const version = await prisma.contentVersion.findUnique({
    where: { id: versionId },
  });
  
  const content = JSON.parse(version.content);
  
  await prisma[version.contentType].update({
    where: { id: version.contentId },
    data: content,
  });
}
```

### Rich Text Editor (Tiptap)

```typescript
// src/components/admin/TiptapEditor.tsx

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';

export function TiptapEditor({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link,
      Image,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });
  
  return (
    <div className="tiptap-wrapper">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} className="prose" />
    </div>
  );
}
```

### Slug Generation

```typescript
// src/server/server-utils/slug.ts

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Ensure unique slug
export async function generateUniqueSlug(title: string, contentType: string, excludeId?: string) {
  let slug = generateSlug(title);
  let counter = 1;
  
  while (true) {
    const existing = await prisma[contentType].findUnique({
      where: { slug },
    });
    
    if (!existing || existing.id === excludeId) {
      return slug;
    }
    
    slug = `${generateSlug(title)}-${counter}`;
    counter++;
  }
}
```

---

## 12. Media Management

### Media Upload Flow

```
User clicks "Upload" in Admin Media Library
     │
     ▼
FormData with file(s) sent to POST /api/v1/media/upload
     │
     ▼
API Route Handler
│──> Auth check
│──> File validation (type, size, dimensions)
     │
     ▼
MediaController.upload(files)
     │
     ▼
MediaService.upload(files)
│──> Generate unique filename (timestamp + random)
│──> Save to /public/uploads/{year}/{month}/
│──> Optimize image (resize, compress) if applicable
│──> Extract metadata (dimensions, size, type)
     │
     ▼
MediaRepository.create(metadata)
│──> Prisma create: prisma.media.create({ data })
     │
     ▼
Database stores metadata
     │
     ▼
Return media data with public URL
     │
     ▼
Admin sees uploaded file in media library
```

### File Validation

```typescript
// src/server/services/MediaService.ts

const ALLOWED_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'],
  document: ['application/pdf'],
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export class MediaService {
  async validateFile(file: File) {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      throw new ValidationError('File size exceeds 10MB limit');
    }
    
    // Check file type
    const isImage = ALLOWED_TYPES.image.includes(file.type);
    const isDocument = ALLOWED_TYPES.document.includes(file.type);
    
    if (!isImage && !isDocument) {
      throw new ValidationError('File type not allowed');
    }
    
    // Additional checks for images
    if (isImage) {
      await this.validateImageDimensions(file);
    }
  }
  
  async validateImageDimensions(file: File) {
    const img = await this.getImageDimensions(file);
    
    const MAX_DIMENSIONS = 5000;
    if (img.width > MAX_DIMENSIONS || img.height > MAX_DIMENSIONS) {
      throw new ValidationError(`Image dimensions exceed ${MAX_DIMENSIONS}px limit`);
    }
  }
}
```

### File Storage Structure

```
public/
├── uploads/
│   ├── 2025/
│   │   ├── 01/
│   │   │   ├── 1704123456789-abc123.jpg
│   │   │   ├── 1704123457890-def456.png
│   │   │   └── ...
│   │   ├── 02/
│   │   └── ...
│   └── ...
```

### Image Optimization

```typescript
// Using sharp library for image optimization

import sharp from 'sharp';

export async function optimizeImage(inputPath: string, outputPath: string) {
  await sharp(inputPath)
    .resize(2000, 2000, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .png({ compressionLevel: 8 })
    .webp({ quality: 85 })
    .toFile(outputPath);
}
```

### Media Library UI

```typescript
// src/app/admin/media/page.tsx

export default async function MediaLibraryPage() {
  const mediaFiles = await getMediaFiles();
  
  return (
    <div className="admin-page">
      <PageHeader
        title="Media Library"
        action={<Button onClick={openUploadModal}>Upload Files</Button>}
      />
      
      <MediaGrid>
        {mediaFiles.map((media) => (
          <MediaCard key={media.id} media={media}>
            <MediaThumbnail src={media.publicUrl} alt={media.alt} />
            <MediaInfo>
              <p className="filename">{media.originalName}</p>
              <p className="metadata">{formatFileSize(media.size)} • {media.width}×{media.height}</p>
            </MediaInfo>
            <MediaActions>
              <IconButton onClick={() => copyUrl(media.publicUrl)} icon="link" title="Copy URL" />
              <IconButton onClick={() => deleteMedia(media.id)} icon="trash" variant="danger" />
            </MediaActions>
          </MediaCard>
        ))}
      </MediaGrid>
      
      <UploadModal isOpen={uploadModalOpen} onClose={closeUploadModal}>
        <Dropzone
          onDrop={handleFileDrop}
          accept={ALLOWED_TYPES}
          maxSize={MAX_FILE_SIZE}
        />
      </UploadModal>
    </div>
  );
}
```

---

## 13. Blog System

### Blog Features

- ✅ Markdown/MDX support
- ✅ Rich text editor (Tiptap)
- ✅ Categories (many-to-many)
- ✅ Tags (many-to-many)
- ✅ SEO fields (title, description, keywords)
- ✅ Cover image
- ✅ Draft/publish system
- ✅ Read time calculation
- ✅ View counter
- ❌ Comments (not in V1)
- ❌ Scheduled publishing (not in V1)
- ❌ Analytics integration (not in V1)

### Blog Data Model

```prisma
model Blog {
  id              String   @id @default(cuid())
  slug            String   @unique
  title           String
  excerpt         String   @db.Text
  content         String   @db.Text // Markdown/MDX or Tiptap HTML
  coverImage      String?
  published       Boolean  @default(false)
  publishedAt     DateTime?
  readTime        Int?     // minutes
  views           Int      @default(0)
  seoTitle        String?
  seoDescription  String?
  seoKeywords     String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  categories Category[]
  tags       Tag[]
  versions   ContentVersion[]

  @@map("blog")
}
```

### Blog API Endpoints

```typescript
GET    /api/v1/blog              # List all posts (public: only published)
GET    /api/v1/blog/{id}          # Get post by ID
GET    /api/v1/blog/slug/{slug}  # Get post by slug (public route)
POST   /api/v1/blog              # Create new post (admin)
PUT    /api/v1/blog/{id}          # Update post (admin)
DELETE /api/v1/blog/{id}          # Delete post (admin)
POST   /api/v1/blog/{id}/view    # Increment view count (public)

GET    /api/v1/categories        # List all categories
POST   /api/v1/categories        # Create category (admin)
PUT    /api/v1/categories/{id}    # Update category (admin)
DELETE /api/v1/categories/{id}    # Delete category (admin)

GET    /api/v1/tags              # List all tags
POST   /api/v1/tags              # Create tag (admin)
PUT    /api/v1/tags/{id}          # Update tag (admin)
DELETE /api/v1/tags/{id}          # Delete tag (admin)
```

### Read Time Calculation

```typescript
// src/server/server-utils/readTime.ts

export function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  
  // Strip HTML tags
  const text = content.replace(/<[^>]*>/g, '');
  
  // Count words
  const wordCount = text.trim().split(/\s+/).length;
  
  // Calculate minutes (round up)
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  
  return Math.max(1, minutes); // Minimum 1 minute
}
```

### Blog Post Edit Form

```typescript
// src/app/admin/blog/[id]/edit/page.tsx

export default async function EditBlogPostPage({ params }: { params: { id: string } }) {
  const post = await getBlogPost(params.id);
  const categories = await getCategories();
  const tags = await getTags();
  
  return (
    <div className="admin-page">
      <PageHeader title="Edit Blog Post" back="/admin/blog" />
      
      <BlogPostForm
        initialData={post}
        categories={categories}
        tags={tags}
        onSubmit={async (data) => {
          await updateBlogPost(params.id, data);
        }}
      />
    </div>
  );
}

function BlogPostForm({ initialData, categories, tags, onSubmit }) {
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormSection title="Basic Information">
        <TextInput label="Title" {...register('title')} required />
        <TextInput label="Slug" {...register('slug')} required />
        <Textarea label="Excerpt" {...register('excerpt')} rows={3} />
        <MediaPicker label="Cover Image" control={control} name="coverImage" />
      </FormSection>
      
      <FormSection title="Content">
        <TiptapEditor label="Post Content" control={control} name="content" />
        {/* OR */}
        <MarkdownEditor label="Post Content (Markdown)" control={control} name="content" />
      </FormSection>
      
      <FormSection title="Categories & Tags">
        <MultiSelect
          label="Categories"
          control={control}
          name="categories"
          options={categories}
        />
        <TagInput
          label="Tags"
          control={control}
          name="tags"
          suggestions={tags}
        />
      </FormSection>
      
      <FormSection title="SEO">
        <TextInput label="SEO Title" {...register('seoTitle')} />
        <Textarea label="SEO Description" {...register('seoDescription')} rows={2} />
        <TextInput label="Keywords" {...register('seoKeywords')} placeholder="comma, separated, keywords" />
      </FormSection>
      
      <FormSection title="Publishing">
        <Checkbox label="Published" {...register('published')} />
        {published && (
          <DatePicker label="Publish Date" control={control} name="publishedAt" />
        )}
      </FormSection>
      
      <FormActions>
        <Button type="submit">Save Changes</Button>
        <Button type="button" variant="secondary">Save as Draft</Button>
        <Button type="button" variant="ghost" href="/admin/blog">Cancel</Button>
      </FormActions>
    </form>
  );
}
```

---

## 14. Contact System

### Contact Form Features

- ✅ Name, Email, Subject, Message fields
- ✅ Store submissions in database
- ✅ Simple anti-spam (honeypot, rate limiting)
- ✅ Admin view submissions in `/admin/contact`
- ✅ Mark as read/unread
- ❌ Email notifications (not in V1)
- ❌ Auto-responder (not in V1)

### Contact Data Model

```prisma
model ContactSubmission {
  id        String   @id @default(cuid())
  name      String
  email     String
  subject   String?
  message   String   @db.Text
  ipAddress String?
  userAgent String?
  read      Boolean  @default(false)
  createdAt DateTime @default(now())

  @@map("contact_submissions")
}
```

### Contact Form (Public)

```typescript
// src/app/contact/page.tsx

export default function ContactPage() {
  return (
    <div className="contact-page">
      <h1>Get In Touch</h1>
      
      <ContactForm
        onSubmit={async (data) => {
          const response = await fetch('/api/v1/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
          
          if (response.ok) {
            showSuccessMessage('Message sent successfully!');
          }
        }}
      />
    </div>
  );
}

function ContactForm({ onSubmit }) {
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextInput label="Name" {...register('name')} required />
      <TextInput label="Email" {...register('email')} type="email" required />
      <TextInput label="Subject" {...register('subject')} />
      <Textarea label="Message" {...register('message')} rows={6} required />
      
      {/* Honeypot field (hidden) */}
      <input type="text" name="website" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
      
      <Button type="submit">Send Message</Button>
    </form>
  );
}
```

### Anti-Spam Implementation

```typescript
// src/server/services/ContactService.ts

export class ContactService {
  async submitContact(data: ContactFormData, request: Request) {
    // Honeypot check
    if (data.website) {
      throw new ValidationError('Invalid submission');
    }
    
    // Rate limiting check (3 submissions per IP per hour)
    const ipAddress = this.getClientIP(request);
    await this.checkRateLimit(ipAddress);
    
    // Extract metadata
    const userAgent = request.headers.get('user-agent') || '';
    
    // Save submission
    const submission = await this.contactRepository.create({
      ...data,
      ipAddress,
      userAgent,
    });
    
    return submission;
  }
  
  async checkRateLimit(ipAddress: string) {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    const recentSubmissions = await prisma.contactSubmission.count({
      where: {
        ipAddress,
        createdAt: { gte: oneHourAgo },
      },
    });
    
    if (recentSubmissions >= 3) {
      throw new TooManyRequestsError('Too many submissions. Please try again later.');
    }
  }
}
```

### Admin Contact Submissions Page

```typescript
// src/app/admin/contact/page.tsx

export default async function ContactSubmissionsPage() {
  const submissions = await getContactSubmissions();
  
  return (
    <div className="admin-page">
      <PageHeader title="Contact Submissions" />
      
      <DataTable
        columns={['Name', 'Email', 'Subject', 'Date', 'Status', 'Actions']}
        data={submissions}
        renderRow={(submission) => (
          <TableRow key={submission.id} className={submission.read ? '' : 'font-bold'}>
            <td>{submission.name}</td>
            <td>{submission.email}</td>
            <td>{submission.subject || '(No subject)'}</td>
            <td>{formatDate(submission.createdAt)}</td>
            <td>
              {submission.read ? (
                <Badge variant="secondary">Read</Badge>
              ) : (
                <Badge variant="primary">Unread</Badge>
              )}
            </td>
            <td>
              <ActionButtons>
                <IconButton onClick={() => viewSubmission(submission)} icon="eye" />
                <IconButton onClick={() => deleteSubmission(submission.id)} icon="trash" variant="danger" />
              </ActionButtons>
            </td>
          </TableRow>
        )}
      />
      
      <SubmissionModal
        isOpen={modalOpen}
        submission={selectedSubmission}
        onClose={closeModal}
        onMarkAsRead={markAsRead}
      />
    </div>
  );
}
```

---

## 15. Maintenance Mode

### Maintenance Mode Features

- ✅ Global toggle (enables/disables entire site except admin)
- ✅ Custom message ("Coming Soon", "Under Maintenance", custom text)
- ✅ Countdown timer support (optional)
- ✅ Admin panel always accessible
- ✅ Configurable from `/admin/settings/maintenance`

### Maintenance Mode Implementation

```typescript
// src/middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '@/server/db/prisma';
import { getSession } from '@/server/security/session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow admin routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/v1/auth')) {
    return NextResponse.next();
  }
  
  // Check maintenance mode
  const settings = await prisma.settings.findFirst();
  
  if (settings?.maintenanceMode) {
    // Check if user is authenticated admin
    const session = await getSession();
    
    if (!session.isAuthenticated) {
      // Redirect to maintenance page
      return NextResponse.rewrite(new URL('/maintenance', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
};
```

### Maintenance Page

```typescript
// src/app/maintenance/page.tsx

import { prisma } from '@/server/db/prisma';

export default async function MaintenancePage() {
  const settings = await prisma.settings.findFirst();
  
  const message = settings?.maintenanceMessage || 'We are currently performing scheduled maintenance. Please check back soon.';
  
  return (
    <div className="maintenance-page">
      <div className="maintenance-content">
        <Icon name="wrench" size={64} />
        <h1>Under Maintenance</h1>
        <p>{message}</p>
        
        {/* Optional countdown if configured */}
        {settings?.maintenanceEndTime && (
          <CountdownTimer endTime={settings.maintenanceEndTime} />
        )}
        
        <p className="text-sm text-gray-500">
          For urgent matters, please contact us at {settings?.profileEmail}
        </p>
      </div>
    </div>
  );
}
```

### Admin Settings (Maintenance)

```typescript
// src/app/admin/settings/maintenance/page.tsx

export default async function MaintenanceSettingsPage() {
  const settings = await getSettings();
  
  return (
    <div className="admin-page">
      <PageHeader title="Maintenance Mode" />
      
      <SettingsForm initialData={settings}>
        <FormSection title="Maintenance Mode">
          <Toggle
            label="Enable Maintenance Mode"
            name="maintenanceMode"
            description="When enabled, public site will show maintenance page. Admin panel remains accessible."
          />
          
          <Textarea
            label="Maintenance Message"
            name="maintenanceMessage"
            rows={4}
            placeholder="We are currently performing scheduled maintenance..."
          />
          
          <PresetMessages>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setMessage('We are currently performing scheduled maintenance. Please check back soon.')}
            >
              Default
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setMessage('Site launching soon! Stay tuned for something amazing.')}
            >
              Coming Soon
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setMessage('We are updating the site with new features. Be right back!')}
            >
              Upgrading
            </Button>
          </PresetMessages>
        </FormSection>
        
        <FormActions>
          <Button type="submit">Save Settings</Button>
        </FormActions>
      </SettingsForm>
      
      <Alert variant="warning">
        <p>⚠️ Maintenance mode affects all public pages. You will still have access to the admin panel.</p>
      </Alert>
    </div>
  );
}
```

---



## 16. API Architecture

### API Design Principles

- **RESTful:** Standard HTTP methods (GET, POST, PUT, DELETE)
- **Versioned:** `/api/v1/*` for future compatibility
- **Consistent:** Uniform response format across all endpoints
- **Validated:** Zod schemas on all inputs
- **Authenticated:** Session-based auth for protected routes
- **Error Handling:** Standardized error responses

### API Response Format

```typescript
// Success Response
{
  "success": true,
  "data": { /* resource data */ }
}

// Error Response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "User-friendly error message",
    "details": { /* field-specific errors */ }
  }
}
```

### Complete API Endpoint Specification

#### Authentication

```typescript
POST /api/v1/auth/login
Body: { username: string, password: string }
Response: { userId, username, displayName }

POST /api/v1/auth/logout
Response: { success: true }

GET /api/v1/auth/session
Response: { isAuthenticated: boolean, user?: User }
```

#### Portfolio

```typescript
GET /api/v1/portfolio
Query: ?published=true&category=Web Development
Response: { data: Portfolio[] }

GET /api/v1/portfolio/:id
Response: { data: Portfolio }

GET /api/v1/portfolio/slug/:slug
Response: { data: Portfolio }

POST /api/v1/portfolio (Admin)
Body: { title, slug, shortDescription, ... }
Response: { data: Portfolio }

PUT /api/v1/portfolio/:id (Admin)
Body: { ...updatedFields }
Response: { data: Portfolio }

DELETE /api/v1/portfolio/:id (Admin)
Response: { success: true }

PUT /api/v1/portfolio/reorder (Admin)
Body: [{ id, displayOrder }]
Response: { success: true }
```

#### Blog

```typescript
GET /api/v1/blog
Query: ?published=true&category=tutorials&tag=nextjs
Response: { data: Blog[] }

GET /api/v1/blog/:id
Response: { data: Blog }

GET /api/v1/blog/slug/:slug
Response: { data: Blog }

POST /api/v1/blog (Admin)
Body: { title, slug, excerpt, content, ... }
Response: { data: Blog }

PUT /api/v1/blog/:id (Admin)
Body: { ...updatedFields }
Response: { data: Blog }

DELETE /api/v1/blog/:id (Admin)
Response: { success: true }

POST /api/v1/blog/:id/view (Public)
Response: { views: number }
```

#### Categories & Tags

```typescript
GET /api/v1/categories
Response: { data: Category[] }

POST /api/v1/categories (Admin)
Body: { name, slug, description }
Response: { data: Category }

PUT /api/v1/categories/:id (Admin)
DELETE /api/v1/categories/:id (Admin)

GET /api/v1/tags
POST /api/v1/tags (Admin)
PUT /api/v1/tags/:id (Admin)
DELETE /api/v1/tags/:id (Admin)
```

#### Other Content Types

```typescript
// Same CRUD pattern for:
/api/v1/experience
/api/v1/education
/api/v1/skills
/api/v1/services
/api/v1/certificates
/api/v1/recommendations

// Each supports:
GET /api/v1/{type}           # List
GET /api/v1/{type}/:id       # Get by ID
POST /api/v1/{type}          # Create (Admin)
PUT /api/v1/{type}/:id       # Update (Admin)
DELETE /api/v1/{type}/:id    # Delete (Admin)
PUT /api/v1/{type}/reorder   # Reorder (Admin)
```

#### Media

```typescript
POST /api/v1/media/upload (Admin)
Body: FormData with file(s)
Response: { data: Media[] }

GET /api/v1/media
Query: ?type=image
Response: { data: Media[] }

DELETE /api/v1/media/:id (Admin)
Response: { success: true }
```

#### Contact

```typescript
POST /api/v1/contact (Public)
Body: { name, email, subject, message }
Response: { success: true }

GET /api/v1/contact (Admin)
Response: { data: ContactSubmission[] }

PUT /api/v1/contact/:id/read (Admin)
Body: { read: boolean }
Response: { data: ContactSubmission }

DELETE /api/v1/contact/:id (Admin)
Response: { success: true }
```

#### Settings

```typescript
GET /api/v1/settings (Admin)
Response: { data: Settings }

PUT /api/v1/settings (Admin)
Body: { ...updatedFields }
Response: { data: Settings }

PUT /api/v1/settings/theme (Admin)
Body: { theme: string }
Response: { success: true }
```

#### Setup

```typescript
POST /api/v1/setup/database
Body: { provider: "sqlite" | "postgresql", connectionString?: string }
Response: { success: true }

POST /api/v1/setup/admin
Body: { username, displayName, password }
Response: { success: true }

POST /api/v1/setup/settings
Body: { theme, profileName, profileTitle, ... }
Response: { data: Settings }
```

---

## 17. File Structure

```
portfolio-creator-v1/
├── .env                              # Environment variables
├── .env.example                      # Example env file
├── .gitignore                        # Git ignore rules
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript config
├── next.config.ts                    # Next.js config
├── postcss.config.mjs                # PostCSS config
├── tailwind.config.ts                # Tailwind CSS config
├── eslint.config.mjs                 # ESLint config
├── README.md                         # Project documentation
│
├── prisma/                           # Database
│   ├── schema.prisma                 # Prisma schema (15 models)
│   ├── migrations/                   # Database migrations
│   └── seed.ts                       # Optional seed data
│
├── public/                           # Static assets
│   ├── uploads/                      # User-uploaded media
│   │   ├── images/
│   │   └── documents/
│   ├── themes/                       # Theme assets
│   └── favicon.ico
│
├── docs/                             # Documentation
│   ├── architecture.md               # This file (single source of truth)
│   └── api.md                        # API documentation
│
├── src/
│   ├── app/                          # Next.js 14 app router pages
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Home page
│   │   ├── globals.css               # Global styles
│   │   │
│   │   ├── (public)/                 # Public routes group
│   │   │   ├── portfolio/
│   │   │   │   ├── page.tsx          # Portfolio list
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx      # Portfolio detail
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx          # Blog list
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx      # Blog detail
│   │   │   ├── about/
│   │   │   │   └── page.tsx          # About page
│   │   │   └── contact/
│   │   │       └── page.tsx          # Contact page
│   │   │
│   │   ├── admin/                    # Admin routes (protected)
│   │   │   ├── layout.tsx            # Admin layout
│   │   │   ├── page.tsx              # Dashboard
│   │   │   │
│   │   │   ├── portfolio/
│   │   │   │   ├── page.tsx          # Portfolio list
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx      # Create portfolio
│   │   │   │   └── [id]/
│   │   │   │       ├── edit/
│   │   │   │       │   └── page.tsx  # Edit portfolio
│   │   │   │       └── versions/
│   │   │   │           └── page.tsx  # Version history
│   │   │   │
│   │   │   ├── blog/                 # Blog CRUD pages
│   │   │   ├── experience/           # Experience CRUD pages
│   │   │   ├── education/            # Education CRUD pages
│   │   │   ├── skills/               # Skills CRUD pages
│   │   │   ├── services/             # Services CRUD pages
│   │   │   ├── certificates/         # Certificates CRUD pages
│   │   │   ├── recommendations/      # Recommendations CRUD pages
│   │   │   ├── media/                # Media library
│   │   │   └── settings/
│   │   │       ├── general/
│   │   │       │   └── page.tsx      # General settings
│   │   │       ├── theme/
│   │   │       │   └── page.tsx      # Theme settings
│   │   │       ├── seo/
│   │   │       │   └── page.tsx      # SEO settings
│   │   │       └── profile/
│   │   │           └── page.tsx      # Profile settings
│   │   │
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── page.tsx          # Login page
│   │   │   └── setup/
│   │   │       └── page.tsx          # Setup wizard
│   │   │
│   │   └── api/                      # API routes
│   │       └── v1/
│   │           ├── auth/
│   │           │   ├── login/
│   │           │   │   └── route.ts
│   │           │   ├── logout/
│   │           │   │   └── route.ts
│   │           │   └── session/
│   │           │       └── route.ts
│   │           ├── setup/
│   │           │   ├── database/
│   │           │   │   └── route.ts
│   │           │   ├── admin/
│   │           │   │   └── route.ts
│   │           │   └── settings/
│   │           │       └── route.ts
│   │           ├── portfolio/
│   │           │   ├── route.ts      # GET /api/v1/portfolio (list)
│   │           │   │                 # POST /api/v1/portfolio (create)
│   │           │   ├── [id]/
│   │           │   │   └── route.ts  # GET, PUT, DELETE
│   │           │   ├── reorder/
│   │           │   │   └── route.ts  # PUT (reorder)
│   │           │   └── publish/
│   │           │       └── route.ts  # PUT (publish/unpublish)
│   │           ├── blog/             # Similar structure to portfolio
│   │           ├── experience/       # Similar CRUD structure
│   │           ├── education/        # Similar CRUD structure
│   │           ├── skills/           # Similar CRUD structure
│   │           ├── services/         # Similar CRUD structure
│   │           ├── certificates/     # Similar CRUD structure
│   │           ├── recommendations/  # Similar CRUD structure
│   │           ├── media/
│   │           │   ├── route.ts      # POST (upload)
│   │           │   └── [id]/
│   │           │       └── route.ts  # DELETE
│   │           ├── contact/
│   │           │   └── route.ts      # POST (submit form)
│   │           └── settings/
│   │               └── route.ts      # GET, PUT
│   │
│   ├── server/                       # Server-side code
│   │   ├── controllers/              # Request handlers
│   │   │   ├── PortfolioController.ts
│   │   │   ├── BlogController.ts
│   │   │   ├── ExperienceController.ts
│   │   │   ├── EducationController.ts
│   │   │   ├── SkillController.ts
│   │   │   ├── ServiceController.ts
│   │   │   ├── CertificateController.ts
│   │   │   ├── RecommendationController.ts
│   │   │   ├── MediaController.ts
│   │   │   ├── ContactController.ts
│   │   │   ├── SettingsController.ts
│   │   │   ├── AuthController.ts
│   │   │   └── SetupController.ts
│   │   │
│   │   ├── services/                 # Business logic
│   │   │   ├── PortfolioService.ts
│   │   │   ├── BlogService.ts
│   │   │   ├── MediaService.ts
│   │   │   ├── ContactService.ts
│   │   │   ├── SettingsService.ts
│   │   │   ├── AuthService.ts
│   │   │   └── SetupService.ts
│   │   │
│   │   ├── repositories/             # Data access layer
│   │   │   ├── PortfolioRepository.ts
│   │   │   ├── BlogRepository.ts
│   │   │   ├── ExperienceRepository.ts
│   │   │   ├── EducationRepository.ts
│   │   │   ├── SkillRepository.ts
│   │   │   ├── ServiceRepository.ts
│   │   │   ├── CertificateRepository.ts
│   │   │   ├── RecommendationRepository.ts
│   │   │   ├── MediaRepository.ts
│   │   │   ├── ContactRepository.ts
│   │   │   ├── SettingsRepository.ts
│   │   │   ├── UserRepository.ts
│   │   │   └── ContentVersionRepository.ts
│   │   │
│   │   ├── serializers/              # Response formatting
│   │   │   ├── PortfolioSerializer.ts
│   │   │   ├── BlogSerializer.ts
│   │   │   ├── ExperienceSerializer.ts
│   │   │   ├── EducationSerializer.ts
│   │   │   ├── SkillSerializer.ts
│   │   │   ├── ServiceSerializer.ts
│   │   │   ├── CertificateSerializer.ts
│   │   │   ├── RecommendationSerializer.ts
│   │   │   ├── MediaSerializer.ts
│   │   │   └── UserSerializer.ts
│   │   │
│   │   ├── server-validators/        # Server-side validation schemas
│   │   │   ├── portfolio.ts
│   │   │   ├── blog.ts
│   │   │   ├── experience.ts
│   │   │   ├── education.ts
│   │   │   ├── skill.ts
│   │   │   ├── service.ts
│   │   │   ├── certificate.ts
│   │   │   ├── recommendation.ts
│   │   │   ├── media.ts
│   │   │   ├── contact.ts
│   │   │   ├── settings.ts
│   │   │   └── auth.ts
│   │   │
│   │   ├── server-utils/             # Server utilities
│   │   │   ├── slug.ts               # Slug generation
│   │   │   ├── readTime.ts           # Reading time calculation
│   │   │   ├── imageOptimization.ts  # Image processing
│   │   │   └── fileUpload.ts         # File upload handling
│   │   │
│   │   ├── http/                     # HTTP utilities
│   │   │   ├── errors.ts             # Custom error classes
│   │   │   └── responses.ts          # Response helpers
│   │   │
│   │   ├── security/                 # Security utilities
│   │   │   ├── session.ts            # iron-session config
│   │   │   ├── auth.ts               # Auth middleware
│   │   │   └── rateLimit.ts          # Rate limiting
│   │   │
│   │   └── db/                       # Database utilities
│   │       └── client.ts             # Prisma client singleton
│   │
│   ├── components/                   # React components
│   │   ├── admin/                    # Admin-only components
│   │   │   ├── Sidebar.tsx
│   │   │   ├── TopBar.tsx
│   │   │   ├── StatsCard.tsx
│   │   │   ├── ContentTable.tsx
│   │   │   ├── ContentForm.tsx
│   │   │   └── TiptapEditor.tsx
│   │   │
│   │   ├── public/                   # Public-facing components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── PortfolioCard.tsx
│   │   │   ├── BlogCard.tsx
│   │   │   ├── ExperienceTimeline.tsx
│   │   │   ├── SkillsGrid.tsx
│   │   │   └── ContactForm.tsx
│   │   │
│   │   └── shared/                   # Shared components
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Select.tsx
│   │       ├── Modal.tsx
│   │       ├── Toast.tsx
│   │       └── Spinner.tsx
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useToast.ts
│   │   └── useForm.ts
│   │
│   ├── lib/                          # Client-side utilities
│   │   ├── api.ts                    # API client
│   │   ├── date.ts                   # Date formatting
│   │   └── validators.ts             # Client-side validation
│   │
│   ├── types/                        # TypeScript types
│   │   ├── portfolio.ts
│   │   ├── blog.ts
│   │   ├── experience.ts
│   │   ├── education.ts
│   │   ├── skill.ts
│   │   ├── service.ts
│   │   ├── certificate.ts
│   │   ├── recommendation.ts
│   │   ├── media.ts
│   │   ├── contact.ts
│   │   ├── settings.ts
│   │   └── user.ts
│   │
│   └── static-content/               # ⚠️ REFERENCE ONLY - TEMPORARY
│       ├── README.md                 # Explains reference-only status
│       ├── portfolio/                # 38 portfolio projects (JSON)
│       ├── experience.ts             # Work experience data
│       ├── education.ts              # Education data
│       ├── skills.ts                 # Skills data
│       ├── services.ts               # Services data
│       ├── certificates.ts           # Certificates data
│       └── recommendations.ts        # Recommendations data
│       #
│       # ⚠️ IMPORTANT: This directory will be DELETED after V1 completion
│       # Purpose: Reference only for understanding original static structure
│       # NOT auto-imported: Users manually add content via admin panel
│       # Developer can optionally create personal migration script
│
└── tests/                            # Tests (future)
    ├── unit/
    ├── integration/
    └── e2e/
```

### Key Directory Responsibilities

#### `/src/server/`
**Backend server-side code organized in layers:**

- **`controllers/`**: Handle HTTP requests, call services, return responses
  - Example: `PortfolioController.ts` handles `/api/v1/portfolio/*` routes
  - Responsibilities: Request parsing, calling services, response formatting

- **`services/`**: Business logic layer
  - Example: `PortfolioService.ts` handles slug generation, draft/publish logic
  - Responsibilities: Business rules, validation, coordination between repositories

- **`repositories/`**: Data access layer
  - Example: `PortfolioRepository.ts` wraps Prisma queries
  - Responsibilities: Database queries, data mapping

- **`serializers/`**: Transform database models to API responses
  - Example: `PortfolioSerializer.ts` formats Portfolio model for JSON response
  - Responsibilities: Data transformation, hiding sensitive fields

- **`server-validators/`**: Zod schemas for server-side validation
  - Example: `portfolio.ts` defines validation for portfolio create/update
  - Responsibilities: Input validation, type safety

- **`http/`**: HTTP utilities (NOT controllers)
  - `errors.ts`: Custom error classes (NotFoundError, ValidationError, etc.)
  - `responses.ts`: Response helpers (successResponse, errorResponse)

- **`security/`**: Security utilities
  - `session.ts`: iron-session configuration
  - `auth.ts`: Authentication middleware (requireAuth)
  - `rateLimit.ts`: Rate limiting middleware

#### `/src/app/`
**Next.js 14 App Router pages and API routes:**

- **`(public)/`**: Public-facing pages (portfolio, blog, about, contact)
- **`admin/`**: Protected admin panel pages
- **`api/v1/`**: API routes that call controllers

#### `/src/components/`
**React components organized by scope:**

- **`admin/`**: Admin panel UI components
- **`public/`**: Public-facing website components
- **`shared/`**: Reusable components used in both admin and public

#### `/src/static-content/`
**⚠️ TEMPORARY - Reference Only:**

- Contains original static portfolio data (38 projects, experience, education, etc.)
- **NOT auto-imported**: Setup wizard creates empty portfolio
- Users manually add their own content through admin panel
- Developer can optionally create a personal migration script (not part of core)
- **Will be deleted** after V1 is complete

---

## 18. Data Flow

### Public Page Load (Server-Side Rendering)

```
1. User requests /portfolio
2. Next.js App Router SSR
3. page.tsx calls server function
4. PortfolioRepository.findAllPublished()
5. Prisma query to database
6. serializePortfolio() transforms data
7. page.tsx renders with data
8. HTML sent to client
```

### Admin Create Content

```
1. Admin fills form in /admin/portfolio/new
2. Client-side Zod validation
3. POST /api/v1/portfolio
4. requireAuth() checks session
5. Server-side Zod validation
6. PortfolioService.create(data)
   - Generate unique slug
   - Business logic validation
7. PortfolioRepository.create(data)
8. Prisma create operation
9. serializePortfolio() formats response
10. successResponse() returns JSON
11. Client redirects to /admin/portfolio
```

### Admin Update with Draft

```
1. Admin edits content in /admin/portfolio/:id/edit
2. Clicks "Save as Draft"
3. PUT /api/v1/portfolio/:id with published: false
4. requireAuth() checks session
5. Server-side Zod validation
6. PortfolioService.update(id, data)
   - Save current version to ContentVersion table
   - Update content with published: false
7. PortfolioRepository.update(id, data)
8. Prisma update operation
9. Response with updated data
10. Client shows success message
```

---

## 19. Deployment Strategy

### Deployment Options

#### Option 1: Vercel (Recommended)

**Pros:**
- Zero-config deployment for Next.js
- Automatic HTTPS
- Edge network (fast globally)
- Free tier available
- Environment variables management
- Automatic deployments on git push

**Setup:**
```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin <repo-url>
git push -u origin main

# 2. Connect to Vercel
# - Visit vercel.com
# - Import GitHub repository
# - Configure environment variables
# - Deploy

# 3. Environment Variables (Vercel Dashboard)
DATABASE_URL=<neon-postgresql-url>
SESSION_SECRET=<32-char-random-string>
NODE_ENV=production
```

#### Option 2: Netlify

Similar setup process, supports Next.js

#### Option 3: Self-Hosted (VPS/Server)

**Setup:**
```bash
# On server (Ubuntu example)
# 1. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Install PM2 (process manager)
sudo npm install -g pm2

# 3. Clone & build
git clone <repo-url>
cd portfolio-creator
npm install
npm run build

# 4. Configure environment
cp .env.example .env
nano .env

# 5. Run database migrations
npx prisma migrate deploy

# 6. Start with PM2
pm2 start npm --name "portfolio" -- start
pm2 save
pm2 startup
```

---

## 20. Development Phases

### Phase 1: Database & Setup Wizard (Week 1-2)
- [ ] Prisma schema design
- [ ] Database migrations
- [ ] Setup wizard UI (5 steps)
- [ ] Setup API endpoints
- [ ] Database detection for existing Neon instances
- [ ] Optional: Personal migration script (developer can create for their own data)

### Phase 2: Authentication System (Week 2-3)
- [ ] Session management (iron-session)
- [ ] Password hashing (bcrypt)
- [ ] Login page UI
- [ ] Auth middleware
- [ ] Protected route HOC

### Phase 3: Admin Panel Foundation (Week 3-4)
- [ ] Admin layout with navigation
- [ ] Dashboard page with stats
- [ ] Settings pages
- [ ] Common admin components

### Phase 4: Portfolio CMS (Week 4-5)
- [ ] Portfolio API endpoints (CRUD + reorder)
- [ ] Portfolio list/create/edit pages
- [ ] Tiptap editor integration
- [ ] Draft/publish functionality

### Phase 5: Media Management (Week 5-6)
- [ ] Media upload API endpoint
- [ ] File validation
- [ ] Image optimization
- [ ] Media library UI

### Phase 6: Content Management (Week 6-7)
- [ ] Experience, Education, Skills CRUD
- [ ] Services, Certificates, Recommendations CRUD
- [ ] Reorder functionality for all

### Phase 7: Blog System (Week 7-8)
- [ ] Blog API endpoints
- [ ] Category & Tag management
- [ ] Blog create/edit forms
- [ ] Public blog pages

### Phase 8: Contact System (Week 8)
- [ ] Contact form UI
- [ ] Contact API endpoint
- [ ] Anti-spam measures
- [ ] Contact submissions admin page

### Phase 9: Theme System (Week 9-10)
- [ ] Theme structure setup
- [ ] Theme registry
- [ ] Dynamic theme loading
- [ ] Theme switcher

### Phase 10-14: Testing, Documentation, Polish & Launch

---

## 21. Testing Strategy

### Unit Testing (Vitest)

```typescript
// tests/unit/services/PortfolioService.test.ts
import { describe, it, expect } from 'vitest';
import { PortfolioService } from '@/server/services/PortfolioService';

describe('PortfolioService', () => {
  it('should generate unique slug', async () => {
    const service = new PortfolioService();
    const slug = await service.generateUniqueSlug('My Awesome Project');
    expect(slug).toBe('my-awesome-project');
  });
});
```

### Integration Testing (Vitest)

Test API endpoints with mocked database

### E2E Testing (Playwright)

Test critical user flows end-to-end

---

## 22. Security Considerations

- ✅ Session-based authentication
- ✅ Password hashing (bcrypt)
- ✅ Input validation (Zod)
- ✅ CSRF protection
- ✅ XSS prevention
- ✅ SQL injection prevention (Prisma)
- ✅ Rate limiting
- ✅ File upload security
- ✅ HTTPS enforcement
- ✅ Security headers

---

## 23. Performance Optimization

- ✅ Static generation where possible
- ✅ ISR for public pages
- ✅ Image optimization (next/image)
- ✅ Database query optimization
- ✅ Caching strategy
- ✅ Bundle size optimization
- ✅ Performance monitoring

---

## 24. Decision Log (ADRs)

### ADR-001: Database Selection (SQLite + Neon PostgreSQL)
**Decision:** Support both SQLite and Neon PostgreSQL
**Rationale:** Flexibility for different deployment scenarios

### ADR-002: Session-Based Authentication (No OAuth for V1)
**Decision:** Use session-based auth, no OAuth
**Rationale:** Simplicity for single-tenant portfolio

### ADR-003: Theme System (Complete Layout Changes)
**Decision:** Themes are complete layouts, not just CSS
**Rationale:** True design flexibility

### ADR-004: Rich Text Editor (Tiptap)
**Decision:** Use Tiptap for WYSIWYG editing
**Rationale:** Modern, extensible, TypeScript support

### ADR-005: No Email Notifications (V1)
**Decision:** Store contact submissions in DB only
**Rationale:** Simplicity, can be added in V2

---

## 25. V2 Roadmap

### Multi-Tenancy (SaaS Model)
- User registration (organizations)
- Subdomain per portfolio
- Subscription tiers
- Usage limits

### Advanced Features
- OAuth authentication
- Two-Factor Authentication
- Comments system
- Scheduled publishing
- Newsletter integration
- Built-in analytics
- Email notifications
- SEO enhancements
- Third-party integrations

---

## 26. Glossary

**Admin Panel:** Authenticated area for content management (/admin)
**API Endpoint:** Server-side route handling HTTP requests (/api/v1/*)
**bcrypt:** Password hashing algorithm
**CRUD:** Create, Read, Update, Delete operations
**CMS:** Content Management System
**Draft:** Unpublished content (published: false)
**iron-session:** Library for encrypted session management
**Neon PostgreSQL:** Serverless PostgreSQL database service
**Prisma:** TypeScript ORM for databases
**Repository:** Data access layer in server architecture
**Serializer:** Transforms database entities to API format
**Service:** Business logic layer
**Session:** Server-side storage of authentication state
**Setup Wizard:** Multi-step configuration process
**Slug:** URL-friendly version of a title
**SQLite:** File-based relational database
**Theme:** Complete layout and design system
**Tiptap:** Rich text WYSIWYG editor
**Zod:** TypeScript-first schema validation library

---

**END OF DOCUMENT**

---

*This architecture document serves as the single source of truth for Portfolio Creator V1. All implementation decisions should reference this document.*

*For questions or clarifications, refer to:*
- *Engineering standard: `docs/ammar_next_js_engineering_standard_v_1.02.00.md`*
- *Documentation format: `docs/ammar_documentations_md_guideline_v1.00.01.md`*
