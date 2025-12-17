import type { Metadata } from 'next';

import { ExperienceManager } from '@/components/Admin/Experience/ExperienceManager';
import { ExperienceService } from '@/server/services/ExperienceService';

export const metadata: Metadata = {
  title: 'Experience | Admin',
};

export default async function AdminExperiencePage() {
  const experience = await ExperienceService.getAllExperience();

  return <ExperienceManager initialExperience={experience} />;
}
