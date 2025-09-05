# Commands

Quick reference for running, developing, and maintaining this portfolio.

## NPM scripts

- dev — Start Next.js dev server with Turbopack
- build — Production build
- start — Start production server
- lint — Run Next.js ESLint
- db:seed — Seed the database with sample content and admin user
- db:studio — Open Prisma Studio
- db:reset — Reset the database and re-apply migrations (destructive)
- create-user — Create a new user from a script
- test:login — Run the local login test script (checks bcrypt and users)
- test:api — Test the login API against a running server

## Usage

PowerShell examples (default shell):

```pwsh
# Start dev server
npm run dev

# Build & start production
npm run build
npm start

# Lint
npm run lint

# Database
npm run db:reset   # resets and reapplies migrations
npm run db:seed    # seeds default data and admin user
npm run db:studio  # opens Prisma Studio

# Utilities
npm run create-user
npm run test:login
npm run test:api
```

## Admin credentials (from seed)

- Email: ammarhanyezeldin@gmail.com
- Password: Ammar_12341234

Change this after first login.

## Notes

- Prisma uses SQLite in development (DATABASE_URL in .env).
- The navigation and quick links are metadata-driven and can be edited via DB.
