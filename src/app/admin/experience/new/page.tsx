import type { Metadata } from 'next';

import { ExperienceForm } from '@/components/Admin/Experience/ExperienceForm';

export const metadata: Metadata = {
  title: 'New Experience | Admin',
};

export default function AdminExperienceCreatePage() {
  return <ExperienceForm mode="create" />;
}
