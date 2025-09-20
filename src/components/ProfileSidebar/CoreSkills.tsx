"use client";

import { useCoreSkills } from "@/hooks/useStaticData";
import { Loader2 } from "lucide-react";

export default function CoreSkills() {
  const { data: skills, loading, error } = useCoreSkills();

  return (
    <div className="w-full">
  <h3 className="text-base font-semibold text-[var(--accent-primary)] mb-3">Core Skills</h3>
      {loading ? (
  <Loader2 className="h-5 w-5 animate-spin text-[var(--accent-primary)]" />
      ) : error ? (
        <p className="text-sm text-red-500">Failed to load</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {(skills || []).slice(0, 10).map((skill) => {
            return (
              <span key={skill.id} className="px-3 py-1 bg-[var(--accent-muted)] text-sm rounded text-[var(--text-secondary)]">
                {skill.name}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
