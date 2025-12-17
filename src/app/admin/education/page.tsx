import type { Metadata } from 'next';

import { EducationManager } from '@/components/Admin/Education/EducationManager';
import { EducationService } from '@/server/services/EducationService';

export const metadata: Metadata = {
  title: 'Education | Admin',
};

export default async function AdminEducationPage() {
  const education = await EducationService.getAllEducation();

  return <EducationManager initialEducation={education} />;
}
