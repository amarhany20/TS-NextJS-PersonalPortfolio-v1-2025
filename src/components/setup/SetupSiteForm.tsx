'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SiteConfigStep from '@/sections/setup/SiteConfigStep';
import { mergeSetupDraft, readSetupDraft, SetupDraft } from './SetupStorage';

const emptySite: NonNullable<SetupDraft['site']> = {
  theme: 'professional-dark',
  siteTitle: '',
  siteSubtitle: '',
  description: '',
};

export function SetupSiteForm() {
  const router = useRouter();
  const [siteData, setSiteData] = useState<SetupDraft['site'] | null>(null);

  useEffect(() => {
    const draft = readSetupDraft();
    setSiteData(draft.site ?? emptySite);
  }, []);

  if (!siteData) {
    return null;
  }

  return (
    <SiteConfigStep
      data={siteData}
      onUpdate={(data) => {
        mergeSetupDraft({ site: data });
        setSiteData(data);
      }}
      onComplete={() => router.push('/setup/content')}
      onPrev={() => router.push('/setup/admin')}
    />
  );
}
