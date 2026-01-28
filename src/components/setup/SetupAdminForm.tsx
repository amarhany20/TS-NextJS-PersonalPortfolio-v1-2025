'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminAccountStep from '@/sections/setup/AdminAccountStep';
import { mergeSetupDraft, readSetupDraft, SetupDraft } from './SetupStorage';

const emptyAdmin: NonNullable<SetupDraft['admin']> = {
  username: '',
  email: '',
  displayName: '',
  password: '',
};

export function SetupAdminForm() {
  const router = useRouter();
  const [adminData, setAdminData] = useState<SetupDraft['admin'] | null>(null);

  useEffect(() => {
    const draft = readSetupDraft();
    setAdminData(draft.admin ?? emptyAdmin);
  }, []);

  if (!adminData) {
    return null;
  }

  return (
    <AdminAccountStep
      data={adminData}
      onUpdate={(data) => {
        mergeSetupDraft({ admin: data });
        setAdminData(data);
      }}
      onNext={() => router.push('/setup/site')}
      onPrev={() => router.push('/setup/database')}
    />
  );
}
