import { SettingsRepository } from '@/server/repositories/SettingsRepository';
import { PrismaClient } from '@prisma/client';


export interface SetupStatus {
  isSetupComplete: boolean;
  status: 'complete' | 'missing_table' | 'missing_record';
  error?: string;
}

export interface DatabaseTestConfig {
  type: 'postgresql';
  connectionString?: string;
}


export interface DatabaseTestResult {
  success: boolean;
  provider?: string;
  error?: string;
}

export interface InitializeDatabaseConfig {
  databaseProvider: 'postgresql';
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

  isSetupModeEnabled(): boolean {
    return process.env.SETUP_MODE === 'true';
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


  async runMigrations(): Promise<void> {
    try {
      // Skip prisma generate - client should already be generated
    } catch (error) {
      throw new Error(`Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  async testDatabaseConnection(config: DatabaseTestConfig): Promise<DatabaseTestResult> {
    try {
      const connectionString = config.connectionString || process.env.DATABASE_URL;
      if (!connectionString) {
        return {
          success: false,
          error: 'DATABASE_URL is missing. Set it in Vercel before testing.',
        };
      }

      // Create a temporary Prisma client to test connection
      const prisma = new PrismaClient({
        datasourceUrl: connectionString,
      });

      // Try to connect
      await prisma.$connect();

      // Get database provider info
      await prisma.$queryRaw`SELECT version()`;
      const provider = 'postgresql';

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


  isSampleSeedingEnabled(): boolean {
    return process.env.SEED_SAMPLE_DATA === 'true';
  },

  async initializeDatabase(config: InitializeDatabaseConfig): Promise<void> {
    if (config.databaseProvider !== 'postgresql') {
      throw new Error('Only PostgreSQL is supported for production setup.');
    }

    const databaseUrl = config.connectionString || process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL is required before running setup.');
    }

    // Run migrations outside of the runtime environment
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

      // Seed sample data if requested and enabled
      if (config.includeSampleData && this.isSampleSeedingEnabled()) {
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