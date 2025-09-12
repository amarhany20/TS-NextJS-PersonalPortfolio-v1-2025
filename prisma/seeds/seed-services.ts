import { PrismaClient } from '@prisma/client';

export async function seedServices(prisma: PrismaClient) {
  console.log('\n[services] Seeding professional services (generated)...');

  const services = [
    // 1) Custom WordPress Websites
    {
      title: 'Custom WordPress Websites',
      description: 'Design and develop fast, secure, and multilingual WordPress websites with Elementor, Pods, and custom PHP.',
      icon: '🧩',
      features: [
        'Custom plugins',
        'WooCommerce stores',
        'Multilingual content',
        'Caching & optimization',
        'Training for editors'
      ],
      technologies: ['WordPress','PHP','Elementor Pro','Pods','MySQL'],
      pricing: { model: 'project', starting: 2000 },
      displayOrder: 0
    },
    // 2) Next.js Frontend Development
    {
      title: 'Next.js Frontend Development',
      description: 'Modern, SEO-friendly web frontends using Next.js with clean, responsive UI/UX.',
      icon: '🌐',
      features: [
        'TailwindCSS styling',
        'SSR/ISR',
        'Accessibility compliance',
        'API integration',
        'Pixel-perfect Figma matches'
      ],
      technologies: ['Next.js','React','TailwindCSS','TypeScript'],
      pricing: { model: 'project', starting: 2500 },
      displayOrder: 1
    },
    // 3) Backend API Development
    {
      title: 'Backend API Development',
      description: 'Robust and scalable REST/WebSocket APIs with secure authentication and clean architecture.',
      icon: '⚙️',
      features: [
        'JWT/OAuth2',
        'RBAC',
        'DTO patterns',
        'Migrations',
        'Containerized deployments'
      ],
      technologies: ['Django REST Framework','ASP.NET Core','Flask','FastAPI','PostgreSQL'],
      pricing: { model: 'project', starting: 3000 },
      displayOrder: 2
    },
    // 4) E-Commerce Solutions
    {
      title: 'E-Commerce Solutions',
      description: 'Complete e-commerce builds and optimizations for both SMEs and high-end brands.',
      icon: '🛒',
      features: [
        'WooCommerce customizations',
        'Next.js + Django commerce stacks',
        'Multilingual/multi-currency',
        'Payment integrations',
        'Checkout optimization'
      ],
      technologies: ['WooCommerce','Next.js','Django','PostgreSQL'],
      pricing: { model: 'project', starting: 4000 },
      displayOrder: 3
    },
    // 5) Performance Optimization
    {
      title: 'Performance Optimization',
      description: 'Audit and optimize websites and systems for speed, SEO, and scalability.',
      icon: '🚀',
      features: [
        'Lighthouse improvements',
        'Caching (Redis, Varnish, Object Cache Pro)',
        'Database tuning',
        'CDN setup',
        'Code refactoring'
      ],
      technologies: ['WordPress','Next.js','Redis','Nginx/Apache'],
      pricing: { model: 'audit', starting: 1200 },
      displayOrder: 4
    },
    // 6) AI & Computer Vision Solutions
    {
      title: 'AI & Computer Vision Solutions',
      description: 'End-to-end AI systems for object detection, image analysis, and automation.',
      icon: '🤖',
      features: [
        'YOLOv8 model training',
        'Data pipelines',
        'Jetson deployment',
        'REST API integration',
        'Dataset preparation'
      ],
      technologies: ['PyTorch','YOLOv8','TensorFlow','OpenCV','Jetson'],
      pricing: { model: 'project', starting: 6000 },
      displayOrder: 5
    },
    // 7) Mobile App Development (Flutter)
    {
      title: 'Mobile App Development (Flutter)',
      description: 'Cross-platform mobile applications with backend integration and localization.',
      icon: '📱',
      features: [
        'Multilingual support',
        'Dynamic screen generation',
        'Offline-first workflows',
        'Secure API integration'
      ],
      technologies: ['Flutter','Dart','ASP.NET Core','Django'],
      pricing: { model: 'project', starting: 3500 },
      displayOrder: 6
    },
    // 8) Desktop & ERP Systems
    {
      title: 'Desktop & ERP Systems',
      description: 'Custom role-based Windows software for ERP, POS, or inventory management.',
      icon: '🖥️',
      features: [
        'User roles',
        'Reporting dashboards',
        'Secure login',
        'Database-driven workflows',
        'Local or server deployment'
      ],
      technologies: ['C#','.NET WPF','MSSQL','SQLite'],
      pricing: { model: 'project', starting: 3000 },
      displayOrder: 7
    },
    // 9) Cloud & DevOps Services
    {
      title: 'Cloud & DevOps Services',
      description: 'Deployment, scaling, and cost-optimized management of cloud infrastructure.',
      icon: '☁️',
      features: [
        'Docker/Kubernetes setups',
        'GitHub Actions CI/CD',
        'GCP/DigitalOcean deployments',
        'Monitoring & backups'
      ],
      technologies: ['GCP','Firebase','DigitalOcean','Docker','Kubernetes','GitHub Actions'],
      pricing: { model: 'retainer', starting: 1500 },
      displayOrder: 8
    },
    // 10) IT & Digital Transformation
    {
      title: 'IT & Digital Transformation',
      description: 'Helping companies modernize tools and workflows.',
      icon: '🏢',
      features: [
        'Google Workspace setup',
        'CRM/ERP integrations',
        'SOP & template libraries',
        'Process automation',
        'Staff upskilling'
      ],
      technologies: ['Google Workspace','Microsoft 365','CRMs','ERP platforms'],
      pricing: { model: 'retainer', starting: 1200 },
      displayOrder: 9
    },
    // 11) Tracking & Analytics Integration
    {
      title: 'Tracking & Analytics Integration',
      description: 'Set up and maintain accurate marketing and conversion tracking.',
      icon: '📈',
      features: [
        'Meta Pixel + CAPI',
        'TikTok Events API',
        'GA4 setup',
        'Server-side GTM',
        'Reporting dashboards'
      ],
      technologies: ['Google Tag Manager','GA4','Meta CAPI','TikTok API'],
      pricing: { model: 'project', starting: 1000 },
      displayOrder: 10
    },
    // 12) Marketing Reporting Automation
    {
      title: 'Marketing Reporting Automation',
      description: 'Automated performance dashboards and structured reporting frameworks.',
      icon: '📊',
      features: [
        'MoM comparisons',
        'Campaign efficiency metrics',
        'PDF/Sheets exports',
        'Cross-platform reporting'
      ],
      technologies: ['Google Sheets','Power BI','Python','Meta Ads API','TikTok Ads API'],
      pricing: { model: 'project', starting: 1200 },
      displayOrder: 11
    }
  ];

  for (const svc of services) {
    const existing = await prisma.service.findFirst({ where: { title: svc.title } });
    if (existing) continue; // idempotent insert
    await prisma.service.create({
      data: {
        title: svc.title,
        description: svc.description,
        icon: svc.icon,
        features: JSON.stringify(svc.features),
        technologies: JSON.stringify(svc.technologies),
        pricing: JSON.stringify(svc.pricing),
        displayOrder: svc.displayOrder,
        isActive: true
      }
    });
  }
  console.log('[services] Done.');
}
