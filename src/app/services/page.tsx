import ServicesHero from '@/components/Services/ServicesHero';
import ServicesSection from '@/sections/Services/ServicesSection';

export default function ServicesPage() {
  return (
    <div className="space-y-6">
      <ServicesHero />
      <ServicesSection />
    </div>
  );
}
