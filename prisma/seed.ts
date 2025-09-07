import { PrismaClient } from '@prisma/client';
import { seedCore } from './seeds/seed-core';
import { seedServices } from './seeds/seed-services';
import { seedExperience } from './seeds/seed-experience';
import { seedBlogs } from './seeds/seed-blogs';
import { seedPortfolio } from './seeds/seed-portfolio';

const prisma = new PrismaClient();

async function clearDatabase() {
  console.log('🗑️ Clearing existing data (truncate logic)...');
  await prisma.session.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.recommendation.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.project.deleteMany();
  await prisma.service.deleteMany();
  await prisma.metadata.deleteMany();
  await prisma.language.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.skillCategory.deleteMany();
  await prisma.education.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.cVInfo.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.user.deleteMany();
  console.log('✅ Data cleared');
}

async function main() {
  console.log('🌱 Orchestrated seeding start');
  await clearDatabase();
  await seedCore(prisma);
  await seedExperience(prisma);
  await seedServices(prisma);
  await seedBlogs(prisma);
  await seedPortfolio(prisma); // placeholder
  console.log('\n🎉 Seeding complete.');
}

main().catch(e => { console.error('❌ Seed failed', e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
