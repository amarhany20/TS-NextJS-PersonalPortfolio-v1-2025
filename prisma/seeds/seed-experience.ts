import { PrismaClient } from '@prisma/client';

export async function seedExperience(prisma: PrismaClient) {
  console.log('\n[experience] Seeding experience, recommendations, certificates, CV info...');

  const experiences = [
    { company: 'The Home Co EG', position: 'IT Manager & Full-Stack Developer', duration: 'Apr 2025 - Present', location: 'Remote (Egypt)', type: 'Full-time', description: 'Digital transformation (Workspace, CRM/ERP, custom systems). E-commerce & pricing platforms design.', achievements: ['Digital transformation leadership','Next.js + Django commerce build (in progress)','Pricing system architecture with Neon/Postgres/Prisma','Technical advisory to CEO'], skills: ['Next.js','Django','Prisma','Systems Design','Process Automation'], companyUrl: 'https://thehomeco.eg', displayOrder: 0 },
    { company: 'Kiwify Tech Company', position: 'Co-founder & CTO', duration: 'Jun 2024 - Present', location: 'Mersin, Turkey', type: 'Co-founder', description: 'Technical leadership delivering 10+ client projects (WP, ASP.NET, Flutter). Managed hosting/CI/CD.', achievements: ['10+ client deliveries','Custom ASP.NET Core APIs','Flutter mobile deployments','Hosting & DNS operations'], skills: ['ASP.NET Core','Flutter','PostgreSQL','DevOps','Architecture'], companyUrl: 'https://kiwifytech.com', displayOrder: 1 },
    { company: 'Domogreen', position: 'Backend & Application Engineer', duration: 'Jul 2024 - Apr 2025', location: 'Lund, Sweden', type: 'Full-time', description: 'Django REST + WebSockets evolution from Flask baseline. Modular micro-app design.', achievements: ['Django REST API build','WebSocket real-time streaming','Micro app modularization','JWT via Firebase Auth'], skills: ['Django','Redis','PostgreSQL','WebSockets','Architecture'], companyUrl: 'https://domogreen.com', displayOrder: 2 },
    { company: 'Animals.ai', position: 'Computer Vision & Backend Engineer', duration: 'Aug 2023 - Apr 2024', location: 'Helsingborg, Sweden', type: 'Full-time', description: '30+ CV models; 50+ image processing pipelines; Jetson AI camera network; GCP automation.', achievements: ['30+ CV models','50+ processing pipelines','Jetson camera system (12+)','Intern mentorship & dataset ops'], skills: ['PyTorch','YOLOv8','OpenCV','Flask','GCP'], companyUrl: 'https://animals.ai', displayOrder: 3 },
    { company: 'Toros University', position: 'IT Intern', duration: 'Mar 2023 - Jul 2023 & Jul 2022 - Sep 2022', location: 'Mersin, Turkey', type: 'Internship', description: 'Campus-wide IT support; infra & network tasks; user administration.', achievements: ['50% lab PC refurbishment','Network config assistance','User/account administration'], skills: ['Networking','Windows Server','Support','Security'], companyUrl: null, displayOrder: 4 },
    { company: 'Freelance', position: 'Full-Stack Web Developer', duration: 'Sep 2021 - Sep 2022', location: 'Mersin, Turkey', type: 'Freelance', description: 'Custom websites + SEO & analytics with agencies under deadlines.', achievements: ['Multi-stack delivery','SEO optimization','Responsive design rollouts'], skills: ['WordPress','Laravel','SEO','JavaScript','PHP'], companyUrl: null, displayOrder: 5 }
  ];

  for (const exp of experiences) {
    const existing = await prisma.experience.findFirst({ where: { company: exp.company, position: exp.position } });
    if (existing) continue;
    await prisma.experience.create({ data: { ...exp, achievements: JSON.stringify(exp.achievements), skills: JSON.stringify(exp.skills), isActive: true } });
  }

  const certificates = [
    { name: 'Go – The Complete Guide', issuer: 'Udemy', date: 'Mar 2025', credential: 'UDEMY-GO-2025', description: 'Full Go language stack & concurrency.', skills: ['Go','Concurrency'], image: null, verifyUrl: null, displayOrder: 0 },
    { name: 'Python Bootcamp', issuer: 'Udemy', date: 'May 2024', credential: 'UDEMY-PYTHON-2024', description: 'Comprehensive Python programming course.', skills: ['Python','Software Engineering'], image: null, verifyUrl: null, displayOrder: 1 },
    { name: 'AI Engineer Internship', issuer: 'Animals AI', date: 'Aug 2023 - Oct 2023', credential: 'ANIMALS-AI-2023', description: 'Internship certificate covering AI pipelines & CV systems.', skills: ['CV','AI','Python','YOLO'], image: null, verifyUrl: null, displayOrder: 2 },
    { name: 'Teknofest Finalist', issuer: 'Teknofest 2023', date: 'May 2023', credential: 'TEKNOFEST-2023', description: 'Autonomous Harvesting Robot finalist (Top 25 nationally).', skills: ['Robotics','Computer Vision','Teamwork'], image: null, verifyUrl: null, displayOrder: 3 }
  ];
  for (const cert of certificates) {
    const exists = await prisma.certificate.findFirst({ where: { name: cert.name, issuer: cert.issuer } });
    if (exists) continue;
    await prisma.certificate.create({ data: { ...cert, skills: JSON.stringify(cert.skills), isActive: true } });
  }

  const recommendations = [
    { name: 'Yuan Xiong', position: 'CTO', company: 'Animals.ai', relationship: 'Direct Manager', content: 'Praised leadership in backend & CV pipeline delivery; reliability & mentorship.', rating: 5, date: '2024-04-01', linkedin: 'https://www.linkedin.com/in/yuan-xiong-cto', photo: '/2024 Ammar Personal Photo.jpg', displayOrder: 0 },
  ];
  for (const rec of recommendations) {
    const exists = await prisma.recommendation.findFirst({ where: { name: rec.name, company: rec.company } });
    if (exists) continue;
    await prisma.recommendation.create({ data: { ...rec, isActive: true } });
  }

  // CV Info (single record upsert by version+title or fallback id search)
  const cvTitle = 'Ammar Hany - Professional CV';
  const existingCv = await prisma.cVInfo.findFirst({ where: { title: cvTitle } });
  if (!existingCv) {
    await prisma.cVInfo.create({ data: { title: cvTitle, subtitle: 'Senior-track Software Engineer & AI/CV Specialist', description: 'Comprehensive CV including backend, full stack, AI & cloud capabilities.', downloadUrl: '/files/cv/Ammar_Hany_CV_Egypt_2025_v1.45.pdf', viewUrl: '/cv-preview', fileSize: '2.2 MB', lastUpdated: 'Sep 2025', version: '2025.1.45', downloadCount: 0 } });
  }

  console.log('[experience] Done.');
}
