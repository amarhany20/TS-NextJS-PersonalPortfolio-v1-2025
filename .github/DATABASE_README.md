# Database Setup Guide

## SQLite with Prisma - Complete Setup

This portfolio application uses SQLite with Prisma ORM for data management. All your portfolio data is now stored in a database instead of static TypeScript files.

## Quick Start

### Development Setup

1. **Install dependencies** (already done if you've run `npm install`)
2. **Generate Prisma client**:
   ```bash
   npx prisma generate
   ```

3. **Run migrations**:
   ```bash
   npx prisma migrate dev
   ```

4. **Seed the database**:
   ```bash
   npm run db:seed
   ```

### Production Setup

1. **Set DATABASE_URL** in your environment variables
2. **Run the setup script**:
   ```bash
   chmod +x scripts/setup-database.sh
   ./scripts/setup-database.sh
   ```

## Database Schema

The database contains the following tables:

- **PersonalInfo** - Your personal information and contact details
- **HeroContent** - Homepage hero section content
- **ContactInfo** - Contact page information
- **Experience** - Work experience entries
- **Education** - Educational background
- **SkillCategory** & **Skill** - Technical skills organized by categories
- **CoreSkill** - Featured skills for quick display
- **Certificate** - Professional certifications
- **Recommendation** - Client/colleague recommendations
- **Service** - Services you offer
- **Language** - Language proficiencies
- **BlogPost** - Blog articles
- **Project** - Portfolio projects (for future use)

## Available Scripts

- `npm run db:seed` - Populate database with your data
- `npm run db:studio` - Open Prisma Studio (database GUI)
- `npm run db:reset` - Reset database (development only)

## Managing Your Data

### 1. Using Prisma Studio (Recommended)
```bash
npm run db:studio
```
This opens a web interface at `http://localhost:5555` where you can:
- View all your data in a user-friendly interface
- Edit records directly
- Add new entries
- Delete outdated information

### 2. Using the Database Services
Your components now use database services instead of static files:

```typescript
import { getPersonalInfo, getExperience, getSkills } from '@/lib/database-services';

// In your component
const personalInfo = await getPersonalInfo();
const experience = await getExperience();
const skills = await getSkills();
```

### 3. Direct Database Access
You can also access the database directly:

```typescript
import { prisma } from '@/lib/database';

// Example: Add a new skill
await prisma.skill.create({
  data: {
    name: "New Technology",
    level: 80,
    experience: "2+ years",
    categoryId: 1
  }
});
```

## Database File Location

- **Development**: `./prisma/dev.db`
- **Production**: Set via `DATABASE_URL` environment variable

## Deployment

### For VPS/Server Deployment

1. **Upload your project** to your server
2. **Set environment variables**:
   ```bash
   export DATABASE_URL="file:./data/production.db"
   ```
3. **Run setup script**:
   ```bash
   ./scripts/setup-database.sh
   ```

### For Serverless (Vercel, etc.)

For serverless platforms, consider using:
- **Vercel Postgres** (PostgreSQL)
- **Railway** (PostgreSQL/MySQL)
- **Supabase** (PostgreSQL)
- **PlanetScale** (MySQL)

Update your `DATABASE_URL` accordingly and change the provider in `prisma/schema.prisma`.

## Data Migration from TypeScript Files

Your existing TypeScript data files in `src/data/sections/` have been automatically migrated to the database. The seed script (`prisma/seed.ts`) contains all your original data.

## Backup and Recovery

### Backup SQLite Database
```bash
# Simple file copy
cp prisma/dev.db backup/portfolio-backup-$(date +%Y%m%d).db

# Or use SQLite dump
sqlite3 prisma/dev.db .dump > backup/portfolio-backup-$(date +%Y%m%d).sql
```

### Restore from Backup
```bash
# From file copy
cp backup/portfolio-backup-20240716.db prisma/dev.db

# From SQL dump
sqlite3 prisma/dev.db < backup/portfolio-backup-20240716.sql
```

## Troubleshooting

### Common Issues

1. **"Database file not found"**
   - Run `npx prisma migrate dev` to create the database
   - Check that `DATABASE_URL` is set correctly

2. **"Prisma Client not generated"**
   - Run `npx prisma generate`
   - Restart your development server

3. **"Migration failed"**
   - Check database permissions
   - Ensure the database directory exists
   - Run `npx prisma migrate reset` (development only)

### Getting Help

- Check Prisma documentation: https://www.prisma.io/docs
- View your database schema: `npx prisma studio`
- Reset everything: `npm run db:reset` (development only)

## Next Steps

1. **Customize your data** using Prisma Studio
2. **Add new fields** by updating the schema and running migrations
3. **Build admin features** using the database services
4. **Set up automated backups** for production
5. **Consider upgrading to PostgreSQL** for production scalability

---

🎉 **Congratulations!** Your portfolio now uses a modern database system with full type safety and excellent developer experience.
