import React from 'react';
import { BackupSettingsForm } from '@/components/Admin/Settings/BackupSettingsForm';

export default async function AdminBackupSettingsPage() {
  return (
    <section className="space-y-8 py-6">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">
          Admin Settings
        </p>
        <h1 className="text-2xl font-semibold text-foreground">Database Backup & Restore</h1>
        <p className="max-w-3xl text-sm text-[var(--text-secondary)]">
          Export portable database snapshots or restore your site content safely from a JSON backup.
        </p>
      </header>

      <BackupSettingsForm />
    </section>
  );
}
