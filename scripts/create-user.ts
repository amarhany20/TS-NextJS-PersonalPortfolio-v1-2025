/**
 * Create User Script
 *
 * This script creates a new user in the database with the provided email and password.
 *
 * Usage:
 *   npm run create-user -- --email=user@example.com --password=userpassword --firstName=John --lastName=Doe --role=USER|ADMIN|SUPER_ADMIN
 */

import { PrismaClient } from "@prisma/client";
import { PasswordService } from "../src/lib/auth";

// Create Prisma client
const prisma = new PrismaClient();

interface CreateUserArgs {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

async function createUser(args: CreateUserArgs) {
  try {
    // Validate email
    if (!args.email || !args.email.includes("@")) {
      throw new Error("Please provide a valid email address");
    }

    // Validate password
    if (!args.password || args.password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: args.email },
    });

    if (existingUser) {
      throw new Error(`User with email ${args.email} already exists`);
    }

    // Hash password
    const passwordHash = await PasswordService.hash(args.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: args.email,
        passwordHash,
        firstName: args.firstName || "",
  lastName: args.lastName || "",
        emailVerified: true,
        isActive: true,
      },
    });

    console.log(`✅ User created successfully!`);
    console.log(`Email: ${user.email}`);
    console.log(`Name: ${user.firstName} ${user.lastName}`);

    return user;
  } catch (error) {
    console.error("❌ Error creating user:", error);
    throw error;
  }
}

// Parse command line arguments
function parseArgs(): CreateUserArgs {
  const args: Record<string, string> = {};

  process.argv.slice(2).forEach((arg) => {
    if (arg.startsWith("--")) {
      const [key, value] = arg.slice(2).split("=");
      if (key && value) {
        args[key] = value;
      }
    }
  });

  if (!args.email || !args.password) {
    console.log("Usage: npm run create-user -- --email=user@example.com --password=userpassword [--firstName=John] [--lastName=Doe] [--role=USER|ADMIN|SUPER_ADMIN]");
    process.exit(1);
  }

  return {
    email: args.email,
    password: args.password,
    firstName: args.firstName,
    lastName: args.lastName,
  };
}

const userArgs = parseArgs();

// Create user
createUser(userArgs)
  .catch((e) => {
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
