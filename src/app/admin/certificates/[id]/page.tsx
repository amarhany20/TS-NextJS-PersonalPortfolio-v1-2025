import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';

import { CertificateForm } from '@/components/Admin/Certificates/CertificateForm';
import { CertificateService } from '@/server/services/CertificateService';

interface AdminCertificateEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

const loadCertificate = cache((id: string) => CertificateService.getCertificateById(id));

export async function generateMetadata({
  params,
}: AdminCertificateEditPageProps): Promise<Metadata> {
  const { id } = await params;
  const certificate = await loadCertificate(id);
  return {
    title: certificate ? `Edit ${certificate.name} | Admin Certificate` : 'Certificate not found',
  };
}

export default async function AdminCertificateEditPage({ params }: AdminCertificateEditPageProps) {
  const { id } = await params;
  const certificate = await loadCertificate(id);

  if (!certificate) {
    notFound();
  }

  return <CertificateForm mode="edit" certificate={certificate} />;
}
