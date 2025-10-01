import type { Experience, ExperienceItem } from '@/types/experience';

// Raw source items (authoring-friendly). These are transformed below into DB-shaped Experience objects.
const rawExperience: readonly ExperienceItem[] = [
  {
    company: 'The Home Co EG',
    title: 'Digital Solutions Architect',
    location: 'Cairo, Egypt (Remote)',
    start: '2025-04',
    present: true,
    bullets: [
      'Owned end-to-end IT and systems: rolled out Google Workspace, standardized device provisioning, and managed Squarespace domains/DNS for all teams.',
      'Architected the Pricing & Costing System (Next.js + Neon/PostgreSQL + Prisma) with RBAC, audit logs, resource presets, and Excel/PDF exports—improving quote speed/accuracy by 40%+.',
      'Built headless commerce with Shopify Storefront/Admin APIs on a Next.js frontend, pairing SEO-first delivery with scalable merchandising workflows.',
      'Ran infrastructure on DigitalOcean VMs (Linux/KDE) with CI/CD via GitHub Actions, multi-environment governance, and supplemental AWS (EC2/S3) integrations.',
      'Automated daily market-price web crawling and compiled Excel/PowerPoint intelligence for Egypt and GCC leadership decisions.',
      'Acted as de facto CTO, aligning executives on IT strategy, cost optimization, and digital transformation roadmaps.'
    ],
    stack: [
      'TypeScript', 'Next.js', 'Neon (PostgreSQL)', 'Prisma', 'Shopify Storefront API', 'Shopify Admin API',
      'GitHub Actions', 'DigitalOcean', 'AWS (EC2/S3)', 'Linux (KDE)', 'Google Workspace', 'Web Crawling'
    ],
    impact:
      'Modernized IT and digital operations with auditable pricing, scalable headless commerce, and cost-efficient hybrid cloud infrastructure.',
  },
  {
    company: 'Kiwify Tech Company',
    title: 'Part-time Technical Lead',
    location: 'Mersin, Turkey',
    start: '2024-06',
    present: true,
    bullets: [
      'Part-time engagement (5–10 hrs/week) leading cross-stack delivery for SMEs in F&B, logistics, and services.',
      'Built Flutter Android ordering apps backed by ASP.NET Core APIs and PostgreSQL, deployed on DigitalOcean VPS (Linux).',
      'Handled manual release management: Linux server hardening, migrations, monitoring, and incident response.',
      'Managed hosting portfolios across cPanel/WHM, CyberPanel, and GoDaddy DNS/email with custom automation scripts.',
      'Delivered WordPress/Elementor sites with bespoke PHP snippets, analytics integrations, and speed optimisation.',
      'Codified delivery playbooks, code reviews, and documentation to keep distributed contractors aligned.'
    ],
    stack: [
      'Flutter (Android)', 'ASP.NET Core', 'PostgreSQL', 'DigitalOcean VPS', 'Linux',
      'cPanel/WHM', 'CyberPanel', 'GoDaddy DNS & Email', 'WordPress', 'Elementor', 'PHP'
    ],
    impact:
      'Delivered reliable, cost-conscious digital platforms for SMEs while maintaining high-touch operations in a lean, part-time model.',
  },
  {
    company: 'Domogreen',
    title: 'Product Engineer',
    location: 'Lund, Sweden',
    start: '2024-07',
    end: '2025-04',
    bullets: [
      'Acted as product engineer reporting to the CEO, translating research needs into product requirements and delivery roadmaps.',
      'Delivered a secure Flutter desktop app (Windows/macOS) paired with a Django REST backend and collaboration tooling.',
      'Implemented JWT auth, encryption, and hardening across repositories/service-layer architecture with Redis and WebSockets.',
      'Deployed a hybrid stack: on-prem Linux servers for data handling with GCP services hosting public APIs and monitoring.',
      'Led backlog, stakeholder demos, and documentation to keep R&D teams aligned despite project deprecation.'
    ],
    stack: [
      'Flutter (Desktop)', 'Django REST Framework', 'Python', 'PostgreSQL', 'Redis',
      'WebSockets', 'JWT', 'Google Cloud Platform', 'On-prem Linux', 'Docker'
    ],
    impact:
      'Shipped secure hybrid deployments and product direction under tight timelines, with architecture reused in successor initiatives.',
  },
  {
    company: 'Animals.ai',
    title: 'Product Engineer',
    location: 'Helsingborg, Sweden',
    start: '2023-08',
    end: '2024-04',
    bullets: [
      'Progressed from intern to product engineer, coordinating edge-to-cloud CV roadmaps with leadership and field teams.',
      'Ran a distributed NVIDIA Jetson camera network with multi-site RTSP ingestion and resilient offline-first syncing.',
      'Delivered Flask + Firebase + GCP backends with GitHub Actions CI/CD and dataset management for 10k+ annotated images.',
      'Optimized YOLO/Deep learning pipelines, cutting livestock detection error rates by ~20%.',
      'Established QA/playbooks, mentored interns, and surfaced product insights for board reviews.'
    ],
    stack: [
      'Python', 'Flask', 'Firebase', 'Google Cloud Platform', 'GitHub Actions',
      'NVIDIA Jetson (Edge)', 'RTSP', 'PyTorch', 'YOLO (Ultralytics v8)', 'Docker'
    ],
    impact:
      'Delivered production edge-to-cloud CV systems that earned a formal CTO recommendation and measurable accuracy gains.',
  },
  {
    company: 'Toros University',
    title: 'IT Infrastructure Intern',
    location: 'Mersin, Turkey',
    start: '2022-07',
    end: '2023-07',
    bullets: [
      'Provided IT support across campus, including Windows, Office 365, networks, VoIP, and printers.',
      'Refurbished ~50% of computer lab PCs, extending hardware lifecycles and reducing costs.',
      'Assisted with server administration, user account management, and router/switch configuration.',
      'Supported faculty and students with technical troubleshooting, improving uptime and efficiency.'
    ],
    stack: ['Windows', 'Linux', 'Microsoft 365', 'Networking', 'Server Administration'],
    impact:
      'Improved lab reliability and reduced IT support backlog, strengthening campus infrastructure.',
  },
] as const;

// Transformed UI/DB ready data (mirrors former loader output)
export const experience: Experience[] = rawExperience.map((r, idx) => ({
  id: idx + 1,
  company: r.company,
  title: r.title,
  location: r.location,
  start: r.start,
  end: r.end,
  present: !!r.present,
  impact: r.impact || r.bullets[0] || '',
  achievements: r.bullets.slice(0, 5),
  skills: r.stack ? [...r.stack] : [],
  companyUrl: null,
  createdAt: new Date(),
  updatedAt: new Date(),
}));

