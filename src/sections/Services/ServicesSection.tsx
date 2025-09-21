import { services } from '@/temp-data/services';
import ServiceCard from '../../components/Services/ServiceCard';

export default function ServicesSection() {
  return (
    <section className="space-y-8">
      <div className="grid gap-6 md:gap-8 grid-cols-1 lg:grid-cols-2">
        {services.map(s => <ServiceCard key={s.id} service={s} />)}
      </div>
    </section>
  );
}
