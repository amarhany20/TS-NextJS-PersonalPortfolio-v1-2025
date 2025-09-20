import { personalInfo, heroContent, contactInfo } from './personal';
import { experience } from './experienceLoader';
import { education } from './educationLoader';
import { allSkills, coreSkills } from './skillsLoader';
import { certificates } from './certificatesLoader';
import { recommendations } from './recommendationsLoader';
import { services } from './servicesLoader';
import { languages } from './languagesLoader';

export async function loadAllStatic() {
  const [pi, hero, exp, edu, skills, core, certs, recs, svcs, langs] = await Promise.all([
    personalInfo(),
    heroContent(),
    experience(),
    education(),
    allSkills(),
    coreSkills(),
    certificates(),
    recommendations(),
    services(),
    languages(),
  ]);
  return { personalInfo: pi, heroContent: hero, experience: exp, education: edu, skills, coreSkills: core, certificates: certs, recommendations: recs, services: svcs, languages: langs };
}

export { personalInfo, heroContent, contactInfo };
export { experience };
export { education };
export { allSkills, coreSkills };
export { certificates };
export { recommendations };
export { services };
export { languages };