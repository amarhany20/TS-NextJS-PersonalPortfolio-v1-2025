import { PrismaClient } from '@prisma/client';

export async function seedServices(prisma: PrismaClient) {
  console.log('\n[services] Seeding professional services (generated)...');

  const services = [
    {
      title: 'Backend API Architecture & Development',
      description: 'Design and implement scalable REST APIs with clean architecture (DTOs, services, repositories) in Python (Django/Flask/FastAPI) or ASP.NET Core.',
      icon: '⚙️',
      features: ['Layered architecture','JWT/OAuth2 auth','RBAC/ABAC','Observability hooks','Performance optimization','Documentation & onboarding'],
      technologies: ['Django','FastAPI','ASP.NET Core','PostgreSQL','Redis','Docker'],
      pricing: { model: 'project', starting: 3000 },
      displayOrder: 0
    },
    {
      title: 'Full-Stack Product Development',
      description: 'End-to-end delivery of web platforms using Next.js (App Router) + backend (Django/ASP.NET) with CI/CD and infrastructure guidance.',
      icon: '🌐',
      features: ['SSR & SEO optimized','Design system & components','API integration','State management patterns','Testing strategy','Deployment automation'],
      technologies: ['Next.js','TypeScript','Tailwind','Django','ASP.NET Core','Prisma'],
      pricing: { model: 'project', starting: 5000 },
      displayOrder: 1
    },
    {
      title: 'AI / Computer Vision Pipelines',
      description: 'Custom CV model development (YOLOv8, PyTorch) with dataset workflows, training automation, and Jetson edge deployment.',
      icon: '🤖',
      features: ['Dataset curation','Model training & evaluation','Edge optimization','Monitoring hooks','Inference APIs','Documentation & handover'],
      technologies: ['PyTorch','YOLOv8','OpenCV','Jetson','GCP','Flask'],
      pricing: { model: 'project', starting: 6000 },
      displayOrder: 2
    },
    {
      title: 'Cloud & DevOps Enablement',
      description: 'Infrastructure design & automation for small to growth-stage teams with cost-aware containerized deployments.',
      icon: '☁️',
      features: ['Dockerization','CI/CD pipelines','Cloud Run / GCE','Monitoring & logging','Cost optimization','Environment parity'],
      technologies: ['Docker','GitHub Actions','GCP','Kubernetes','Redis','PostgreSQL'],
      pricing: { model: 'retainer', starting: 1500 },
      displayOrder: 3
    },
    {
      title: 'System Architecture & Technical Audits',
      description: 'Architecture reviews, refactor roadmaps, scalability & reliability assessments with actionable recommendations.',
      icon: '📐',
      features: ['Codebase audit','Performance profiling','Security & auth review','Architecture diagrams','Refactor plan','Knowledge transfer'],
      technologies: ['Django','ASP.NET','Next.js','PostgreSQL','Redis','Cloud'],
      pricing: { model: 'audit', starting: 1200 },
      displayOrder: 4
    },
    {
      title: 'WordPress Performance & Architecture',
      description: 'Enterprise-grade WordPress builds and optimization (Elementor/Pods/Custom plugins) with caching and deploy workflows.',
      icon: '🚀',
      features: ['Custom CPTs & relationships','Caching layers','Security hardening','Plugin architecture','SEO foundations','Staging workflows'],
      technologies: ['WordPress','PHP','Elementor','Pods','Redis','Varnish'],
      pricing: { model: 'project', starting: 2000 },
      displayOrder: 5
    },
    {
      title: 'Pricing & Internal Tools Platforms',
      description: 'Rapid development of internal-priced operations tools (pricing, analytics, resource catalogues) with audit trails.',
      icon: '📊',
      features: ['Role-based access','Audit logging','Data modeling','UI scaffolding','Export/reporting','Deployment automation'],
      technologies: ['Next.js','PostgreSQL','Prisma','Django','ASP.NET Core','Tailwind'],
      pricing: { model: 'project', starting: 3500 },
      displayOrder: 6
    },
    {
      title: 'Technical Leadership & Mentorship',
      description: 'Hands-on advisory for early-stage teams: architecture decisions, hiring calibration, code reviews & process design.',
      icon: '🧭',
      features: ['Architecture guidance','Career growth support','Code review cadence','Process improvement','Knowledge sharing','Security posture uplift'],
      technologies: ['Architecture','Clean patterns','CI/CD','Testing','DevEx','Documentation'],
      pricing: { model: 'retainer', starting: 1800 },
      displayOrder: 7
    },
    {
      title: 'Data & Reporting Enablement',
      description: 'Marketing and product analytics frameworks (dashboards, performance pipelines) aligning business decision flows.',
      icon: '📈',
      features: ['Reporting templates','Attribution checks','Data collection review','Visualization setup','Automation scripts','Metric definitions'],
      technologies: ['GA4','BigQuery','Python','APIs','Dashboards','Automation'],
      pricing: { model: 'project', starting: 1300 },
      displayOrder: 8
    },
    {
      title: 'Legacy Modernization Pathfinding',
      description: 'Assess monolithic or outdated systems and design pragmatic staged modernization (APIs, services, infra evolution).',
      icon: '🛠️',
      features: ['Baseline assessment','Risk mapping','Modularization plan','Tech stack recommendations','Migration sequencing','KPIs & tracking'],
      technologies: ['Monoliths','Microservices','APIs','Containers','Observability','Databases'],
      pricing: { model: 'audit', starting: 1600 },
      displayOrder: 9
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
