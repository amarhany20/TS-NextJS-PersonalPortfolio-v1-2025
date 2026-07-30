import type { Credential } from '@/types';

export const credentials: readonly Credential[] = [
  // Certificates (newest first)
  {
    title: 'Udemy: Go: The Complete Guide',
    year: 2025,
    type: 'certificate',
    description: 'Full-stack Go development, concurrency, and production services patterns.',
    tags: ['Go'],
  },
  {
    title: 'Udemy: Python Bootcamp',
    year: 2024,
    type: 'certificate',
    description: 'Modern Python, backend frameworks, and automation for production workloads.',
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
    description:
      'Certifies production computer vision delivery, edge deployments, and backend ownership.',
    tags: ['CV', 'Backend'],
  },
  {
    title: 'Udemy: Self-Driving Car (Applied Deep Learning)',
    year: 2023,
    type: 'certificate',
    description:
      'Applied DL specialization with behavioral cloning pipelines and deployment workflows.',
    tags: ['Deep Learning', 'CNN'],
  },
  {
    title: 'Teknofest 2023 Participation – Autonomous Harvesting Robot (Top 25)',
    year: 2023,
    type: 'award',
    description:
      'Autonomous Harvesting Robot ranked top 25 nationally and presented to 2.5M+ attendees.',
    tags: ['Competition', 'Computer Vision'],
  },
  {
    title: 'Animals.ai Recommendation Letter',
    issuer: 'Animals.ai',
    year: 2023,
    type: 'certificate',
    description: 'Letter confirming backend, DevOps, and product leadership impact at Animals.ai.',
    tags: ['Recommendation'],
  },
] as const;
