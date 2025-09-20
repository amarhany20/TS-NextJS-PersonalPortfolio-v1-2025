import type { Experience } from '@/types/database';
import { experience as roles } from '../experience';

export const experience = async (): Promise<Experience[]> => {
  return roles.map((r, idx) => {
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
};
