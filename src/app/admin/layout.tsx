import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';

import { requireAuth } from '@/server/security/session';
import { AdminLayoutShell } from '@/components/Admin/AdminLayoutShell';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  try {
    const session = await requireAuth();
    return <AdminLayoutShell user={session.user!}>{children}</AdminLayoutShell>;
  } catch {
    redirect('/login');
  }
}
