import 'dotenv/config';

import { PrismaClient } from '@prisma/client';

import { hashPassword } from '../src/server/security/password';
import { metadata } from '../src/static-content/metadata';
import { personalInfo, heroContent, contactInfo } from '../src/static-content/personal';
import { portfolio as portfolioData } from '../src/static-content/portfolio';
import { experience as experienceData } from '../src/static-content/experience';
import { education as educationData } from '../src/static-content/education';
import { services as serviceData } from '../src/static-content/services';
import { certificates as certificateData } from '../src/static-content/certificates';
import { recommendations as recommendationData } from '../src/static-content/recommendations';
import { skillGroups } from '../src/static-content/skills';

const prisma = new PrismaClient();

const isoDate = (value?: string | Date | null) => {
  if (!value) return undefined;
  if (value instanceof Date) return value;
  return new Date(value);
};

const yearMonthToDate = (value?: string | null) => {
  if (!value) return undefined;
  if (value.length === 7) {
    return new Date(`${value}-01T00:00:00Z`);
  }
  return new Date(value);
};

async function seedSettings() {
  const id = 'settings-singleton';

  await prisma.settings.upsert({
    where: { id },
    update: {
      siteTitle: metadata.fullName,
      siteSubtitle: metadata.tagline,
      heroGreeting: heroContent.greeting,
      heroSubtitle: heroContent.subtitle,
      heroDescription: heroContent.description,
      primaryEmail: metadata.emails[0] ?? null,
      secondaryEmail: metadata.emails[1] ?? null,
      location: personalInfo.location,
      socialLinks: JSON.stringify(metadata.links),
      heroButtons: JSON.stringify({
        primary: metadata.hero.primaryButton,
        secondary: metadata.hero.secondaryButton,
      }),
      contactConfig: JSON.stringify({
        title: contactInfo.title,
        subtitle: contactInfo.subtitle,
      }),
      seoDefaults: JSON.stringify({
        languages: metadata.languages,
        highlights: metadata.highlights,
      }),
    },
    create: {
      id,
      siteTitle: metadata.fullName,
      siteSubtitle: metadata.tagline,
      heroGreeting: heroContent.greeting,
      heroSubtitle: heroContent.subtitle,
      heroDescription: heroContent.description,
      primaryEmail: metadata.emails[0] ?? null,
      secondaryEmail: metadata.emails[1] ?? null,
      location: personalInfo.location,
      socialLinks: JSON.stringify(metadata.links),
      heroButtons: JSON.stringify({
        primary: metadata.hero.primaryButton,
        secondary: metadata.hero.secondaryButton,
      }),
      contactConfig: JSON.stringify({
        title: contactInfo.title,
        subtitle: contactInfo.subtitle,
      }),
      seoDefaults: JSON.stringify({
        languages: metadata.languages,
        highlights: metadata.highlights,
      }),
    },
  });
}

async function seedSkillGroups() {
  for (const [index, group] of skillGroups.entries()) {
    const record = await prisma.skillGroup.upsert({
      where: { slug: group.id },
      update: {
        title: group.title,
        summary: group.summary,
        displayOrder: index,
      },
      create: {
        id: group.id,
        slug: group.id,
        title: group.title,
        summary: group.summary,
        displayOrder: index,
      },
    });

    await prisma.skill.deleteMany({ where: { groupId: record.id } });

    if (group.skills?.length) {
      await prisma.$transaction(
        group.skills.map((skill, skillIndex) =>
          prisma.skill.upsert({
            where: {
              name_groupId: {
                name: skill.name,
                groupId: record.id,
              },
            },
            update: {
              displayOrder: skillIndex,
            },
            create: {
              id: `${record.id}-${skillIndex + 1}`,
              name: skill.name,
              groupId: record.id,
              displayOrder: skillIndex,
            },
          })
        )
      );
    }
  }
}

async function seedPortfolio() {
  let order = 0;
  for (const project of portfolioData) {
    await prisma.portfolio.upsert({
      where: { slug: project.slug },
      update: {
        title: project.title,
        tagline: project.tagline,
        intro: project.intro,
        summary: project.summary,
        featured: Boolean(project.featured),
  visibility: project.visibility,
  access: project.access,
  status: project.status,
        domain: project.domain ?? null,
        company: project.company ?? null,
        client: project.client ?? null,
        website: project.website ?? null,
        repository: project.repository ?? null,
        role: project.role,
        startDate: yearMonthToDate(project.start),
        endDate: yearMonthToDate(project.end ?? undefined),
  stack: JSON.stringify(project.stack ?? []),
  features: project.features ? JSON.stringify(project.features) : null,
  sections: project.sections ? JSON.stringify(project.sections) : null,
  gallery: project.gallery ? JSON.stringify(project.gallery) : null,
        confidentialNotes: project.confidentialNotes ?? null,
        displayOrder: order,
        published: true,
        publishedAt: isoDate(project.createdAt),
      },
      create: {
        slug: project.slug,
        title: project.title,
        tagline: project.tagline,
        intro: project.intro,
        summary: project.summary,
        featured: Boolean(project.featured),
  visibility: project.visibility,
  access: project.access,
  status: project.status,
        domain: project.domain ?? null,
        company: project.company ?? null,
        client: project.client ?? null,
        website: project.website ?? null,
        repository: project.repository ?? null,
        role: project.role,
        startDate: yearMonthToDate(project.start),
        endDate: yearMonthToDate(project.end ?? undefined),
  stack: JSON.stringify(project.stack ?? []),
  features: project.features ? JSON.stringify(project.features) : null,
  sections: project.sections ? JSON.stringify(project.sections) : null,
  gallery: project.gallery ? JSON.stringify(project.gallery) : null,
        confidentialNotes: project.confidentialNotes ?? null,
        displayOrder: order,
        published: true,
        publishedAt: isoDate(project.createdAt) ?? new Date(),
        createdAt: isoDate(project.createdAt) ?? new Date(),
        updatedAt: isoDate(project.updatedAt) ?? new Date(),
      },
    });
    order += 1;
  }
}

async function seedExperience() {
  let order = 0;
  for (const item of experienceData) {
    await prisma.experience.upsert({
      where: { id: typeof item.id === 'string' ? item.id : String(item.id) },
      update: {
        company: item.company,
        title: item.title,
        location: item.location ?? null,
        startDate: yearMonthToDate(item.start),
        endDate: yearMonthToDate(item.end ?? undefined),
        present: item.present,
        impact: item.impact ?? null,
  achievements: item.achievements ? JSON.stringify(item.achievements) : null,
  skills: item.skills ? JSON.stringify(item.skills) : null,
        companyUrl: item.companyUrl ?? null,
        displayOrder: order,
        published: true,
      },
      create: {
        id: typeof item.id === 'string' ? item.id : String(item.id),
        company: item.company,
        title: item.title,
        location: item.location ?? null,
        startDate: yearMonthToDate(item.start) ?? new Date(),
        endDate: yearMonthToDate(item.end ?? undefined),
        present: item.present,
        impact: item.impact ?? null,
  achievements: item.achievements ? JSON.stringify(item.achievements) : null,
  skills: item.skills ? JSON.stringify(item.skills) : null,
        companyUrl: item.companyUrl ?? null,
        displayOrder: order,
        published: true,
      },
    });
    order += 1;
  }
}

async function seedEducation() {
  let order = 0;
  for (const item of educationData) {
    await prisma.education.upsert({
      where: { id: typeof item.id === 'string' ? item.id : String(item.id) },
      update: {
        institution: item.institution,
        degree: item.degree,
        field: item.field ?? null,
        location: item.location ?? null,
        startDate: yearMonthToDate(item.start),
        endDate: yearMonthToDate(item.end ?? undefined),
        present: item.present,
        gpa: item.gpa ?? null,
  achievements: item.achievements ? JSON.stringify(item.achievements) : null,
        project: item.project ?? null,
        displayOrder: order,
        published: true,
      },
      create: {
        id: typeof item.id === 'string' ? item.id : String(item.id),
        institution: item.institution,
        degree: item.degree,
        field: item.field ?? null,
        location: item.location ?? null,
        startDate: yearMonthToDate(item.start) ?? new Date(),
        endDate: yearMonthToDate(item.end ?? undefined),
        present: item.present,
        gpa: item.gpa ?? null,
  achievements: item.achievements ? JSON.stringify(item.achievements) : null,
        project: item.project ?? null,
        displayOrder: order,
        published: true,
      },
    });
    order += 1;
  }
}

async function seedServices() {
  let order = 0;
  for (const service of serviceData) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {
        title: service.title,
        description: service.description,
        longDescription: service.longDescription ?? null,
  features: service.features ? JSON.stringify(service.features) : null,
  technologies: service.technologies ? JSON.stringify(service.technologies) : null,
        icon: service.icon ?? null,
        image: service.image ?? null,
        active: service.active ?? true,
        displayOrder: order,
      },
      create: {
        id: service.id,
        slug: service.slug,
        title: service.title,
        description: service.description,
        longDescription: service.longDescription ?? null,
  features: service.features ? JSON.stringify(service.features) : null,
  technologies: service.technologies ? JSON.stringify(service.technologies) : null,
        icon: service.icon ?? null,
        image: service.image ?? null,
        active: service.active ?? true,
        displayOrder: order,
      },
    });
    order += 1;
  }
}

async function seedCertificates() {
  let order = 0;
  for (const certificate of certificateData) {
    await prisma.certificate.upsert({
      where: { id: String(certificate.id) },
      update: {
        name: certificate.name,
        issuer: certificate.issuer,
        issuedOn: isoDate(certificate.date) ?? new Date(),
        credentialId: certificate.credential ?? null,
        description: certificate.description ?? null,
  skills: certificate.skills ? JSON.stringify(certificate.skills) : null,
        image: certificate.image ?? null,
        verifyUrl: certificate.verifyUrl ?? null,
        displayOrder: order,
      },
      create: {
        id: String(certificate.id),
        name: certificate.name,
        issuer: certificate.issuer,
        issuedOn: isoDate(certificate.date) ?? new Date(),
        credentialId: certificate.credential ?? null,
        description: certificate.description ?? null,
  skills: certificate.skills ? JSON.stringify(certificate.skills) : null,
        image: certificate.image ?? null,
        verifyUrl: certificate.verifyUrl ?? null,
        displayOrder: order,
      },
    });
    order += 1;
  }
}

async function seedRecommendations() {
  let order = 0;
  for (const rec of recommendationData) {
    await prisma.recommendation.upsert({
      where: { id: String(rec.id) },
      update: {
        name: rec.name,
        position: rec.position ?? null,
        company: rec.company ?? null,
        relationship: rec.relationship ?? null,
        content: rec.content,
        rating: rec.rating ?? null,
        linkedin: rec.linkedin ?? null,
        recommendationLetterUrl: rec.recommendationLetterUrl ?? null,
        photo: rec.photo ?? null,
        receivedOn: isoDate(rec.date) ?? null,
        displayOrder: order,
        published: true,
      },
      create: {
        id: String(rec.id),
        name: rec.name,
        position: rec.position ?? null,
        company: rec.company ?? null,
        relationship: rec.relationship ?? null,
        content: rec.content,
        rating: rec.rating ?? null,
        linkedin: rec.linkedin ?? null,
        recommendationLetterUrl: rec.recommendationLetterUrl ?? null,
        photo: rec.photo ?? null,
        receivedOn: isoDate(rec.date) ?? null,
        displayOrder: order,
        published: true,
      },
    });
    order += 1;
  }
}

async function seedAdminUser() {
  const username = (process.env.SEED_ADMIN_USERNAME ?? 'admin').trim().toLowerCase();
  const email = (process.env.SEED_ADMIN_EMAIL ?? 'admin@example.com').trim().toLowerCase();
  const displayName = process.env.SEED_ADMIN_DISPLAY_NAME ?? 'Portfolio Admin';
  const password = process.env.SEED_ADMIN_PASSWORD ?? 'change-me-now';

  const passwordHash = await hashPassword(password);

  await prisma.user.upsert({
    where: { username },
    update: {
      email,
      displayName,
      passwordHash,
      role: 'admin',
      status: 'active',
    },
    create: {
      username,
      email,
      displayName,
      passwordHash,
      role: 'admin',
      status: 'active',
    },
  });
}

async function clearTables() {
  await prisma.contentVersion.deleteMany();
  await prisma.media.deleteMany();
  await prisma.blogTag.deleteMany();
  await prisma.blogCategory.deleteMany();
  await prisma.blog.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();
  await prisma.portfolio.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.education.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.skillGroup.deleteMany();
  await prisma.service.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.recommendation.deleteMany();
  await prisma.user.deleteMany();
}

async function main() {
  if (process.env.NODE_ENV === 'production') {
    console.warn('Seeding is skipped in production environment.');
    return;
  }

  console.info('Resetting tables...');
  await clearTables();

  console.info('Seeding settings...');
  await seedSettings();

  console.info('Seeding admin user...');
  await seedAdminUser();

  console.info('Seeding skill groups & skills...');
  await seedSkillGroups();

  console.info('Seeding portfolio projects...');
  await seedPortfolio();

  console.info('Seeding experience...');
  await seedExperience();

  console.info('Seeding education...');
  await seedEducation();

  console.info('Seeding services...');
  await seedServices();

  console.info('Seeding certificates...');
  await seedCertificates();

  console.info('Seeding recommendations...');
  await seedRecommendations();

  console.info('Database seed complete.');
}

main()
  .catch((error) => {
    console.error('Failed to seed database:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
