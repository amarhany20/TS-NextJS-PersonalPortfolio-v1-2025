import SectionHeader from "@/components/UI/SectionHeader";
import SectionCard from "@/components/UI/SectionCard";
import { allSkills } from "@/data/profile";
import { Code, Database, Server, Wrench, Star, TrendingUp } from "lucide-react";

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "core languages":
      return <Code size={20} className="text-[var(--accent-primary)]" />;
    case "frameworks & libraries":
      return <Server size={20} className="text-[var(--accent-secondary)]" />;
    case "databases":
      return <Database size={20} className="text-[var(--success)]" />;
    case "cloud & devops":
      return <Wrench size={20} className="text-[var(--warning)]" />;
    case "ai & machine learning":
      return <TrendingUp size={20} className="text-[var(--accent-primary)]" />;
    default:
      return <Star size={20} className="text-[var(--accent-primary)]" />;
  }
};

export default function Skills() {
  return (
    <section id="skills" className="scroll-mt-8">
      <SectionHeader title="Technical Skills" subtitle="My expertise across different technologies and tools" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {Object.entries(allSkills).map(([category, skills]) => (
          <SectionCard key={category} hover className="group relative overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-full opacity-5 group-hover:opacity-10 transition-opacity"></div>

            <div className="relative z-10">
              {/* Category header */}
              <div className="flex items-center gap-3 mb-6">
                {getCategoryIcon(category)}
                <h3 className="text-xl font-bold text-foreground">{category}</h3>
                <span className="ml-auto px-2 py-1 bg-[var(--accent-muted)] text-[var(--text-secondary)] text-xs rounded-full font-medium">{skills.length} skills</span>
              </div>

              {/* Skills list */}
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-[var(--accent-muted)] text-[var(--foreground)] text-sm rounded-full font-medium hover:bg-[var(--accent-primary)] hover:text-black transition-colors cursor-default">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </SectionCard>
        ))}
      </div>

      {/* Skills Summary */}
      <div className="mt-8">
        <SectionCard className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)]"></div>

          <div className="flex items-center gap-2 mb-6 pt-2">
            <TrendingUp size={20} className="text-[var(--accent-primary)]" />
            <h3 className="text-xl font-bold text-foreground">Skills Overview</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl font-bold text-black">{Object.values(allSkills).reduce((acc, skills) => acc + skills.length, 0)}</span>
              </div>
              <div className="text-[var(--text-secondary)] text-sm font-medium">Total Skills</div>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-[var(--success)] to-[var(--accent-primary)] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl font-bold text-black">{Object.keys(allSkills).length}</span>
              </div>
              <div className="text-[var(--text-secondary)] text-sm font-medium">Categories</div>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-[var(--accent-secondary)] to-[var(--warning)] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl font-bold text-black">{allSkills["Core Languages"].length}</span>
              </div>
              <div className="text-[var(--text-secondary)] text-sm font-medium">Core Languages</div>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-[var(--warning)] to-[var(--accent-primary)] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl font-bold text-black">{allSkills["Frameworks & Libraries"].length}</span>
              </div>
              <div className="text-[var(--text-secondary)] text-sm font-medium">Frameworks</div>
            </div>
          </div>
        </SectionCard>
      </div>
    </section>
  );
}
