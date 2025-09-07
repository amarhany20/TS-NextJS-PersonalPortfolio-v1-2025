# Prisma Commands for this Project

This file documents the common Prisma CLI commands used in this repository and how they're wired to `package.json` scripts.

- prisma:generate
  - Description: Generates the Prisma client after you change `schema.prisma`.
  - When to run: After editing `prisma/schema.prisma` or when dependencies change.
  - Usage: `npm run prisma:generate`

- prisma:migrate:dev
  - Description: Creates a new migration from schema changes and applies it to the development database.
  - When to run: When you modify the Prisma schema and want a migration file.
  - Usage: `npm run prisma:migrate:dev`

- prisma:migrate:deploy
  - Description: Applies pending migrations in production or CI environments.
  - When to run: In CI/CD or on production to bring the DB up-to-date.
  - Usage: `npm run prisma:migrate:deploy`

- prisma:studio
  - Description: Opens Prisma Studio, a web UI to inspect and edit data.
  - Usage: `npm run prisma:studio`

- prisma:db:push
  - Description: Pushes the current Prisma schema to the database without producing migration files (non-destructive in many cases).
  - When to run: Prototyping or when you don't need migrations.
  - Usage: `npm run prisma:db:push`

- prisma:db:pull
  - Description: Introspects the current database schema and updates `schema.prisma`.
  - When to run: When the DB was modified outside Prisma or you connected to an existing DB.
  - Usage: `npm run prisma:db:pull`

- prisma:format
  - Description: Formats the Prisma schema file(s).
  - Usage: `npm run prisma:format`

- prisma:lint
  - Description: Checks Prisma formatting (runs `prisma format --check`).
  - Usage: `npm run prisma:lint`

- prisma:seed
  - Description: Runs the repository's seeding script. This project uses `tsx prisma/seed.ts` to seed the database.
  - Usage: `npm run prisma:seed`

- prisma:reset
  - Description: Resets the database, drops data and reapplies migrations (destructive).
  - Usage: `npm run prisma:reset`

- prisma:version
  - Description: Prints the installed Prisma version.
  - Usage: `npm run prisma:version`

Notes
- `package.json` cannot include inline comments. To provide explanations next to scripts we added a top-level `prismaScripts` object with human-readable descriptions.
- Use `npx prisma` if the global `prisma` binary isn't available.
- Be careful running destructive commands like `prisma migrate reset` or `prisma db push` on production.
