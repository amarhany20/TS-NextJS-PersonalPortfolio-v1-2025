import type { Service } from '@/types/service';

export const services: Service[] = [
  {
    id: 'svc-web-apps',
    title: 'Web Apps',
    slug: 'web-apps',
    description: 'Modern, accessible web applications with SSR-first delivery.',
    longDescription: 'A template service entry you can replace with your real offering. Keep descriptions concise and action-oriented.',
    features: ['SSR/SSG pages', 'Accessible UI', 'Typed APIs'],
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    icon: 'Globe',
    active: true,
  },
  {
    id: 'svc-apis',
    title: 'APIs',
    slug: 'apis',
    description: 'REST endpoints with validation and consistent responses.',
    longDescription: 'Example service entry. Replace it with your own specialties and proof points.',
    features: ['Zod validation', 'Service/repository layering', 'Structured errors'],
    technologies: ['Node.js', 'TypeScript', 'Prisma'],
    icon: 'ServerCog',
    active: true,
  },
  {
    id: 'svc-admin',
    title: 'Admin Dashboards',
    slug: 'admin-dashboards',
    description: 'Internal tools and dashboards with role-based access.',
    longDescription: 'Example service entry you can adapt for your own portfolio.',
    features: ['CRUD admin panels', 'Role-based access', 'Search and reporting'],
    technologies: ['React', 'TypeScript'],
    icon: 'Workflow',
    active: true,
  },
];
