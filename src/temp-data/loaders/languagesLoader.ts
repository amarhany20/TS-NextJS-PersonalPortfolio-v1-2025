import type { Language } from '@/types/database';

export const languages = async (): Promise<Language[]> => [
  { id: 1, name: 'English', level: 'C2 / Fluent', proficiency: 95, description: 'Professional working proficiency', certificate: null, flag: '🇬🇧', createdAt: new Date(), updatedAt: new Date() },
  { id: 2, name: 'Turkish', level: 'B2 / Upper-Intermediate', proficiency: 75, description: 'Professional communication and collaboration', certificate: null, flag: '🇹🇷', createdAt: new Date(), updatedAt: new Date() },
  { id: 3, name: 'Arabic', level: 'Native', proficiency: 100, description: 'Native language', certificate: null, flag: '🇪🇬', createdAt: new Date(), updatedAt: new Date() },
];
