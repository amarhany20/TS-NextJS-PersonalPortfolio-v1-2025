import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';

import { PortfolioService } from '@/server/services/PortfolioService';
import { SettingsService } from '@/server/services/SettingsService';
import { compileProjectMdx } from '@/server/services/mdx';
import type { Project } from '@/types/portfolio';
import { ProjectBadges } from '@/components/Portfolio/ProjectBadges';
import { ProjectMetaGrid } from '@/components/Portfolio/ProjectMetaGrid';
import { ProjectGallery } from '@/components/Portfolio/ProjectGallery';

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-sm leading-relaxed text-[var(--text-secondary)] whitespace-pre-line">
        {body}
      </p>
    </div>
  );
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const project = await PortfolioService.getProjectBySlug(slug);

    if (!project || !project.published) {
      return { title: 'Project Not Found' };
    }

    const settings = await SettingsService.getSiteContent();
    const siteUrl = settings.seo?.siteUrl || '';
    const projectUrl = siteUrl ? `${siteUrl.replace(/\/$/, '')}/portfolio/${project.slug}` : '';
    const siteTitle = settings.seo?.title || settings.profile?.fullName || 'Portfolio';
    const title = `${project.title} | ${siteTitle}`;
    const description = project.intro || project.summary || `${project.title} case study`;
    const heroImage = project.gallery?.[0]?.image;

    return {
      // Use `absolute` so the root layout's title template does not append a
      // second branding suffix (e.g. "Project | Name | Portfolio").
      title: { absolute: title },
      description,
      keywords: project.stack || [],
      alternates: projectUrl ? { canonical: projectUrl } : undefined,
      openGraph: {
        type: 'article',
        title: project.title,
        description,
        url: projectUrl || undefined,
        images: heroImage ? [{ url: heroImage }] : undefined,
      },
      twitter: {
        card: heroImage ? 'summary_large_image' : 'summary',
        title: project.title,
        description,
        images: heroImage ? [heroImage] : undefined,
      },
    };
  } catch {
    return { title: 'Portfolio Project' };
  }
}

export async function generateStaticParams() {
  const settings = await SettingsService.getSiteContent();

  if (!settings.visibility.pages.portfolio) {
    return [];
  }

  const slugs = await PortfolioService.getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const settings = await SettingsService.getSiteContent();

  if (!settings.visibility.pages.portfolio) {
    return notFound();
  }

  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  if (!slug) return notFound();

  const project: Project | null = await PortfolioService.getProjectBySlug(slug);
  if (!project || !project.published || project.visibility !== 'public') {
    return notFound();
  }

  const compiledMdx = compileProjectMdx(project.contentMdx);

  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">{project.title}</h1>
        <p className="text-[var(--text-secondary)] max-w-3xl text-base md:text-lg">
          {project.intro}
        </p>
        {compiledMdx?.readingTimeMinutes && (
          <div className="text-xs text-[var(--text-secondary)] font-mono">
            Reading time: ~{compiledMdx.readingTimeMinutes} min read
          </div>
        )}
      </header>

      <section className="grid gap-10 md:grid-cols-[2fr_1fr]">
        <div className="space-y-10">
          {/* Render Rich MDX Content if present */}
          {compiledMdx ? (
            <article
              className="prose dark:prose-invert max-w-none space-y-4 text-sm leading-relaxed text-[var(--text-secondary)]"
              dangerouslySetInnerHTML={{ __html: compiledMdx.html }}
            />
          ) : (
            /* Fallback to Standard Section List */
            <div className="space-y-6">
              {(project.sections || []).map((s) => (
                <Section key={s.id} title={s.title} body={s.body} />
              ))}
            </div>
          )}

          {/* Project Screenshot Gallery */}
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
