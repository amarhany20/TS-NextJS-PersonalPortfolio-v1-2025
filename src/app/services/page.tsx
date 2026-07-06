import { notFound } from 'next/navigation';

import ServicesHero from '@/components/Services/ServicesHero';
import ServicesSection from '@/sections/Services/ServicesSection';
import { ServiceService } from '@/server/services/ServiceService';
import { SettingsService } from '@/server/services/SettingsService';

export default async function ServicesPage() {
  const settings = await SettingsService.getSiteContent();

  if (!settings.visibility.pages.services) {
    notFound();
  }

  const services = await ServiceService.getActiveServices();

  return (
    <div className="space-y-6">
      <ServicesHero />
      <ServicesSection items={services} />
    </div>
  );
}
