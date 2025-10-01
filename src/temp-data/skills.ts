import type { SkillGroupDisplay } from '@/types';

// New simplified skill data; no levels/recency. Clean text-only display.
export const skillGroups: readonly SkillGroupDisplay[] = [
  {
    id: 'backend',
    title: 'Backend',
    summary: 'APIs, services, systems design, and performance.',
    skills: [
      { name: 'Python (Django, DRF, Flask, FastAPI)' },
      { name: 'C# (ASP.NET Core, EF Core)' },
      { name: 'Go (Gin)' },
      { name: 'Node.js (Express)' },
      { name: 'Shopify Storefront/Admin API' },
    ],
  },
  {
    id: 'frontend',
    title: 'Frontend',
    summary: 'Modern SPAs, SSR/ISR, design systems, CMS, and desktop UI.',
    skills: [
      { name: 'Next.js (App Router)' },
      { name: 'React' },
      { name: 'Tailwind CSS' },
      { name: 'WordPress (Elementor, Pods)' },
      { name: 'C# WPF (XAML)' },
      { name: 'Flutter' },
      { name: 'Shopify Frontend (Storefront/Admin API)' },
    ],
  },
  {
    id: 'databases',
    title: 'Databases',
    summary: 'Relational, document, and cache design & optimization.',
    skills: [
      { name: 'PostgreSQL' },
      { name: 'MySQL' },
      { name: 'MSSQL' },
      { name: 'SQLite' },
      { name: 'Firebase Firestore' },
      { name: 'Neon (Postgres)' },
      { name: 'Redis (Cache)' },
    ],
  },
  {
    id: 'cloud-devops',
    title: 'Cloud & DevOps',
    summary: 'Deployment, automation, observability, and infra efficiency.',
    skills: [
      { name: 'Google Cloud (Compute Engine, Cloud Run, Pub/Sub)' },
      { name: 'AWS (EC2, S3, Lambda)' },
      { name: 'Microsoft Azure (App Service, Functions)' },
      { name: 'Firebase' },
      { name: 'DigitalOcean / VPS' },
      { name: 'Docker' },
      { name: 'Kubernetes' },
      { name: 'GitHub Actions' },
      { name: 'Linux (Ubuntu/Debian), SSH' },
      { name: 'Nginx / Caddy / OpenLiteSpeed' },
      { name: 'Cloudways, cPanel/WHM, CyberPanel' },
    ],
  },
  {
    id: 'ai-cv',
    title: 'AI & Computer Vision',
    summary: 'Training, deployment, and edge inference for real-world systems.',
    skills: [
      { name: 'PyTorch' },
      { name: 'TensorFlow / Keras' },
      { name: 'OpenCV' },
      { name: 'YOLO (Ultralytics v8)' },
      { name: 'scikit-learn' },
      { name: 'NVIDIA Jetson (Edge/Cloud deployments)' },
    ],
  },
  {
    id: 'languages',
    title: 'Languages',
    summary: 'Working languages for collaboration and delivery.',
    skills: [
      { name: 'English (C2)' },
      { name: 'Arabic (Native)' },
      { name: 'Turkish (B2)' },
      { name: 'Swedish (A1)' },
    ],
  },
  {
    id: 'soft-skills',
    title: 'Soft Skills',
    summary: 'Leadership, collaboration, problem solving, and adaptability.',
    skills: [
      { name: 'Systems Thinking' },
      { name: 'Problem Solving' },
      { name: 'Attention to Detail' },
      { name: 'Mentorship' },
      { name: 'Team Leadership' },
      { name: 'Cross-Cultural Teamwork' },
      { name: 'Agile / Scrum' },
      { name: 'Technical Writing & Documentation' },
      { name: 'Client Communication' },
      { name: 'Rapid Prototyping' },
      { name: 'Fast Typing (77 WPM)' },
    ],
  },
];


// Flattened categories similar to previous loader output
import type { SkillItem } from '@/types/skill';

export const allSkills: Record<string, { title: string; icon: string; skills: SkillItem[] }> = skillGroups.reduce((acc, g) => {
  acc[g.id] = {
    title: g.title,
    icon: g.id,
    skills: g.skills.map((s) => ({ name: s.name }))
  };
  return acc;
}, {} as Record<string, { title: string; icon: string; skills: SkillItem[] }>);

export const coreSkills: SkillItem[] = (() => {
  // Limit core skills to exactly these five (order matters)
  const desiredOrder = [
    'Python (Django, DRF, Flask)',
    'ASP.NET Core',
    'Next.js (App Router)',
    'WordPress (Elementor, Pods)',
    'PostgreSQL'
  ] as const;
  const desired = new Set<string>(desiredOrder);
  const flat: SkillItem[] = [];
  skillGroups.forEach(g => {
    g.skills.forEach(s => {
      if (!desired.has(s.name)) return;
      flat.push({ name: s.name });
    });
  });
  return flat.sort((a, b) => desiredOrder.indexOf(a.name as typeof desiredOrder[number]) - desiredOrder.indexOf(b.name as typeof desiredOrder[number]));
})();

