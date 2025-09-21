import { featuredProjects as featured, nonFeaturedProjects as others } from '@/temp-data';
import type { Project } from '@/types/portfolio';
// `Image` import removed (unused)

function Badge({ children, variant = 'neutral' }: { children: React.ReactNode; variant?: 'neutral' | 'accent' | 'warning' | 'success' }) {
  const base = 'px-2 py-0.5 rounded-md text-[10px] font-medium tracking-wide uppercase border';
  const styles: Record<string, string> = {
    neutral: 'bg-[var(--card-bg)] border-[var(--border)] text-[var(--text-secondary)]',
    accent: 'bg-[var(--accent-primary)]/10 border-[var(--accent-primary)]/30 text-[var(--accent-primary)]',
    warning: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
  };
  return <span className={`${base} ${styles[variant]}`}>{children}</span>;
}

function statusVariant(status: Project['status']): 'accent' | 'warning' | 'success' | 'neutral' {
  switch (status) {
    case 'in-progress': return 'warning';
    case 'live': return 'success';
    case 'planning': return 'neutral';
    case 'archived': return 'neutral';
    default: return 'neutral';
  }
}

export default function PortfolioPage() {
  const featuredProjects: Project[] = featured;
  const otherProjects: Project[] = others;
  
  const ProjectGrid = ({ projects }: { projects: Project[] }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {projects.map(p => (
  <a key={p.slug} href={`/portfolio/${p.slug}`} className="group bg-[var(--card-bg)] border border-[var(--border)] rounded-lg overflow-hidden flex flex-col hover:border-[var(--accent-primary)]/40 transition">
          <div className="h-40 w-full bg-gradient-to-br from-[var(--border)]/20 to-transparent" />
          <div className="p-4 flex flex-col gap-3 flex-1">
            <div className="flex flex-wrap gap-1">
              <Badge variant={statusVariant(p.status)}>{p.status.replace('-', ' ')}</Badge>
              <Badge variant={p.visibility === 'public' ? 'neutral' : 'warning'}>{p.visibility}</Badge>
              {p.access === 'open-source' ? <Badge variant='accent'>Open Source</Badge> : null}
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-foreground group-hover:text-[var(--accent-primary)] transition">{p.title}</h3>
              <p className="text-xs text-[var(--text-secondary)]">{p.tagline}</p>
            </div>
            <p className="text-sm text-[var(--text-secondary)] line-clamp-3 flex-1">{p.intro}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {p.stack.slice(0, 4).map(s => (
                <span key={s} className="text-[10px] bg-[var(--border)]/30 text-[var(--text-secondary)] px-2 py-0.5 rounded">{s}</span>
              ))}
            </div>
          </div>
        </a>
      ))}
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">Portfolio</h1>
        <p className="text-[var(--text-secondary)]">Selected projects and case studies</p>
      </div>

      {featuredProjects.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold text-foreground">Featured Projects</h2>
            <Badge variant="accent">Featured</Badge>
          </div>
          <ProjectGrid projects={featuredProjects} />
        </section>
      )}

      {otherProjects.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Other Projects</h2>
          <ProjectGrid projects={otherProjects} />
        </section>
      )}
    </div>
  );
}
