"use client";

import { useCoreSkills } from "@/hooks/useApiData";
import { Loader2 } from "lucide-react";

export default function CoreSkills() {
  const { data: skills, loading, error } = useCoreSkills();

  return (
    <div className="w-full">
      <h3 className="text-sm font-semibold text-[var(--accent-primary)] mb-3">Core Skills</h3>
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin text-[var(--accent-primary)]" />
      ) : error ? (
        <p className="text-xs text-red-500">Failed to load</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {(skills || []).slice(0, 10).map((skill) => {
            return (
              <span key={skill.id} className="px-2 py-1 bg-[var(--accent-muted)] text-xs rounded text-[var(--text-secondary)]">
                {skill.name}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
