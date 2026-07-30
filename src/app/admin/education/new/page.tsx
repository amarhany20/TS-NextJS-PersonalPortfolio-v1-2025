import type { Metadata } from 'next';

import { EducationForm } from '@/components/Admin/Education/EducationForm';

export const metadata: Metadata = {
  title: 'New Education | Admin',
};

export default function AdminEducationCreatePage() {
  return <EducationForm mode="create" />;
}
