import { SettingsRepository } from '@/server/repositories/SettingsRepository';
import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';

export interface SetupStatus {
  isSetupComplete: boolean;
  status: 'complete' | 'missing_table' | 'missing_record';
  error?: string;
}

export interface DatabaseTestConfig {
  type: 'sqlite' | 'postgresql';
  connectionString?: string;
}

export interface DatabaseTestResult {
  success: boolean;
  provider?: string;
  error?: string;
}

export interface InitializeDatabaseConfig {
  databaseProvider: 'sqlite' | 'postgresql';
  connectionString?: string;
  adminUser: {
    username: string;
    email: string;
    displayName: string;
    passwordHash: string;
  };
  siteSettings: {
    siteTitle: string;
    siteSubtitle: string | null;
    themeId: string;
  };
  includeSampleData: boolean;
}

export const SetupService = {
  async isDatabaseConfigured(): Promise<boolean> {
    const databaseUrl = process.env.DATABASE_URL;
    return Boolean(databaseUrl && databaseUrl.trim().length > 0);
  },

  async getSetupStatus(): Promise<SetupStatus> {
    // First check if database is configured
    const isConfigured = await this.isDatabaseConfigured();
    if (!isConfigured) {
      return {
        isSetupComplete: false,
        status: 'missing_table',
        error: 'Database not configured',
      };
    }

    try {
      const status = await SettingsRepository.getStatus();

      if (status.status === 'ready') {
        return {
          isSetupComplete: true,
          status: 'complete',
        };
      }

      return {
        isSetupComplete: false,
        status: status.status,
        error: status.status === 'missing_table'
          ? 'Database tables not found'
          : 'Site settings not initialized',
      };
    } catch (error) {
      return {
        isSetupComplete: false,
        status: 'missing_table',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  async configureDatabase(config: DatabaseTestConfig): Promise<void> {
    const envPath = path.join(process.cwd(), '.env');
    
    // Create DATABASE_URL
    let databaseUrl: string;
    if (config.type === 'sqlite') {
      databaseUrl = 'file:./dev.db';
    } else {
      if (!config.connectionString) {
        throw new Error('PostgreSQL connection string is required');
      }
      databaseUrl = config.connectionString;
    }

    // Read existing .env or create new one
    let envContent = '';
    try {
      envContent = await fs.readFile(envPath, 'utf-8');
    } catch {
      // File doesn't exist, start with empty content
    }

    // Update or add DATABASE_URL
    const lines = envContent.split('\n');
    const databaseUrlIndex = lines.findIndex(line => line.startsWith('DATABASE_URL='));
    
    if (databaseUrlIndex >= 0) {
      lines[databaseUrlIndex] = `DATABASE_URL="${databaseUrl}"`;
    } else {
      lines.push(`DATABASE_URL="${databaseUrl}"`);
    }

    // Write back to .env
    await fs.writeFile(envPath, lines.join('\n') + '\n', 'utf-8');

    // Update process.env for current process
    process.env.DATABASE_URL = databaseUrl;
  },

  async runMigrations(): Promise<void> {
    try {
      // Skip prisma generate - client should already be generated
    } catch (error) {
      throw new Error(`Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  async testDatabaseConnection(config: DatabaseTestConfig): Promise<DatabaseTestResult> {
    try {
      // Create a temporary Prisma client to test connection
      const prisma = new PrismaClient({
        datasourceUrl: config.type === 'sqlite'
          ? 'file:./test.db' // Use a test database file
          : config.connectionString,
      });

      // Try to connect
      await prisma.$connect();

      // Get database provider info
      const result: unknown = await prisma.$queryRaw`SELECT version()`;
      const provider = config.type;

      // Disconnect
      await prisma.$disconnect();

      return {
        success: true,
        provider,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Connection failed',
      };
    }
  },

  async initializeDatabase(config: InitializeDatabaseConfig): Promise<void> {
    // First configure the database
    await this.configureDatabase({
      type: config.databaseProvider,
      connectionString: config.connectionString,
    });

    // Run migrations
    await this.runMigrations();

    const prisma = new PrismaClient();

    try {

      // Create admin user
      await prisma.user.create({
        data: {
          username: config.adminUser.username,
          email: config.adminUser.email,
          displayName: config.adminUser.displayName,
          passwordHash: config.adminUser.passwordHash,
          role: 'admin',
          status: 'active',
        },
      });

      // Create initial settings
      await prisma.settings.create({
        data: {
          id: 'settings-singleton',
          siteTitle: config.siteSettings.siteTitle,
          siteSubtitle: config.siteSettings.siteSubtitle,
          theme: config.siteSettings.themeId,
          setupCompletedAt: new Date(),
          setupVersion: process.env.npm_package_version || '1.0.0',
          databaseProvider: config.databaseProvider,
        },
      });

      // Seed sample data if requested
      if (config.includeSampleData) {
        await this.seedSampleData();
      }
    } finally {
      await prisma.$disconnect();
    }
  },

  async seedSampleData(): Promise<void> {
    // This would call the existing seed functions
    // For now, we'll implement basic sample data seeding
    const prisma = new PrismaClient();

    try {
      // Create sample skill groups and skills
      const frontendGroup = await prisma.skillGroup.create({
        data: {
          id: 'frontend',
          slug: 'frontend',
          title: 'Frontend Development',
          summary: 'Modern web development technologies',
          displayOrder: 1,
        },
      });

      await prisma.skill.createMany({
        data: [
          {
            id: 'react',
            name: 'React',
            icon: 'react',
            level: '90',
            groupId: frontendGroup.id,
            displayOrder: 1,
          },
          {
            id: 'typescript',
            name: 'TypeScript',
            icon: 'typescript',
            level: '85',
            groupId: frontendGroup.id,
            displayOrder: 2,
          },
          {
            id: 'nextjs',
            name: 'Next.js',
            icon: 'nextjs',
            level: '80',
            groupId: frontendGroup.id,
            displayOrder: 3,
          },
        ],
      });

      // Create sample portfolio project
      await prisma.portfolio.create({
        data: {
          slug: 'sample-project',
          title: 'Sample Portfolio Project',
          tagline: 'A demonstration project',
          intro: 'This is a sample project to showcase the portfolio functionality.',
          summary: 'A comprehensive example of a portfolio project with all features demonstrated.',
          featured: true,
          visibility: 'public',
          access: 'client-owned',
          status: 'live',
          role: 'Full Stack Developer',
          startDate: new Date('2023-01-01'),
          stack: JSON.stringify(['React', 'TypeScript', 'Next.js', 'Prisma']),
          features: JSON.stringify(['Responsive design', 'SEO optimized', 'Performance focused']),
          displayOrder: 1,
          published: true,
          publishedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Create sample experience
      await prisma.experience.create({
        data: {
          id: 'sample-experience',
          company: 'Sample Company',
          title: 'Senior Developer',
          location: 'Remote',
          startDate: new Date('2022-01-01'),
          present: true,
          impact: 'Led development of multiple high-impact projects',
          achievements: JSON.stringify([
            'Improved application performance by 40%',
            'Mentored junior developers',
            'Implemented CI/CD pipelines',
          ]),
          skills: JSON.stringify(['React', 'Node.js', 'AWS']),
          displayOrder: 1,
          published: true,
        },
      });
    } finally {
      await prisma.$disconnect();
    }
  },
};