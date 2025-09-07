import { PrismaClient } from '@prisma/client';
import { seedCore } from './seed-core';
const prisma = new PrismaClient();
seedCore(prisma).catch(e=>{console.error(e);process.exit(1);}).finally(()=>prisma.$disconnect());