"use client";

import { useCoreSkills } from "@/hooks/useStaticData";

export default function CoreSkills() {
  const skills = useCoreSkills();

  return (
    <div className="w-full">
  <h3 className="text-base font-semibold text-[var(--accent-primary)] mb-3">Core Skills</h3>
      {(
        <div className="flex flex-wrap gap-2">
          {(skills || []).slice(0, 10).map((skill) => {
            return (
              <span
                key={skill.id}
                className="px-3 py-1 bg-[var(--accent-muted)] text-sm rounded text-[var(--text-secondary)] transition-colors duration-200 hover:bg-[var(--accent-primary)] hover:text-white cursor-pointer"
              >
                {skill.name}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
