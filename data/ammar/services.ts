import type { Service } from '@/types/service';

export const services: Service[] = [
  {
    id: 'svc-backend-apis',
    title: 'Backend APIs & System Architecture',
    slug: 'backend-apis-and-system-architecture',
    description: 'Design and ship clean, scalable REST/WebSocket backends with rock-solid auth, observability, and documentation.',
    longDescription: 'I architect and implement production-grade backends using clean architecture (controllers → services → repositories), DTO contracts, and strict typing. You get secure JWT/OAuth2 auth, RBAC/ABAC, database migrations, caching strategy, rate limiting, and a real CI/CD pipeline. Everything ships with OpenAPI docs, load testing, and environment-isolated configs.',
    features: [
      'API design (REST/WebSockets) with OpenAPI 3',
      'AuthN/AuthZ (JWT/OAuth2, RBAC/ABAC)',
      'PostgreSQL schema + migrations, indexing strategy',
      'Caching & performance (Redis, connection pooling)',
      'Observability (structured logs, metrics, health checks)',
      'CI/CD (GitHub Actions) and env promotion (dev→staging→prod)'
    ],
    technologies: [
      'Python','Django','DRF','Flask',
      'C#/.NET','ASP.NET Core','Go (Gin)',
      'PostgreSQL','Redis','Docker','GitHub Actions'
    ],
    icon: 'ServerCog',
    active: true
  },
  {
    id: 'svc-headless-commerce',
    title: 'Headless Commerce (Next.js + Shopify)',
    slug: 'headless-commerce-nextjs-shopify',
    description: 'Premium storefronts powered by Shopify APIs with a fast, SEO-first Next.js frontend.',
    longDescription: 'I deliver a headless commerce stack that pairs a modern, accessible Next.js frontend with Shopify Storefront/Admin APIs. Expect collection pages, product detail, search, cart, and Shopify checkout, plus multilingual SEO, schema.org data, image optimization, and a content model you can maintain. Clean, performant, and built to scale.',
    features: [
      'Next.js storefront (App Router) with hydration & SSR/ISR',
      'Shopify Storefront/Admin API integration (GraphQL)',
      'Multilingual SEO (OG/Twitter cards, sitemaps, JSON-LD)',
      'Optimized media pipeline (images, fonts, LCP/CLS tuning)',
      'Analytics hooks & pixel hygiene (GA4/Meta)',
      'Production deploy (Vercel or VPS + Docker) with CI/CD'
    ],
    technologies: [
      'Next.js','TypeScript','Tailwind CSS',
      'Shopify Storefront API','GraphQL',
      'Vercel','Docker','Nginx/Caddy'
    ],
    icon: 'ShoppingBag',
    active: true
  },
  {
    id: 'svc-pricing-system',
    title: 'Custom Pricing & Quotation System',
    slug: 'custom-pricing-and-quotation-system',
    description: 'Role-based pricing engine with presets, cost rules, audit logs, and bilingual PDF quotes.',
    longDescription: 'A production-ready pricing system modeled after my furniture/manufacturing deployments. Includes deterministic calculation rules (cost, margin, discount), presets/resources, audit trails, soft delete, export/import, and secure multi-role access. Generates branded bilingual PDFs and supports data backups and restores.',
    features: [
      'RBAC roles & audit trails for all actions',
      'Deterministic pricing engine (rules & precedence)',
      'Presets/resources for materials, finishes, labor',
      'Bilingual PDF generation (brand-ready templates)',
      'PostgreSQL migrations, backups & restore runbooks',
      'Admin UI, activity feeds, and CSV/Excel export'
    ],
    technologies: [
      'Next.js','TypeScript','PostgreSQL','Prisma',
      'Node','Docker','GitHub Actions'
    ],
    icon: 'Calculator',
    active: true
  },
  {
    id: 'svc-ai-cv-edge-cloud',
    title: 'AI & Computer Vision — Edge-to-Cloud',
    slug: 'ai-computer-vision-edge-to-cloud',
    description: 'Deploy YOLO-based CV pipelines from Jetson edge devices to cloud training/serving with monitoring.',
    longDescription: 'I build end-to-end CV systems: dataset curation, training (PyTorch/Ultralytics), evaluation, and inference on NVIDIA Jetson or cloud. Pipelines include RTSP ingestion, GPU inference, Pub/Sub streaming, and metrics. You get reproducible experiments, model versioning, and deployment playbooks with safety, logging, and cost controls.',
    features: [
      'Dataset pipelines (labeling QA, splits, augmentation)',
      'Model training & evaluation (mAP, PR curves, bias checks)',
      'Edge inference (Jetson) + cloud endpoints',
      'RTSP ingestion, message queues, and batch jobs',
      'Experiment tracking & model registry',
      'Monitoring, alerting, and rollback strategy'
    ],
    technologies: [
      'PyTorch','Ultralytics YOLOv8','OpenCV',
      'NVIDIA Jetson','Python','GCP (Compute/Run/Storage)',
      'Docker'
    ],
    icon: 'Camera',
    active: true
  },
  {
    id: 'svc-wordpress-enterprise',
    title: 'Enterprise WordPress (Elementor/Pods)',
    slug: 'enterprise-wordpress-elementor-pods',
    description: 'High-performance, multilingual WordPress with custom content models, security hardening, and SEO.',
    longDescription: 'For brands that need WordPress without the mess: custom CPTs with Pods/ACF, multilingual support, cache strategy, security hardening, and CI-based deployments. I optimize TTFB, images, and Core Web Vitals, and set up structured content so your team can work fast without breaking the site.',
    features: [
      'Custom CPTs (Pods/ACF) with relations & admin UX',
      'Performance pass (caching, images, CWV improvements)',
      'Multilingual setup & SEO schema',
      'Security hardening, backups, and WAF guidance',
      'Staging environment & safe deploy workflow',
      'Editor training & content runbook'
    ],
    technologies: [
      'WordPress','PHP','Elementor','Pods/ACF',
      'MySQL','Nginx/OpenLiteSpeed','Cloudflare/CDN'
    ],
    icon: 'Globe',
    active: true
  },
  {
    id: 'svc-devops-cost-ops',
    title: 'DevOps, CI/CD & Cost Optimization',
    slug: 'devops-ci-cd-and-cost-optimization',
    description: 'Harden your delivery pipeline and cut cloud spend without sacrificing reliability.',
    longDescription: 'I audit and implement CI/CD (GitHub Actions), containerization, environment isolation, and observability. Then I optimize infra (right-sizing, caching layers, DB indexes, storage classes), add disaster-recovery procedures, and create a pragmatic SRE checklist. The goal: fewer incidents, faster deploys, lower bill.',
    features: [
      'Pipeline setup (build/test/lint/preview/release)',
      'Dockerization & environment parity (dev/stage/prod)',
      'Infra & DB cost audit (indexes, pooling, backups)',
      'Observability (logs/metrics/alerts) and SLOs',
      'Security review (secrets, perms, dependency checks)',
      'Runbooks for DR, rollbacks, and hotfixes'
    ],
    technologies: [
      'GitHub Actions','Docker','Linux',
      'Nginx/Caddy','PostgreSQL','Redis',
      'GCP','DigitalOcean','Cloudflare'
    ],
    icon: 'Workflow',
    active: true
  }
  ,
  {
    id: 'svc-fullstack-website',
    title: 'Full-Stack Website (Company / Portfolio)',
    slug: 'fullstack-website-company-portfolio',
    description: 'Modern, SEO-friendly company or portfolio websites with SSR/SSG, fast load times, and accessible UI.',
    longDescription: 'I build fast, maintainable full-stack websites—portfolio pages, company showcases, and brochure sites—using Next.js (App Router), Tailwind CSS, and server-side APIs where needed. Includes SEO, image optimization, and CMS integration when required.',
    features: [
      'SEO-first site structure',
      'Responsive design and accessibility',
      'CMS integration (headless or WordPress)',
      'Image optimization and LCP tuning',
      'Contact forms and lead capture'
    ],
    technologies: ['Next.js','TypeScript','Tailwind CSS','Vercel','Headless CMS'],
    icon: 'Globe',
    active: true
  },
  {
    id: 'svc-saas-mvp',
    title: 'SaaS MVP / Product Launch',
    slug: 'saas-mvp-product-launch',
    description: 'Build an MVP product with auth, billing, and an admin panel so you can test product-market fit quickly.',
    longDescription: 'From auth to payments and analytics, I craft a launch-ready MVP using robust frameworks and simple deployment patterns to validate your idea quickly and reliably.',
    features: [
      'Auth, user accounts, and roles',
      'Payment integration (Stripe)',
      'Analytics, logs, and monitoring',
      'Scalable deployment and CI/CD'
    ],
    technologies: ['Next.js','TypeScript','PostgreSQL','Prisma','Stripe'],
    icon: 'ShoppingBag',
    active: true
  },
  {
    id: 'svc-admin-dashboard',
    title: 'Admin Dashboards & Internal Tools',
    slug: 'admin-dashboards-internal-tools',
    description: 'Custom dashboards for ops, reporting, and internal tools with role-based access and data visualizations.',
    longDescription: 'I design admin interfaces that make complex data usable — charts, exports, RBAC, and integrations. Delivery includes authentication, audit logs, and performant queries.',
    features: [
      'Data visualizations and charts',
      'Role-based access control',
      'Export and reporting tools',
      'Optimized database queries'
    ],
    technologies: ['React','TypeScript','PostgreSQL','Chart.js','Redis'],
    icon: 'ServerCog',
    active: true
  },
  {
    id: 'svc-desktop-apps',
    title: 'Desktop Applications (Electron / Tauri)',
    slug: 'desktop-applications-electron-tauri',
    description: 'Cross-platform desktop applications using Electron or Tauri for richer UX and native integrations.',
    longDescription: 'I deliver desktop applications with native integrations (filesystem, cameras, devices) using Electron or Tauri combined with modern web stacks for UI.',
    features: [
      'Cross-platform packaging (Windows/macOS/Linux)',
      'Native device integration (USB, camera, filesystem)',
      'Auto-update and installer support',
      'Secure local storage and sync options'
    ],
    technologies: ['Electron','Tauri','React','TypeScript','Node'],
    icon: 'Workflow',
    active: true
  }
];
