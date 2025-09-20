import type { Credential } from '@/types';

export const credentials: readonly Credential[] = [
  // Certificates (newest first)
  {
    title: 'Udemy: Go: The Complete Guide',
    year: 2025,
    type: 'certificate',
    description: 'Full-stack Go development and concurrency patterns.',
    tags: ['Go'],
  },
  {
    title: 'Udemy: Python Bootcamp',
    year: 2024,
    type: 'certificate',
    description: 'Comprehensive bootcamp covering modern Python and frameworks.',
    tags: ['Python'],
  },
  {
    title: 'Typing Certification',
    year: 2024,
    type: 'certificate',
    description: 'Verified 77 WPM typing speed with accuracy.',
    tags: ['Productivity'],
  },
  {
    title: 'Animals.ai Internship Certificate',
    issuer: 'Animals.ai',
    year: 2023,
    type: 'certificate',
    description: 'Confirming contribution to computer vision projects and backend support.',
    tags: ['CV', 'Backend'],
  },
  {
    title: 'Udemy: Self-Driving Car (Applied Deep Learning)',
    year: 2023,
    type: 'certificate',
    description: 'Completed applied DL specialization, focused on CNN-based behavioral cloning.',
    tags: ['Deep Learning', 'CNN'],
  },
  {
    title: 'Teknofest 2023 Participation – Autonomous Harvesting Robot (Top 25)',
    year: 2023,
    type: 'award',
    description: 'Autonomous Harvesting Robot project ranked in the top 25 nationally (showcased to 2.5M attendees).',
    tags: ['Competition', 'Computer Vision'],
  },
] as const;
