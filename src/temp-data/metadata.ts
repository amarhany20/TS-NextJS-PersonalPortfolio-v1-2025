import type { Metadata } from '@/types/metadata';

export const metadata: Metadata = {
  fullName: 'Ammar Hany Ezeldin Abdelrazik',
  // Friendlier, concise professional tagline derived from CV summary
  tagline: 'Dynamic Software Engineer (approaching senior) — backend, full‑stack & system architecture',
  emails: ['ammarhanyezeldin@gmail.com'],
  phones: [
    { label: 'Egypt', e164: '+201061888476' },
    { label: 'Turkey', e164: '+905395775990' },
    { label: 'Sweden', e164: '+46739793588' },
  ],
  links: [
    { label: 'Website', href: 'https://ammarhany.com' },
    { label: 'Portfolio', href: 'https://ammarhany.com/portfolio' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ammarhany' },
    { label: 'GitHub', href: 'https://github.com/amarhany20' },
    { label: 'YouTube', href: 'https://www.youtube.com/@TheChillTechgineer' },
  ],
  bases: [
    { city: 'Mersin', countryCode: 'TR' },
    { city: 'Cairo', countryCode: 'EG' },
  ],
  relocation: 'Married to a Swedish citizen • frequent long stays in Sweden • eligible to work in Egypt & Turkey • open to global remote/hybrid/onsite roles.',
  languages: [
    'English (C2)',
    'Arabic (Native)',
    'Turkish (B2)',
    'Swedish (A1)',
    'French (A1)',
  ],
  // Condensed, CV-aligned bullet points used in hero summary list
  highlights: [
    '4 years full‑stack & backend engineering (approaching senior level)',
    'Architected scalable APIs & cloud infrastructure (GCP, Docker, Kubernetes)',
    'Python (Django, DRF), C# (ASP.NET Core), JavaScript/TypeScript (Next.js, Express)',
    'Deployed AI / computer vision models & optimized cloud workloads',
    'Databases: PostgreSQL · MySQL · Firebase/Firestore · Redis',
    'CI/CD & DevOps: GitHub Actions · Containers · Infrastructure optimization',
    'Cross‑platform delivery including WordPress & headless commerce',
  ],
} as const;
