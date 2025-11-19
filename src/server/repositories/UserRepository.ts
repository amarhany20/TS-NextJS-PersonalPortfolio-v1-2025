import prisma from '@/server/db/prisma';

export interface DbUser {
  id: string;
  username: string;
  email: string;
  displayName: string;
  passwordHash: string;
  role: string;
  status: string;
  bio?: string | null;
  avatarUrl?: string | null;
  lastLoginAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

function mapUser(record: Awaited<ReturnType<typeof prisma.user.findFirst>>): DbUser | null {
  if (!record) {
    return null;
  }

  return {
    id: record.id,
    username: record.username,
    email: record.email,
    displayName: record.displayName,
    passwordHash: record.passwordHash,
    role: record.role,
    status: record.status,
    bio: record.bio,
    avatarUrl: record.avatarUrl,
    lastLoginAt: record.lastLoginAt,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

export const UserRepository = {
  async findByUsername(username: string): Promise<DbUser | null> {
    const record = await prisma.user.findUnique({ where: { username } });
    return mapUser(record);
  },

  async findById(id: string): Promise<DbUser | null> {
    const record = await prisma.user.findUnique({ where: { id } });
    return mapUser(record);
  },

  async recordLogin(id: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  },
};
