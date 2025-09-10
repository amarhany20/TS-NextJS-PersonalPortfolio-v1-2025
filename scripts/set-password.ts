/**
 * Set or Create User Password
 *
 * Usage (PowerShell):
 *   npm run set-password -- --email=user@example.com --password=Secret_123
 */

import { PrismaClient } from "@prisma/client";
import { PasswordService } from "../src/lib/auth";

const prisma = new PrismaClient();

interface Args { email: string; password: string; firstName?: string; lastName?: string }

function parseArgs(): Args {
  const args: Record<string, string> = {};
  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith("--")) {
      const [key, value] = arg.slice(2).split("=");
      if (key) args[key] = value ?? "";
    }
  }
  const { email, password, firstName, lastName } = args;
  if (!email || !password) {
    console.log("Usage: npm run set-password -- --email=user@example.com --password=Secret_123 [--firstName=First] [--lastName=Last]");
    process.exit(1);
  }
  return { email, password, firstName, lastName };
}

async function main() {
  const { email, password, firstName, lastName } = parseArgs();
  const existing = await prisma.user.findUnique({ where: { email } });
  const passwordHash = await PasswordService.hash(password);

  if (existing) {
    await prisma.user.update({ where: { id: existing.id }, data: { passwordHash, isActive: true } });
    console.log(`✅ Password updated for ${email}`);
  } else {
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName: firstName ?? "",
        lastName: lastName ?? "",
        emailVerified: true,
        isActive: true,
      },
    });
    console.log(`✅ User created: ${user.email}`);
  }
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
