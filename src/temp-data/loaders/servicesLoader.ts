import type { Service } from '@/types/database';

export const services = async (): Promise<Service[]> => [
  { id: 1, title: 'Web Application Development', description: 'Modern responsive apps.', icon: 'code', features: ['Responsive UI', 'API Integration'], technologies: ['Next.js', 'Tailwind'], pricing: { price: 'Custom', duration: 'project' }, createdAt: new Date(), updatedAt: new Date() },
];
