import type { Experience } from '@/types/database';
import type { ExperienceItem } from '@/types/experience';

// Raw source items (authoring-friendly). These are transformed below into DB-shaped Experience objects.
const rawExperience: readonly ExperienceItem[] = [
  {
    company: 'The Home Co EG',
    title: 'IT Manager & Full-Stack Developer',
    location: 'Cairo, Egypt (Remote)',
    start: '2025-04',
    present: true,
    bullets: [
      'Led the company’s digital transformation: rolled out Google Workspace across all departments, standardized ERP/CRM processes, and formalized IT governance.',
      'Designed and deployed an enterprise Pricing & Quotation System (Next.js + PostgreSQL/Prisma) with RBAC, audit trails, and presets—cutting quotation turnaround time by ~40% and ensuring accuracy.',
      'Defined the company’s e-commerce roadmap and implemented a Next.js storefront integrated with Shopify Storefront API for scalable headless commerce.',
      'Provisioned and managed DigitalOcean VPS infrastructure; implemented Docker-based deployments and CI/CD pipelines with dev/staging/prod environments.',
      'Created and curated a Google Drive template library for Finance, HR, Projects, Design, Admin, Marketing, IT, and Workshop operations, standardizing documentation across teams.',
      'Acted as de facto CTO: advised executives on IT strategy, infrastructure investment, and digital growth opportunities.'
    ],
    stack: [
      'TypeScript', 'React', 'Next.js', 'PostgreSQL', 'Prisma',
      'Shopify Storefront API', 'Docker', 'GitHub Actions', 'DigitalOcean',
      'Google Workspace', 'Linux'
    ],
    impact:
      'Modernized IT and digital operations, enabling scalable quoting, streamlined collaboration, and a high-performance e-commerce foundation.',
  },
  {
    company: 'Kiwify Tech Company',
    title: 'Co-Founder / CTO',
    location: 'Mersin, Turkey',
    start: '2024-06',
    present: true,
    bullets: [
      'Co-founded a consultancy delivering 10+ client projects across ASP.NET Core, WordPress, and Flutter in e-commerce, logistics, and services.',
      'Engineered custom ASP.NET Core APIs backed by PostgreSQL, enforcing DTO/Repository/Service patterns and JWT-based authentication.',
      'Built and published Flutter mobile applications with role-based flows and localized UIs.',
      'Managed hosting, DNS, domain registrations, server administration, and business email infrastructure for SMEs.',
      'Set up CI/CD pipelines, containerized deployments, and implemented repeatable delivery patterns.',
      'Directed a small engineering team, establishing coding standards, documentation practices, and delivery timelines.'
    ],
    stack: [
      'C#', 'ASP.NET Core', 'Entity Framework', 'PostgreSQL',
      'Flutter (Dart)', 'WordPress', 'Docker', 'CI/CD', 'Nginx', 'Linux'
    ],
    impact:
      'Provided SMEs with stable, maintainable software systems while building repeatable delivery frameworks that improved client satisfaction.',
  },
  {
    company: 'Domogreen',
    title: 'Backend & Application Engineer',
    location: 'Lund, Sweden',
    start: '2024-07',
    end: '2025-04',
    bullets: [
      'Developed a secure Django REST API (PostgreSQL + Redis) with WebSocket streaming for large-scale physics research collaboration.',
      'Implemented JWT authentication via Firebase Auth, modular micro-app architecture, and repository/service layer separation.',
      'Built a cross-platform .NET MAUI client for collaboration and chatbot features, integrating seamlessly with backend APIs.',
      'Containerized services with Docker and deployed to Google Cloud Platform, reducing latency and improving cost per interaction.',
      'Collaborated with researchers and engineers to translate experimental needs into scalable software systems.'
    ],
    stack: [
      'Python', 'Django', 'Django REST Framework', 'PostgreSQL', 'Redis',
      'WebSockets', '.NET MAUI', 'Docker', 'Google Cloud Platform', 'Firebase Auth'
    ],
    impact:
      'Delivered ~75% of the research platform before discontinuation, demonstrating ability to own full-stack and cloud deployments in high-stakes R&D projects.',
  },
  {
    company: 'Animals.ai',
    title: 'Computer Vision & Backend Engineer',
    location: 'Helsingborg, Sweden',
    start: '2023-08',
    end: '2024-04',
    bullets: [
      'Advanced from CV Intern to full-time engineer; cleared a backlog of delayed projects ahead of schedule.',
      'Delivered 30+ computer vision models and 50+ image-processing pipelines for livestock monitoring and precision agriculture.',
      'Designed and deployed a Flask REST backend on Google Cloud Platform with Firebase, containerized for CI/CD pipelines (reduced delivery time from weeks to minutes).',
      'Built NVIDIA Jetson IoT camera systems (RTSP streaming, multi-camera inference) and managed 10k+ annotated images.',
      'Reduced detection error rates by ~20% through model optimization and pipeline improvements.',
      'Mentored interns, collaborated with PhD researchers and farmers, and participated in board-level meetings with CEO and CTO.'
    ],
    stack: [
      'Python', 'PyTorch', 'TensorFlow', 'YOLOv8', 'OpenCV',
      'Flask', 'GCP', 'Firebase', 'Docker', 'NVIDIA Jetson', 'RTSP'
    ],
    impact:
      'Turned research into production-grade pipelines and edge-to-cloud systems, earning a formal CTO recommendation letter.',
  },
  {
    company: 'Toros University',
    title: 'IT Intern',
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
export const experience: Experience[] = rawExperience.map((r, idx) => {
  const duration = r.present ? `${r.start} - Present` : r.end ? `${r.start} - ${r.end}` : r.start;
  return {
    id: idx + 1,
    company: r.company,
    position: r.title,
    duration,
    location: r.location,
    type: r.present ? 'Current' : 'Past',
    description: r.impact || r.bullets[0] || '',
    achievements: r.bullets.slice(0, 5),
    skills: r.stack ? [...r.stack] : [],
    companyUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Experience;
});

