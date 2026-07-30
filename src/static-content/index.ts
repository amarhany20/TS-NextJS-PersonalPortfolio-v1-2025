// Unified static data exports (replacing former loaders directory)
import { metadata } from './metadata';
import { personalInfo, heroContent, contactInfo } from './personal';
import { experience } from './experience';
import { education } from './education';
import { allSkills, coreSkills, skillGroups } from './skills';
import { certificates } from './certificates';
import { recommendations } from './recommendations';
import { services } from './services';
export * from './portfolio';
export * from './routes';
export * from './seo';

export {
  metadata,
  personalInfo,
  heroContent,
  contactInfo,
  experience,
  education,
  allSkills,
  coreSkills,
  skillGroups,
  certificates,
  recommendations,
  services,
};

// Languages now come from metadata.languages (no separate language objects needed)

// Aggregate (sync) object similar to previous loadAllStatic result
export const allStaticData = {
  personalInfo,
  heroContent,
  contactInfo,
  experience,
  education,
  skills: allSkills,
  coreSkills,
  certificates,
  recommendations,
  services,
  languages: metadata.languages,
};

// Async compatibility wrapper (if any legacy code expected a Promise)
export const getAllStatic = async () => allStaticData;
