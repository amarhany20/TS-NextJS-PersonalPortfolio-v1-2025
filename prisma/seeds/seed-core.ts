import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

export async function seedCore(prisma: PrismaClient) {
  console.log('\n[core] Seeding core user, metadata, education, languages, skills...');

  // Admin user (ensure idempotent by email)
  const adminEmail = 'ammarhanyezeldin@gmail.com';
  const passwordHash = await bcrypt.hash('Ammar_12341234', 12);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      firstName: 'Ammar',
      lastName: 'Hany',
      passwordHash,
      emailVerified: true,
      isActive: true,
    }
  });

  // Metadata (subset: identity + hero + contact) - idempotent via key uniqueness
  const metaItems: Array<{key:string,value:string,type:string,category:string,description?:string,isRequired?:boolean}> = [
    { key: 'fullName', value: 'Ammar Hany', type: 'string', category: 'personal', description: 'Display full name', isRequired: true },
    { key: 'title', value: 'Senior-track Software Engineer | Backend & Full-Stack | AI/CV', type: 'string', category: 'personal', description: 'Tagline' },
    { key: 'email', value: adminEmail, type: 'string', category: 'contact', description: 'Primary email', isRequired: true },
    { key: 'phonePrimary', value: '+20 106 188 8476', type: 'string', category: 'contact' },
    { key: 'phoneTurkey', value: '+90 539 577 5990', type: 'string', category: 'contact' },
    { key: 'phoneSweden', value: '+46 73 979 3588', type: 'string', category: 'contact' },
    { key: 'location', value: 'New Cairo (EG) • Mersin (TR) • Sweden (traveling)', type: 'string', category: 'contact' },
    { key: 'heroGreeting', value: "Hi, I'm Ammar Hany", type: 'string', category: 'hero' },
    { key: 'heroSubtitle', value: 'Backend • Full Stack • AI/Computer Vision', type: 'string', category: 'hero' },
    { key: 'heroDescription', value: '4+ years building scalable backend, full-stack & AI systems across Python, .NET, JS, Go — delivering cloud, web, mobile & IoT solutions.', type: 'string', category: 'hero' }
  ];
  for (const m of metaItems) {
    await prisma.metadata.upsert({
      where: { key: m.key },
      update: { value: m.value, type: m.type, category: m.category, description: m.description, isRequired: !!m.isRequired },
      create: { key: m.key, value: m.value, type: m.type, category: m.category, description: m.description, isRequired: !!m.isRequired }
    });
  }

  // Education (single)
  await prisma.education.upsert({
    where: { id: 1 },
    update: {},
    create: {
      institution: 'Toros University',
      degree: 'Bachelor of Science',
      field: 'Computer & Software Engineering',
      duration: 'Sep 2019 - Jul 2023',
      location: 'Mersin, Turkey',
      gpa: '3.77/4.00',
      description: 'Valedictorian; administrative board member of Computer Sciences Community.',
      achievements: JSON.stringify(['Valedictorian GPA 3.77/4.00','Board Member Computer Sciences Community','Honours every semester']),
      courses: JSON.stringify(['Data Structures','Software Engineering','Database Systems','Networks & Security','AI & ML','System Architecture']),
      thesis: 'Autonomous Harvesting Robot (Computer Vision)',
      displayOrder: 0,
      isActive: true
    }
  });

  // Languages (upsert by unique composite simulated via name + proficiency pattern => using find + upsert logic)
  const languages = [
    { name: 'English', level: 'C2 – Full professional', proficiency: 95, description: 'Fluent technical & business communication', flag: '🇬🇧', displayOrder: 0 },
    { name: 'Arabic', level: 'Native – Mother tongue', proficiency: 100, description: 'Native fluency', flag: '🇪🇬', displayOrder: 1 },
    { name: 'Turkish', level: 'B2 – Upper intermediate', proficiency: 80, description: 'Strong conversational/business', flag: '🇹🇷', displayOrder: 2 }
  ];
  for (const [i, lang] of languages.entries()) {
    const existing = await prisma.language.findFirst({ where: { name: lang.name } });
    if (existing) {
      await prisma.language.update({ where: { id: existing.id }, data: lang });
    } else {
      await prisma.language.create({ data: lang });
    }
  }

  // Minimal skill categories (example subset)
  const skillCategories = [
    { name: 'backend', title: 'Backend & APIs', icon: '⚙️', skills: [
      { name: 'Django', level: 88, experience: '2+ yrs', isCoreSkill: true },
      { name: 'Flask', level: 90, experience: '3+ yrs', isCoreSkill: true },
      { name: 'ASP.NET Core', level: 90, experience: '3+ yrs', isCoreSkill: true },
      { name: 'FastAPI', level: 85, experience: '2+ yrs', isCoreSkill: false }
    ]},
    { name: 'ai_cv', title: 'AI & Computer Vision', icon: '🤖', skills: [
      { name: 'PyTorch', level: 88, experience: '2+ yrs', isCoreSkill: true },
      { name: 'YOLOv8', level: 92, experience: '2+ yrs', isCoreSkill: true },
      { name: 'OpenCV', level: 90, experience: '3+ yrs', isCoreSkill: true }
    ]},
    { name: 'frontend', title: 'Frontend & Web', icon: '🎨', skills: [
      { name: 'Next.js', level: 88, experience: '2+ yrs', isCoreSkill: true },
      { name: 'React', level: 85, experience: '2+ yrs', isCoreSkill: true },
      { name: 'Tailwind', level: 90, experience: '3+ yrs', isCoreSkill: false }
    ]}
  ];

  for (let i = 0; i < skillCategories.length; i++) {
    const cat = skillCategories[i];
    let category = await prisma.skillCategory.findFirst({ where: { name: cat.name } });
    if (!category) {
      category = await prisma.skillCategory.create({ data: { name: cat.name, title: cat.title, icon: cat.icon, displayOrder: i, isActive: true } });
    }
    for (let s = 0; s < cat.skills.length; s++) {
      const skill = cat.skills[s];
      const existingSkill = await prisma.skill.findFirst({ where: { name: skill.name, categoryId: category.id } });
      if (existingSkill) {
        await prisma.skill.update({ where: { id: existingSkill.id }, data: { ...skill, displayOrder: s, categoryId: category.id, isActive: true } });
      } else {
        await prisma.skill.create({ data: { ...skill, displayOrder: s, categoryId: category.id, isActive: true } });
      }
    }
  }

  console.log('[core] Done.');
}
