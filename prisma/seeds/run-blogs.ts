import { PrismaClient } from '@prisma/client';
import { seedBlogs } from './seed-blogs';
const prisma = new PrismaClient();
seedBlogs(prisma).catch(e=>{console.error(e);process.exit(1);}).finally(()=>prisma.$disconnect());