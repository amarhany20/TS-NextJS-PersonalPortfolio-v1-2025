import type { Language } from '@/types/database';

export const languages = async (): Promise<Language[]> => [
  { id: 1, name: 'English', level: 'Fluent', proficiency: 95, description: 'Professional', certificate: null, flag: '🇬🇧', createdAt: new Date(), updatedAt: new Date() },
];
