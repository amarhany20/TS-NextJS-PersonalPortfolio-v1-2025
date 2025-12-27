# Quick Start Guide

Get your portfolio running in minutes with our web-based setup wizard - no terminal commands required!

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

## 3️⃣ Start the Application

```bash
npm run dev
```

Open **http://localhost:3000** in your browser.

## 4️⃣ Complete Web-Based Setup

The application will automatically detect it's not configured and show a **Setup Wizard**.

### Step 1: Welcome
- Introduction to the portfolio platform
- Quick overview of features

### Step 2: Database Configuration
- Choose between **SQLite** (recommended for development) or **PostgreSQL**
- For PostgreSQL: Enter your connection string
- The wizard will automatically create the database schema

### Step 3: Admin Account
- Create your admin username and password
- Set your display name
- Configure basic site information

### Step 4: Site Configuration
- Choose your preferred theme
- Set site title and description
- Configure basic SEO settings

### Step 5: Content Setup
- Choose to start with sample content or begin empty
- The wizard will populate your database with initial data

## 5️⃣ Access Your Portfolio

Once setup is complete:
- **Public Site**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin
- **Login**: Use the credentials you created during setup

## ✅ Setup Complete!

Your portfolio is now ready with:
- ✅ Database configured and seeded
- ✅ Admin account created
- ✅ Sample content loaded
- ✅ Theme applied
- ✅ SEO settings configured
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

## 🆘 Troubleshooting

### Setup Wizard Doesn't Appear

If you don't see the setup wizard:
1. Check that your `.env` file exists and has the required variables
2. Ensure the database file isn't corrupted - delete `dev.db` and restart
3. Check browser console for any JavaScript errors

### Admin Login Issues

- **Wrong credentials**: Use the username and password you created during setup
- **Session expired**: Log out and log back in
- **Database issues**: Check that the database is properly seeded

### Theme Not Applying

- **Public site**: Refresh the page after changing theme in admin
- **Browser cache**: Hard refresh (Ctrl+F5) to clear cached styles
- **Admin preview**: Theme changes apply immediately in admin interface

### Performance Issues

- **Slow loading**: Check database queries in browser dev tools
- **Memory usage**: Restart the dev server if it becomes unresponsive
- **Build errors**: Run `npm run build` to check for compilation issues

## 📚 Next Steps

- **Admin Dashboard**: Access `/admin` to manage all content
- **Change theme**: Visit `/admin/settings/theme` to switch between themes
- **Deploy**: Push to GitHub and deploy via Vercel (zero-config)
- **Customize**: Edit content through the admin interface

## 🚀 Advanced Usage

For developers who want to extend the platform:

```bash
# Development commands
npm run dev          # Start development server
npm run build        # Build for production
npm run typecheck    # Type checking
npm run lint         # Code linting
npm run test         # Run tests

# Database management
npm run prisma:studio    # Open Prisma Studio
npm run db:seed         # Reseed database
npm run prisma:migrate  # Run migrations
```

See [README.md](README.md) for complete documentation.

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
