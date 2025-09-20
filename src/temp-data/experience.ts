import type { ExperienceItem } from '@/types/experience';

export const experience: readonly ExperienceItem[] = [
  {
    company: 'The Home Co EG',
    title: 'IT Manager & Full-Stack Developer',
    location: 'Remote from Egypt',
    start: '2025-04',
    present: true,
    bullets: [
      'Led digital transformation: Google Workspace rollout, SOPs, domains, and email.',
      'Built an internal Pricing System (Next.js + PostgreSQL/Prisma) with RBAC and audits, ' +
        'cutting quotation turnaround by ~40%.',
      'Defined e-commerce strategy and built a Next.js frontend integrated with Shopify API.',
      'Provisioned DO VPS, set up CI/CD with dev/staging/prod, automated tests and controlled releases.',
      'Curated Google Drive template library for Finance, HR, Projects, Design, Admin, Marketing, IT.',
    ],
    stack: [
      'Next.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'Docker',
      'GitHub Actions', 'Linux', 'Shopify Storefront API',
    ],
    impact:
      'Faster quoting cycles, unified tooling, and a scalable headless commerce foundation.',
  },
  {
    company: 'Kiwify Tech Company',
    title: 'Co-Founder / CTO',
    location: 'Mersin, Turkey',
    start: '2024-06',
    present: true,
    bullets: [
      'Delivered 10+ client projects across ASP.NET Core, WordPress, and Flutter.',
      'Built custom ASP.NET Core + PostgreSQL APIs and Flutter apps with JWT and RBAC.',
      'Owned hosting, DNS, mail, and CI/CD for multi-tenant environments.',
      'Enforced coding standards and delivery timelines across a small engineering team.',
    ],
    stack: ['ASP.NET Core', 'PostgreSQL', 'Flutter', 'WordPress', 'Docker', 'CI/CD'],
    impact: 'Repeatable delivery patterns and stable ops for SME clients.',
  },
  {
    company: 'Domogreen',
    title: 'Backend & Application Engineer',
    location: 'Lund, Sweden',
    start: '2024-07',
    end: '2025-04',
    bullets: [
      'Built Django REST API (PostgreSQL, Redis) with WebSocket streaming for research workloads.',
      'Implemented JWT (via Firebase Auth), modular micro-app architecture, repository/service layers.',
      'Developed a cross-platform .NET MAUI client for collaboration and chatbot features.',
      'Containerized and deployed to GCP; improved latency and reduced cost per interaction.',
    ],
    stack: [
      'Django REST', 'PostgreSQL', 'Redis', 'WebSockets', '.NET MAUI',
      'Docker', 'GCP', 'Firebase Auth',
    ],
    impact: '~75% of platform shipped before project discontinuation.',
  },
  {
    company: 'Animals.ai',
    title: 'Computer Vision & Backend Engineer',
    location: 'Helsingborg, Sweden',
    start: '2023-08',
    end: '2024-04',
    bullets: [
      'Delivered 30+ CV models and 50+ image pipelines for precision agriculture.',
      'Designed and deployed Flask REST backend on GCP with Firebase; containerized CI/CD.',
      'Built NVIDIA Jetson IoT camera network (RTSP; 12+ cameras) with edge inference.',
      'Mentored interns; collaborated with PhDs and farmers; managed large annotation workflows.',
      'Reduced detection error rates by ~20% via model/ops improvements.',
    ],
    stack: [
      'PyTorch', 'TensorFlow/Keras', 'YOLOv8', 'OpenCV', 'Flask',
      'GCP', 'Firebase', 'Jetson', 'RTSP',
    ],
    impact:
      'Turned research into production pipelines; earned formal CTO recommendation.',
  },
  {
    company: 'Toros University',
    title: 'IT Intern',
    location: 'Mersin, Turkey',
    start: '2022-07',
    end: '2023-07',
    bullets: [
      'Campus-wide IT support (Windows/Office/network/VoIP/printers).',
      'Refurbished ~50% of lab PCs; assisted server/user admin; router/switch config.',
    ],
    stack: ['Windows', 'Linux', 'Office 365', 'Networking'],
    impact: 'Improved lab reliability and reduced support backlog.',
  },
] as const;
