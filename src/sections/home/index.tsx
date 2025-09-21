// Ordered composition of home page sections
import SummarySection from './SummarySection';
import ExperienceSection from './ExperienceSection';
import EducationSection from './EducationSection';
import CertificatesSection from './CertificatesSection';
import RecommendationsSection from './RecommendationsSection';
import SkillsSection from './SkillsSection';
import ContactSection from './ContactSection';

export function HomeSections() {
  return (
    <div className="flex flex-col gap-12">
      <SummarySection />
      <ExperienceSection />
      <EducationSection />
      <CertificatesSection />
      <RecommendationsSection />
      <SkillsSection />
      <ContactSection />
    </div>
  );
}

export default HomeSections;
