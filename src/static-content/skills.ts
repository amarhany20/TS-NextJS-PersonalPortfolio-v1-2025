import type { SkillGroupDisplay } from '@/types';

// New simplified skill data; no levels/recency. Clean text-only display.
export const skillGroups: readonly SkillGroupDisplay[] = [
  {
    id: 'backend',
    title: 'Backend',
    summary: 'APIs and service development.',
    skills: [
      { name: 'Node.js' },
      { name: 'TypeScript' },
      { name: 'REST APIs' },
    ],
  },
  {
    id: 'frontend',
    title: 'Frontend',
    summary: 'UI engineering and design systems.',
    skills: [
      { name: 'Next.js' },
      { name: 'React' },
      { name: 'Tailwind CSS' },
    ],
  },
  {
    id: 'databases',
    title: 'Databases',
    summary: 'Relational databases and data modeling.',
    skills: [
      { name: 'PostgreSQL' },
      { name: 'SQLite' },
    ],
  },
  {
    id: 'cloud-devops',
    title: 'Cloud & DevOps',
    summary: 'Deployment and automation.',
    skills: [
      { name: 'Docker' },
      { name: 'GitHub Actions' },
    ],
  },
  {
    id: 'soft-skills',
    title: 'Soft Skills',
    summary: 'Collaboration and ownership.',
    skills: [{ name: 'Communication' }, { name: 'Problem Solving' }, { name: 'Mentorship' }],
  },
];


// Flattened categories similar to previous loader output
import type { SkillItem } from '@/types/skill';

export const allSkills: Record<string, { title: string; icon: string; skills: SkillItem[] }> = skillGroups.reduce((acc, g) => {
  acc[g.id] = {
    title: g.title,
    icon: g.id,
    skills: g.skills.map((s) => ({ name: s.name }))
  };
  return acc;
}, {} as Record<string, { title: string; icon: string; skills: SkillItem[] }>);

export const coreSkills: SkillItem[] = [
  { name: 'Next.js' },
  { name: 'PostgreSQL' },
  { name: 'TypeScript' },
  { name: 'Docker' },
];

