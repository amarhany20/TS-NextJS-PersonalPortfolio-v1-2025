import ServicesHero from '@/components/Services/ServicesHero';
import ServicesSection from '@/sections/Services/ServicesSection';
import { ServiceService } from '@/server/services/ServiceService';

export default async function ServicesPage() {
  const services = await ServiceService.getActiveServices();

  return (
    <div className="space-y-6">
      <ServicesHero />
      <ServicesSection items={services} />
    </div>
  );
}
