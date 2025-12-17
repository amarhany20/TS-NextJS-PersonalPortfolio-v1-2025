import type { Metadata } from 'next';

import { CertificateForm } from '@/components/Admin/Certificates/CertificateForm';

export const metadata: Metadata = {
  title: 'New Certificate | Admin',
};

export default function AdminCertificateCreatePage() {
  return <CertificateForm mode="create" />;
}

