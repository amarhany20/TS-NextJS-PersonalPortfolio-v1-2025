import 'dotenv/config';

import fs from 'node:fs/promises';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';

import { hashPassword } from '../src/server/security/password';

type ArchivePayload = {
  metadata?: any;
  personalInfo?: any;
  heroContent?: any;
  contactInfo?: any;
  portfolio?: any[];
  experience?: any[];
  education?: any[];
  services?: any[];
  certificates?: any[];
  recommendations?: any[];
  skillGroups?: any[];
  coreSkills?: any[];
};

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

const detectDatabaseProvider = (url?: string) => {
  if (!url) return 'unknown';
  if (url.startsWith('file:')) return 'sqlite';
  if (url.startsWith('postgres')) return 'postgresql';
  if (url.startsWith('mysql')) return 'mysql';
  return 'unknown';
};

async function findLatestArchiveManifest(): Promise<{ manifestPath: string; data: ArchivePayload } | null> {
  const archiveRoot = path.resolve(process.cwd(), 'backups', 'static-content-archive');
  try {
    const stats = await fs.stat(archiveRoot).catch(() => null);
    if (!stats || !stats.isDirectory()) return null;

    const entries = await fs.readdir(archiveRoot, { withFileTypes: true });
    const dirs = entries.filter((e) => e.isDirectory()).map((d) => d.name);
    if (!dirs.length) return null;
    // Assuming YYYY-MM-DD naming; lexicographic sort works
    dirs.sort((a, b) => (a < b ? 1 : a > b ? -1 : 0));
    for (const dir of dirs) {
      const manifestPath = path.join(archiveRoot, dir, 'manifest.json');
      const exists = await fs.stat(manifestPath).then(() => true).catch(() => false);
      if (exists) {
        const json = await fs.readFile(manifestPath, 'utf-8');
        const parsed = JSON.parse(json);
        const data: ArchivePayload = parsed.data ?? parsed;
        return { manifestPath, data };
      }
    }
  } catch {
    // ignore
  }
  return null;
}

async function loadArchiveOrStatic(): Promise<{ source: 'archive' | 'static'; payload: ArchivePayload }>
{
  const archive = await findLatestArchiveManifest();
  if (archive) {
    return { source: 'archive', payload: archive.data };
  }

  const [metadataMod, personalMod, portfolioMod, experienceMod, educationMod, servicesMod, certificatesMod, recommendationsMod, skillsMod] = await Promise.all([
    import('../src/static-content/metadata'),
    import('../src/static-content/personal'),
    import('../src/static-content/portfolio'),
    import('../src/static-content/experience'),
    import('../src/static-content/education'),
    import('../src/static-content/services'),
    import('../src/static-content/certificates'),
    import('../src/static-content/recommendations'),
    import('../src/static-content/skills'),
  ]);

  return {
    source: 'static',
    payload: {
      metadata: metadataMod.metadata,
      personalInfo: personalMod.personalInfo,
      heroContent: personalMod.heroContent,
      contactInfo: personalMod.contactInfo,
      portfolio: portfolioMod.portfolio,
      experience: experienceMod.experience,
      education: educationMod.education,
      services: servicesMod.services,
      certificates: certificatesMod.certificates,
      recommendations: recommendationsMod.recommendations,
      skillGroups: skillsMod.skillGroups,
      coreSkills: skillsMod.coreSkills,
    },
  };
}

async function seedSettings(payload: ArchivePayload) {
  const id = 'settings-singleton';
  const setupVersion = process.env.npm_package_version ?? '00.50.07';
  const databaseProvider = detectDatabaseProvider(process.env.DATABASE_URL);

  const metadata = payload.metadata ?? {};
  const heroContent = payload.heroContent ?? {};
  const personalInfo = payload.personalInfo ?? {};
  const contactInfo = payload.contactInfo ?? {};
  const coreSkills = (payload.coreSkills ?? []).map((s: any) => (typeof s === 'string' ? { name: s } : s));

  const seoDefaultsPayload = {
    languages: metadata.languages,
    highlights: metadata.highlights,
    coreSkills: coreSkills.map((skill: any) => skill.name),
    title: metadata.fullName,
    titleTemplate: metadata.titleTemplate,
    description: metadata.description,
    keywords: metadata.keywords,
    siteUrl: metadata.siteUrl,
    openGraphImage: metadata.openGraphImage,
    twitterHandle: metadata.twitterHandle,
  };

  await prisma.settings.upsert({
    where: { id },
    update: {
      siteTitle: metadata.fullName,
      siteSubtitle: metadata.tagline,
      heroGreeting: heroContent.greeting,
      heroSubtitle: heroContent.subtitle,
      heroDescription: heroContent.description,
      primaryEmail: metadata.emails?.[0] ?? null,
      secondaryEmail: metadata.emails?.[1] ?? null,
      location: personalInfo.location ?? null,
      socialLinks: JSON.stringify(metadata.links ?? {}),
      heroButtons: JSON.stringify({
        primary: metadata.hero?.primaryButton,
        secondary: metadata.hero?.secondaryButton,
      }),
      contactConfig: JSON.stringify({
        title: contactInfo.title,
        subtitle: contactInfo.subtitle,
      }),
      seoDefaults: JSON.stringify(seoDefaultsPayload),
      setupCompletedAt: new Date(),
      setupVersion,
      databaseProvider,
    },
    create: {
      id,
      siteTitle: metadata.fullName ?? 'My Portfolio',
      siteSubtitle: metadata.tagline ?? null,
      heroGreeting: heroContent.greeting ?? null,
      heroSubtitle: heroContent.subtitle ?? null,
      heroDescription: heroContent.description ?? null,
      primaryEmail: metadata.emails?.[0] ?? null,
      secondaryEmail: metadata.emails?.[1] ?? null,
      location: personalInfo.location ?? null,
      socialLinks: JSON.stringify(metadata.links ?? {}),
      heroButtons: JSON.stringify({
        primary: metadata.hero?.primaryButton,
        secondary: metadata.hero?.secondaryButton,
      }),
      contactConfig: JSON.stringify({
        title: contactInfo.title ?? null,
        subtitle: contactInfo.subtitle ?? null,
      }),
      seoDefaults: JSON.stringify(seoDefaultsPayload),
      setupCompletedAt: new Date(),
      setupVersion,
      databaseProvider,
    },
  });
}

async function seedSkillGroups(payload: ArchivePayload) {
  const groups = payload.skillGroups ?? [];
  for (const [index, group] of groups.entries()) {
    const slug = group.slug ?? group.id;
    const record = await prisma.skillGroup.upsert({
      where: { slug },
      update: {
        title: group.title,
        summary: group.summary ?? null,
        displayOrder: index,
      },
      create: {
        id: slug,
        slug,
        title: group.title,
        summary: group.summary ?? null,
        displayOrder: index,
      },
    });

    await prisma.skill.deleteMany({ where: { groupId: record.id } });

    const skills = group.skills ?? [];
    if (skills.length) {
      await prisma.$transaction(
        skills.map((skill: any, skillIndex: number) =>
          prisma.skill.upsert({
            where: {
              name_groupId: {
                name: skill.name,
                groupId: record.id,
              },
            },
            update: {
              icon: skill.icon ?? null,
              level: skill.level ?? null,
              keywords: skill.keywords ? JSON.stringify(skill.keywords) : null,
              displayOrder: skillIndex,
            },
            create: {
              id: `${record.id}-${skillIndex + 1}`,
              name: skill.name,
              icon: skill.icon ?? null,
              level: skill.level ?? null,
              keywords: skill.keywords ? JSON.stringify(skill.keywords) : null,
              groupId: record.id,
              displayOrder: skillIndex,
            },
          })
        )
      );
    }
  }
}

async function seedPortfolio(payload: ArchivePayload) {
  const items = payload.portfolio ?? [];
  let order = 0;
  for (const project of items) {
    await prisma.portfolio.upsert({
      where: { slug: project.slug },
      update: {
        title: project.title,
        tagline: project.tagline,
        intro: project.intro,
        summary: project.summary,
        featured: Boolean(project.featured),
        visibility: project.visibility ?? 'public',
        access: project.access ?? 'client-owned',
        status: project.status ?? 'live',
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
        published: project.published ?? true,
        publishedAt: isoDate(project.createdAt) ?? undefined,
      },
      create: {
        slug: project.slug,
        title: project.title,
        tagline: project.tagline,
        intro: project.intro,
        summary: project.summary,
        featured: Boolean(project.featured),
        visibility: project.visibility ?? 'public',
        access: project.access ?? 'client-owned',
        status: project.status ?? 'live',
        domain: project.domain ?? null,
        company: project.company ?? null,
        client: project.client ?? null,
        website: project.website ?? null,
        repository: project.repository ?? null,
        role: project.role,
        startDate: yearMonthToDate(project.start) ?? new Date(),
        endDate: yearMonthToDate(project.end ?? undefined),
        stack: JSON.stringify(project.stack ?? []),
        features: project.features ? JSON.stringify(project.features) : null,
        sections: project.sections ? JSON.stringify(project.sections) : null,
        gallery: project.gallery ? JSON.stringify(project.gallery) : null,
        confidentialNotes: project.confidentialNotes ?? null,
        displayOrder: order,
        published: project.published ?? true,
        publishedAt: isoDate(project.createdAt) ?? new Date(),
        createdAt: isoDate(project.createdAt) ?? new Date(),
        updatedAt: isoDate(project.updatedAt) ?? new Date(),
      },
    });
    order += 1;
  }
}

async function seedExperience(payload: ArchivePayload) {
  const items = payload.experience ?? [];
  let order = 0;
  for (const item of items) {
    const id = typeof item.id === 'string' ? item.id : String(item.id);
    await prisma.experience.upsert({
      where: { id },
      update: {
        company: item.company,
        title: item.title,
        location: item.location ?? null,
        startDate: yearMonthToDate(item.start),
        endDate: yearMonthToDate(item.end ?? undefined),
        present: Boolean(item.present),
        impact: item.impact ?? null,
        achievements: item.achievements ? JSON.stringify(item.achievements) : null,
        skills: item.skills ? JSON.stringify(item.skills) : null,
        companyUrl: item.companyUrl ?? null,
        displayOrder: order,
        published: true,
      },
      create: {
        id,
        company: item.company,
        title: item.title,
        location: item.location ?? null,
        startDate: yearMonthToDate(item.start) ?? new Date(),
        endDate: yearMonthToDate(item.end ?? undefined),
        present: Boolean(item.present),
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

async function seedEducation(payload: ArchivePayload) {
  const items = payload.education ?? [];
  let order = 0;
  for (const item of items) {
    const id = typeof item.id === 'string' ? item.id : String(item.id);
    await prisma.education.upsert({
      where: { id },
      update: {
        institution: item.institution,
        degree: item.degree,
        field: item.field ?? null,
        location: item.location ?? null,
        startDate: yearMonthToDate(item.start),
        endDate: yearMonthToDate(item.end ?? undefined),
        present: Boolean(item.present),
        gpa: item.gpa ?? null,
        achievements: item.achievements ? JSON.stringify(item.achievements) : null,
        project: item.project ?? null,
        displayOrder: order,
        published: true,
      },
      create: {
        id,
        institution: item.institution,
        degree: item.degree,
        field: item.field ?? null,
        location: item.location ?? null,
        startDate: yearMonthToDate(item.start) ?? new Date(),
        endDate: yearMonthToDate(item.end ?? undefined),
        present: Boolean(item.present),
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

async function seedServices(payload: ArchivePayload) {
  const items = payload.services ?? [];
  let order = 0;
  for (const service of items) {
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
        id: service.id ?? service.slug,
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

async function seedCertificates(payload: ArchivePayload) {
  const items = payload.certificates ?? [];
  let order = 0;
  for (const certificate of items) {
    const id = String(certificate.id ?? certificate.slug ?? order + 1);
    await prisma.certificate.upsert({
      where: { id },
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
        id,
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

async function seedRecommendations(payload: ArchivePayload) {
  const items = payload.recommendations ?? [];
  let order = 0;
  for (const rec of items) {
    const id = String(rec.id ?? order + 1);
    await prisma.recommendation.upsert({
      where: { id },
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
        id,
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

  const { source, payload } = await loadArchiveOrStatic();
  console.info(`Seed source: ${source}`);

  console.info('Resetting tables...');
  await clearTables();

  console.info('Seeding settings...');
  await seedSettings(payload);

  console.info('Seeding admin user...');
  await seedAdminUser();

  console.info('Seeding skill groups & skills...');
  await seedSkillGroups(payload);

  console.info('Seeding portfolio projects...');
  await seedPortfolio(payload);

  console.info('Seeding experience...');
  await seedExperience(payload);

  console.info('Seeding education...');
  await seedEducation(payload);

  console.info('Seeding services...');
  await seedServices(payload);

  console.info('Seeding certificates...');
  await seedCertificates(payload);

  console.info('Seeding recommendations...');
  await seedRecommendations(payload);

  console.info('Database reset and seed complete.');
}

main()
  .catch((error) => {
    console.error('Failed to reset and seed database:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
