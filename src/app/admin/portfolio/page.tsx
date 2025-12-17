import { PortfolioManager } from '@/components/Admin/Portfolio/PortfolioManager';
import { PortfolioService } from '@/server/services/PortfolioService';

export default async function AdminPortfolioPage() {
  const projects = await PortfolioService.getAllProjects();

  return (
    <section className="py-6">
      <PortfolioManager initialProjects={projects} />
    </section>
  );
}
