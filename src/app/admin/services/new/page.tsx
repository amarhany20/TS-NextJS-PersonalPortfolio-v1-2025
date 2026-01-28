import type { Metadata } from 'next';

import { ServiceForm } from '@/components/Admin/Services/ServiceForm';

export const metadata: Metadata = {
  title: 'New Service | Admin',
};

export default function AdminServiceCreatePage() {
  return <ServiceForm mode="create" />;
}
