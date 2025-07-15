export default function CoreSkills() {
  const coreSkills = ["React", "Next.js", "TypeScript", "Node.js", "MongoDB", "PostgreSQL", "AWS", "Docker"];

  return (
    <div className="w-full">
      <h3 className="text-sm font-semibold text-[var(--accent-primary)] mb-3">Core Skills</h3>
      <div className="flex flex-wrap gap-2">
        {coreSkills.map((skill) => (
          <span key={skill} className="px-2 py-1 bg-[var(--accent-muted)] text-xs rounded text-[var(--text-secondary)]">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
