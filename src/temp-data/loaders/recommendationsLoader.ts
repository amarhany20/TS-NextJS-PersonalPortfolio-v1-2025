import type { Recommendation } from '@/types/database';

export const recommendations = async (): Promise<Recommendation[]> => [
  {
    id: 1,
    name: 'Yuan Xiong',
    position: 'CTO',
    company: 'Animals.ai',
    relationship: 'Direct technical leadership & mentorship',
    content: 'Ammar consistently delivered production-ready computer vision services and backend integrations ahead of schedule, proactively improving reliability and performance with minimal guidance.',
    rating: 5,
    date: '2024-08-01',
    linkedin: 'https://www.linkedin.com/in/yuan-xiong/',
    photo: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
