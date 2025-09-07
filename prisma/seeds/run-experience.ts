import { PrismaClient } from '@prisma/client';
import { seedExperience } from './seed-experience';
const prisma = new PrismaClient();
seedExperience(prisma).catch(e=>{console.error(e);process.exit(1);}).finally(()=>prisma.$disconnect());