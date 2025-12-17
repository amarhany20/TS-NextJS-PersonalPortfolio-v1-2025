import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';

import { ExperienceForm } from '@/components/Admin/Experience/ExperienceForm';
import { ExperienceService } from '@/server/services/ExperienceService';

interface AdminExperienceEditPageProps {
  params: {
    id: string;
  };
}

const loadExperience = cache((id: string) => ExperienceService.getExperienceById(id));

export async function generateMetadata({ params }: AdminExperienceEditPageProps): Promise<Metadata> {
  const experience = await loadExperience(params.id);
  return {
    title: experience ? `Edit ${experience.company} | Admin Experience` : 'Experience not found',
  };
}

export default async function AdminExperienceEditPage({ params }: AdminExperienceEditPageProps) {
  const experience = await loadExperience(params.id);

  if (!experience) {
    notFound();
  }

  return <ExperienceForm mode="edit" experience={experience} />;
}
