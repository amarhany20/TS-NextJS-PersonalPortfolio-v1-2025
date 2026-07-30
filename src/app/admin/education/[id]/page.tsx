import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';

import { EducationForm } from '@/components/Admin/Education/EducationForm';
import { EducationService } from '@/server/services/EducationService';

interface AdminEducationEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

const loadEducation = cache((id: string) => EducationService.getEducationById(id));

export async function generateMetadata({ params }: AdminEducationEditPageProps): Promise<Metadata> {
  const { id } = await params;
  const education = await loadEducation(id);
  return {
    title: education ? `Edit ${education.institution} | Admin Education` : 'Education not found',
  };
}

export default async function AdminEducationEditPage({ params }: AdminEducationEditPageProps) {
  const { id } = await params;
  const education = await loadEducation(id);

  if (!education) {
    notFound();
  }

  return <EducationForm mode="edit" education={education} />;
}
