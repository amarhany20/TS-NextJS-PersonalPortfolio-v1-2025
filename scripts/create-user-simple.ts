/**
 * Create User Script (Simple Version)
 *
 * This script creates a new user in the database with the provided email and password.
 * It's meant to be called from the create-user.sh shell script.
 *
 * Usage:
 *   npx tsx scripts/create-user-simple.ts email password [firstName] [lastName] [role]
 */

import { PrismaClient } from "@prisma/client";
import { PasswordService } from "../src/lib/auth";

// Create Prisma client
const prisma = new PrismaClient();

async function createUser(email: string, password: string, firstName?: string, lastName?: string, role?: "USER" | "ADMIN" | "SUPER_ADMIN") {
  try {
    // Validate email
    if (!email || !email.includes("@")) {
      throw new Error("Please provide a valid email address");
    }

    // Validate password
    if (!password || password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }

    // Validate role
    if (role && !["USER", "ADMIN", "SUPER_ADMIN"].includes(role)) {
      throw new Error("Invalid role. Must be one of: USER, ADMIN, SUPER_ADMIN");
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error(`User with email ${email} already exists`);
    }

    // Hash password
    const passwordHash = await PasswordService.hash(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName: firstName || "",
        lastName: lastName || "",
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

// Get command line arguments
const [email, password, firstName, lastName, role] = process.argv.slice(2);

if (!email || !password) {
  console.log("Usage: npx tsx scripts/create-user-simple.ts <email> <password> [firstName] [lastName] [role]");
  process.exit(1);
}

// Create user
createUser(email, password, firstName, lastName, role as "USER" | "ADMIN" | "SUPER_ADMIN")
  .catch((e) => {
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
