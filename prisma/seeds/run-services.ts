import { PrismaClient } from '@prisma/client';
import { seedServices } from './seed-services';
const prisma = new PrismaClient();
seedServices(prisma).catch(e=>{console.error(e);process.exit(1);}).finally(()=>prisma.$disconnect());