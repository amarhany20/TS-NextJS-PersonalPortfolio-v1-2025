"use client";

import { useCoreSkills } from "@/hooks/useStaticData";

export default function Skills() {
  const core = useCoreSkills();

  return (
    <div className="w-full">
      <h3 className="text-md font-semibold text-[var(--accent-primary)] mb-3 text-center">Core Skills</h3>
      {(
        <div className="flex flex-wrap justify-center">
          {(core || []).slice(0, 12).map((skill) => (
            <span
              key={skill.name}
              className="px-3 py-1 mr-1 mb-1 rounded-full text-sm font-semibold text-white bg-[var(--accent-secondary)]/80 hover:scale-105 transition-transform"
              style={{ boxShadow: "0 2px 8px 0 rgba(0,0,0,0.2)" }}
            >
              {skill.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
