"use client";

import { Globe } from "lucide-react";
import { useLanguages } from "@/hooks/useStaticData";

export default function Languages() {
  const langs = useLanguages();

  return (
    <div className="w-full">
      <h3 className="text-md font-semibold text-[var(--accent-primary)] mb-3 text-center">Languages</h3>
      {(
        <div className="flex flex-col gap-2 items-center text-sm">
          {(langs || []).slice(0, 5).map((lang: string) => (
            <span key={lang} className="flex items-center gap-2 text-[var(--foreground)]">
              <Globe size={16} className="text-[var(--accent-secondary)]" />
              {lang}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
