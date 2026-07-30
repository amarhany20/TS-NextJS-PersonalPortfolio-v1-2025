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
  const content = await SettingsService.getSiteContent();
  const { sections } = content.visibility;

  const [experience, education, certificates, recommendations, skills] = await Promise.all([
    sections.experience ? ExperienceService.getPublishedExperience() : Promise.resolve([]),
    sections.education ? EducationService.getPublishedEducation() : Promise.resolve([]),
    sections.certificates ? CertificateService.getCertificates() : Promise.resolve([]),
    sections.recommendations ? RecommendationService.getRecommendations() : Promise.resolve([]),
    sections.skills ? SkillService.getSkillGroups() : Promise.resolve([]),
  ]);

  const mergedSocialLinks = [...content.socialLinks, ...content.contact.socialLinks].filter(
    (link, index, array) => array.findIndex((item) => item.href === link.href) === index,
  );

  return (
    <div className="flex flex-col gap-12">
      {sections.summary ? <SummarySection hero={content.hero} /> : null}
      {sections.experience ? <ExperienceSection items={experience} /> : null}
      {sections.education ? <EducationSection items={education} /> : null}
      {sections.certificates ? <CertificatesSection items={certificates} /> : null}
      {sections.recommendations ? <RecommendationsSection items={recommendations} /> : null}
      {sections.skills ? <SkillsSection groups={skills} /> : null}
      {sections.contact ? (
        <ContactSection details={content.contact} socialLinks={mergedSocialLinks} />
      ) : null}
    </div>
  );
}

export default HomeSections;
