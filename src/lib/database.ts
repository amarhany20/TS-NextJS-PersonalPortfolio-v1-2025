import { PrismaClient } from "@prisma/client";

// Create a global variable to store the Prisma client instance
declare global {
  var prisma: PrismaClient | undefined;
}

// Create a single Prisma client instance
export const prisma = globalThis.prisma || new PrismaClient();

// In development, store the client in a global variable to prevent multiple instances
if (process.env.NODE_ENV === "development") {
  globalThis.prisma = prisma;
}

// Export the Prisma client as default
export default prisma;
