import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';

import { requireAuth } from '@/server/security/session';
import { SettingsService } from '@/server/services/SettingsService';
import { AdminLayoutShell } from '@/components/Admin/AdminLayoutShell';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  try {
    const session = await requireAuth();
    const siteContent = await SettingsService.getSiteContent();
    return (
      <AdminLayoutShell user={session.user!} profile={siteContent.profile}>
        {children}
      </AdminLayoutShell>
    );
  } catch {
    redirect('/login');
  }
}
