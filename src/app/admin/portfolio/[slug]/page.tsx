import { notFound } from 'next/navigation';

import { ProjectForm } from '@/components/Admin/Portfolio/ProjectForm';
import { PortfolioService } from '@/server/services/PortfolioService';

export default async function AdminPortfolioEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  if (!slug) {
    notFound();
  }

  const project = await PortfolioService.getProjectBySlug(slug);
  if (!project) {
    notFound();
  }

  return (
    <section className="py-6">
      <ProjectForm mode="edit" project={project} />
    </section>
  );
}
