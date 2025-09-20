import type { Skill } from '@/types/database';
import { skillGroups } from '../skills';

export const allSkills = async () => {
  return skillGroups.reduce((acc, g) => {
    acc[g.id] = {
      title: g.title,
      icon: g.id,
      skills: g.skills.map((s, idx) => ({
        id: idx + 1,
        name: s.name,
        level: 0,
        experience: '',
        categoryId: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      })) as unknown as Skill[]
    };
    return acc;
  }, {} as Record<string, { title: string; icon: string; skills: Skill[] }>);
};

export const coreSkills = async (): Promise<Skill[]> => {
  const desired = new Set<string>([
    'Python (Django, DRF)',
    'C# (ASP.NET Core)',
    'GCP',
    'WordPress',
    'Next.js (App Router)'
  ]);
  const flat: Skill[] = [];
  skillGroups.forEach(g => {
    g.skills.forEach(s => {
      if (!desired.has(s.name)) return;
      flat.push({
        id: flat.length + 1,
        name: s.name,
        level: 0,
        experience: '',
        categoryId: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as unknown as Skill);
    });
  });
  return flat;
};
