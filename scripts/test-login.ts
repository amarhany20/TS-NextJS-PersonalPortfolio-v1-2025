/**
 * Test Login Functionality
 * Debug script to test authentication without the server
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function testLogin() {
  try {
    console.log("🔍 Testing login functionality...");

    // Check if users exist
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isActive: true,
      },
    });

    console.log("📊 Found users:", users);

    if (users.length === 0) {
      console.log("❌ No users found in database");
      return;
    }

    // Test password for admin user
    const adminUser = await prisma.user.findUnique({
      where: { email: "admin@crm.local" },
    });

    if (adminUser) {
      console.log("👤 Testing admin user login...");
      const isValid = await bcrypt.compare("admin123456", adminUser.passwordHash);
      console.log("🔐 Password valid:", isValid);

      if (!isValid) {
        console.log("❌ Password hash mismatch. Let me check the stored hash...");
        console.log("🔑 Stored hash:", adminUser.passwordHash);

        // Create a new hash for comparison
        const newHash = await bcrypt.hash("admin123456", 12);
        console.log("🔑 New hash:", newHash);
        const testNewHash = await bcrypt.compare("admin123456", newHash);
        console.log("✅ New hash works:", testNewHash);
      }
    } else {
      console.log("❌ Admin user not found");
    }

    // Test user account
    const testUser = await prisma.user.findUnique({
      where: { email: "user@crm.local" },
    });

    if (testUser) {
      console.log("👤 Testing regular user login...");
      const isValid = await bcrypt.compare("user123456", testUser.passwordHash);
      console.log("🔐 Password valid:", isValid);
    } else {
      console.log("❌ Test user not found");
    }
  } catch (error) {
    console.error("❌ Test failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();
