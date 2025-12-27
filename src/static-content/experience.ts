import type { Experience, ExperienceItem } from '@/types/experience';

// Raw source items (authoring-friendly). These are transformed below into DB-shaped Experience objects.
const rawExperience: readonly ExperienceItem[] = [
  {
    company: 'Example Company',
    title: 'Software Engineer',
    location: 'Remote',
    start: '2024-01',
    present: true,
    bullets: [
      'Built and maintained production features across frontend and backend.',
      'Improved performance and reliability via caching and query optimization.',
      'Collaborated with designers and PMs to ship accessible UI.'
    ],
    stack: ['TypeScript', 'Next.js', 'PostgreSQL', 'Prisma'],
    impact: 'Delivered end-to-end features with measurable performance improvements.',
  },
  {
    company: 'Another Company',
    title: 'Junior Developer',
    location: 'Hybrid',
    start: '2022-06',
    end: '2023-12',
    bullets: [
      'Implemented UI components and API integrations.',
      'Wrote tests and improved developer tooling.'
    ],
    stack: ['React', 'Node.js', 'TypeScript'],
    impact: 'Shipped features and improved code quality through testing and refactors.',
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

