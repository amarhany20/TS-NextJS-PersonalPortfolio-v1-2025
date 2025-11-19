// Ordered composition of home page sections
import { ExperienceService } from '@/server/services/ExperienceService';
import { EducationService } from '@/server/services/EducationService';
import { SettingsService } from '@/server/services/SettingsService';
import { CertificateService } from '@/server/services/CertificateService';
import { RecommendationService } from '@/server/services/RecommendationService';
import { SkillService } from '@/server/services/SkillService';
import SummarySection from './SummarySection';
import ExperienceSection from './ExperienceSection';
import EducationSection from './EducationSection';
import CertificatesSection from './CertificatesSection';
import RecommendationsSection from './RecommendationsSection';
import SkillsSection from './SkillsSection';
import ContactSection from './ContactSection';

export async function HomeSections() {
  const [experience, education, certificates, recommendations, skills, content] = await Promise.all([
    ExperienceService.getPublishedExperience(),
    EducationService.getPublishedEducation(),
    CertificateService.getCertificates(),
    RecommendationService.getRecommendations(),
    SkillService.getSkillGroups(),
    SettingsService.getSiteContent(),
  ]);

  const mergedSocialLinks = [...content.socialLinks, ...content.contact.socialLinks].filter(
    (link, index, array) => array.findIndex(item => item.href === link.href) === index,
  );

  return (
    <div className="flex flex-col gap-12">
      <SummarySection hero={content.hero} />
      <ExperienceSection items={experience} />
      <EducationSection items={education} />
      <CertificatesSection items={certificates} />
      <RecommendationsSection items={recommendations} />
      <SkillsSection groups={skills} />
      <ContactSection details={content.contact} socialLinks={mergedSocialLinks} />
    </div>
  );
}

export default HomeSections;
