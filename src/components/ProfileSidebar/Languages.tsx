"use client";

import { Globe, Loader2 } from "lucide-react";
import { useLanguages } from "@/hooks/useApiData";

export default function Languages() {
  const { data: langs, loading, error } = useLanguages();

  return (
    <div className="w-full">
      <h3 className="text-md font-semibold text-[var(--accent-primary)] mb-3 text-center">Languages</h3>
      {loading ? (
        <div className="flex justify-center py-2"><Loader2 className="h-4 w-4 animate-spin text-[var(--accent-primary)]" /></div>
      ) : error ? (
        <p className="text-xs text-center text-red-500">Failed to load</p>
      ) : (
        <div className="flex flex-col gap-2 items-center text-sm">
          {(langs || []).slice(0, 5).map((lang) => (
            <span key={lang.name} className="flex items-center gap-2 text-[var(--foreground)]">
              <Globe size={16} className="text-[var(--accent-secondary)]" />
              {lang.name}
              <span className="text-[var(--text-secondary)]">({lang.level})</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
