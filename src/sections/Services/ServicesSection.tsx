import type { Service } from '@/types/service';
import ServiceCard from '@/components/Services/ServiceCard';

interface ServicesSectionProps {
  items: Service[];
}

export default function ServicesSection({ items }: ServicesSectionProps) {
  if (!items.length) {
    return (
      <section className="space-y-8">
        <div className="border border-dashed border-[var(--border)] rounded-xl p-8 text-center text-[var(--text-secondary)]">
          No active services are published yet.
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <div className="grid gap-6 md:gap-8 grid-cols-1 lg:grid-cols-2">
        {items.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </section>
  );
}
