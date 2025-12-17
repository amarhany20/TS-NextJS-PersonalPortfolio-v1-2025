import type { Metadata } from 'next';

import { CertificatesManager } from '@/components/Admin/Certificates/CertificatesManager';
import { CertificateService } from '@/server/services/CertificateService';

export const metadata: Metadata = {
  title: 'Certificates | Admin',
};

export default async function AdminCertificatesPage() {
  const certificates = await CertificateService.getCertificates();

  return <CertificatesManager initialCertificates={certificates} />;
}
