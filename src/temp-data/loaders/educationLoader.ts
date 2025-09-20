import type { Education } from '@/types/database';
import { educationItems } from '../education';

export const education = async (): Promise<Education[]> => {
  const now = new Date();
  return educationItems.map((e, idx) => ({
    id: idx + 1,
    institution: e.institution,
    degree: e.degree,
    field: e.field ?? '',
    duration: e.end ? `${e.start} - ${e.end}` : `${e.start} - Present`,
    location: e.location || '',
    gpa: e.gpa || null,
    description: e.project || '',
    achievements: e.achievements ? [...e.achievements] : [],
    courses: [],
    thesis: null,
    createdAt: now,
    updatedAt: now,
  }));
};
