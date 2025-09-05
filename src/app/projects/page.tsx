import { getProjects } from "@/lib/database-services";
import Image from "next/image";

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">Portfolio</h1>
        <p className="text-[var(--text-secondary)]">Selected projects and case studies</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((p) => (
          <div key={p.id} className="bg-[var(--card-bg)] border border-[var(--border)] rounded-lg overflow-hidden">
            {p.image ? <Image src={p.image} alt={p.title} width={800} height={320} className="w-full h-40 object-cover" /> : null}
            <div className="p-4 space-y-2">
              <h3 className="font-semibold text-foreground">{p.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] line-clamp-3">{p.description}</p>
              <div className="flex gap-3 text-xs text-[var(--text-secondary)]">
                {p.demoUrl ? (
                  <a className="hover:text-[var(--accent-primary)]" href={p.demoUrl} target="_blank" rel="noopener noreferrer">Demo</a>
                ) : null}
                {p.githubUrl ? (
                  <a className="hover:text-[var(--accent-primary)]" href={p.githubUrl} target="_blank" rel="noopener noreferrer">GitHub</a>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
