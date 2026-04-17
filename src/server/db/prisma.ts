/**
 * Prisma Client Singleton
 *
 * Provides a single Prisma client instance across the app.
 * Safe to import in both server actions and route handlers.
 */

import { PrismaClient } from '@prisma/client';
import { env } from '@/server/server-validators/env';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['warn', 'error'],
  });

if (env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
