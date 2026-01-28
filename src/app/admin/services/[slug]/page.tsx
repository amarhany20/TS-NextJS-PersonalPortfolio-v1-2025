import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ServiceForm } from '@/components/Admin/Services/ServiceForm';
import { ServiceService } from '@/server/services/ServiceService';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const metadata: Metadata = {
  title: 'Edit Service | Admin',
};

export default async function AdminServiceEditPage({ params }: PageProps) {
  const { slug } = await params;
  const service = await ServiceService.getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return <ServiceForm mode="edit" service={service} />;
}
