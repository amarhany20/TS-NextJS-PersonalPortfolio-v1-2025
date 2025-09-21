import { notFound } from 'next/navigation';
import { findProject as projectBySlug, portfolio as allProjects } from '@/temp-data';
import type { Project } from '@/types/portfolio';
import React from 'react';
import { ProjectBadges } from '@/components/Portfolio/ProjectBadges';
import { ProjectMetaGrid } from '@/components/Portfolio/ProjectMetaGrid';
import { ProjectGallery } from '@/components/Portfolio/ProjectGallery';

function Section({ title, body }: { title: string; body: string }) {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-sm leading-relaxed text-[var(--text-secondary)] whitespace-pre-line">{body}</p>
    </div>
  );
}


export async function generateStaticParams() {
  return allProjects.map(p => ({ slug: p.slug }));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProjectPage({ params }: { params: any }) {
  const slug = params?.slug as string;
  const project: Project | null = projectBySlug(slug);
  if (!project) return notFound();

  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">{project.title}</h1>
        <p className="text-[var(--text-secondary)] max-w-3xl">{project.intro}</p>
      </header>

      <section className="grid gap-10 md:grid-cols-[2fr_1fr]">
        <div className="space-y-10">
          <div className="space-y-6">
            {(project.sections || []).sort((a,b)=>a.order-b.order).map(s => (
              <Section key={s.id} title={s.title} body={s.body} />
            ))}
          </div>
          <ProjectGallery project={project} />
        </div>
        <aside className="space-y-6">
          <ProjectBadges project={project} />
          <ProjectMetaGrid project={project} />
        </aside>
      </section>
    </div>
  );
}
