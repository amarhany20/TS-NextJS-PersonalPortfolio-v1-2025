import type { Project } from '@/types/portfolio';

// Import project JSON (add new files here)
import personal from './personal-portfolio-open-source.json';
import formoreco from './formoreco-company-website.json';
import homecoPricing from './the-home-co-pricing-system.json';
import homecoHeadless from './the-home-co-headless-ecommerce.json';
import personaX from './persona-x-saas.json';
import eggersmann from './eggersmann-uae-website.json';
import kingfisher from './kingfisher-logistics-tracking.json';
import alSerif from './al-serif-company-website.json';
import haniWaMari from './hani-wa-mari-orders-tracking.json';
import sezonco from './sezonco-hosting-maintenance.json';
import connect4 from './connect4-game.json';
import oldPersonal from './old-personal-website.json';
import farmApi from './farm-api.json';
import estrusScoring from './estrus-id-scoring-api.json';
import estrusJetson from './estrus-jetson-pipeline.json';
import iotGate from './iot-gate-pipeline.json';
import dataChecker from './data-checker-pipeline.json';
import cvTraining from './cv-training-suite.json';
import aiAnalysis from './ai-analysis-application.json';
import liveObject from './live-object-counter.json';
import realEstate from './real-estate-website.json';
import istone from './istone-company-software.json';
import inventory from './inventory-system.json';
import robustCrawler from './robust-web-crawler.json';
import windowsNotes from './windows-notes-app.json';
import schoolLibrary from './school-library-system.json';
import schoolManagement from './school-management-system.json';
import cashierSystem from './cashier-system.json';
import notesTasksAndroid from './notes-tasks-android.json';
import forumsApp from './forums-web-application.json';
import teknofestCv from './teknofest-2023-cv.json';
import engineeringFirm from './engineering-firm-website.json';
import selfDriving from './self-driving-behavioral-cloning.json';
import domogreen from './domogreen-research-platform.json';
import aceitunaoil from './aceitunaoil-website.json';
import goldenhillsfood from './goldenhillsfood-website.json';
import aanahtar from './aanahtar-ecommerce.json';
import a4keys from './a4keys-wholesale.json';

// Treat imported JSON as unknown then coerce into Project with controlled extraction
const raw: unknown[] = [
  personal,
  formoreco,
  homecoPricing,
  homecoHeadless,
  personaX,
  eggersmann,
  kingfisher,
  alSerif,
  haniWaMari,
  sezonco,
  connect4,
  oldPersonal,
  farmApi,
  estrusScoring,
  estrusJetson,
  iotGate,
  dataChecker,
  cvTraining,
  aiAnalysis,
  liveObject,
  realEstate,
  istone,
  inventory,
  robustCrawler,
  windowsNotes,
  schoolLibrary,
  schoolManagement,
  cashierSystem,
  notesTasksAndroid,
  forumsApp,
  teknofestCv,
  engineeringFirm,
  selfDriving,
  domogreen,
  aceitunaoil,
  goldenhillsfood,
  aanahtar,
  a4keys,
];

function dateKey(p: { start: string; end?: string | null }) {
  return (p.end || p.start) + '-01';
}

// Trust createdAt/updatedAt if supplied in JSON, else fill now
const now = new Date().toISOString();

export const portfolio: Project[] = raw
  .map((r) => {
    // Narrow unknown JSON into a plain record
    const o = r as Record<string, unknown>;
    return {
      slug: String(o.slug),
      title: String(o.title),
      tagline: String(o.tagline),
      intro: String(o.intro),
      summary: String(o.summary),
      featured: Boolean(o.featured),
      // Cast string unions from external JSON (trusted static data)
      visibility: o.visibility as Project['visibility'],
      access: o.access as Project['access'],
      status: o.status as Project['status'],
      domain: o.domain ?? undefined,
      company: o.company ?? undefined,
      client: o.client ?? undefined,
      website: o.website ?? undefined,
      repository: (o.repository === null || typeof o.repository === 'string') ? o.repository : null,
      role: String(o.role),
      start: String(o.start),
      end: o.end ?? undefined,
      stack: Array.isArray(o.stack) ? o.stack : [],
      features: Array.isArray(o.features) ? o.features : [],
      sections: Array.isArray(o.sections) ? o.sections : [],
      gallery: Array.isArray(o.gallery) ? o.gallery : [],
      confidentialNotes: typeof o.confidentialNotes === 'string' ? o.confidentialNotes : undefined,
      createdAt: typeof o.createdAt === 'string' ? o.createdAt : now,
      updatedAt: typeof o.updatedAt === 'string' ? o.updatedAt : now,
    } as Project;
  })
  .sort((a, b) => dateKey(b).localeCompare(dateKey(a)));

export const featuredProjects = portfolio.filter(p => p.featured);
export const nonFeaturedProjects = portfolio.filter(p => !p.featured);

export function findProject(slug: string) {
  return portfolio.find(p => p.slug === slug) || null;
}
