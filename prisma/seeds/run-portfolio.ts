import { PrismaClient } from '@prisma/client';
import { seedPortfolio } from './seed-portfolio';
const prisma = new PrismaClient();
seedPortfolio(prisma).catch(e=>{console.error(e);process.exit(1);}).finally(()=>prisma.$disconnect());