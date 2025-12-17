import { ServiceReorderBoard } from '@/components/Admin/Services/ServiceReorderBoard';
import { ServiceService } from '@/server/services/ServiceService';

export default async function AdminServicesPage() {
  const services = await ServiceService.getAllServices();

  return (
    <section className="space-y-6 py-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Services</h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Adjust ordering to influence how offerings appear on the public site. Drag cards or use the keyboard for
          accessible reordering.
        </p>
      </header>

      <ServiceReorderBoard services={services} />
    </section>
  );
}
