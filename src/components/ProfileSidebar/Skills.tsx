export default function Skills() {
  const skills = [
    { label: "React", color: "#61dafb" },
    { label: "Next.js", color: "#000000" },
    { label: "TypeScript", color: "#3178c6" },
    { label: "Node.js", color: "#8cc84b" },
    { label: "MongoDB", color: "#4DB33D" },
    { label: "PostgreSQL", color: "#336791" },
    { label: "Tailwind", color: "#38bdf8" },
    { label: "Docker", color: "#2496ed" },
  ];

  return (
    <div className="w-full">
      <h3 className="text-md font-semibold text-[var(--accent-primary)] mb-3 text-center">Core Skills</h3>
      <div className="flex flex-wrap gap-2 justify-center">
        {skills.map((skill) => (
          <span
            key={skill.label}
            className="px-3 py-1 rounded-full text-xs font-semibold text-white transition-transform hover:scale-105"
            style={{
              background: skill.color,
              boxShadow: "0 2px 8px 0 rgba(0,0,0,0.2)",
            }}>
            {skill.label}
          </span>
        ))}
      </div>
    </div>
  );
}
