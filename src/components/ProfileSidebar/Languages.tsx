import { Globe } from "lucide-react";

export default function Languages() {
  return (
    <div className="w-full">
      <h3 className="text-md font-semibold text-[var(--accent-primary)] mb-3 text-center">Languages</h3>
      <div className="flex flex-col gap-2 items-center text-sm">
        <span className="flex items-center gap-2 text-[var(--foreground)]">
          <Globe size={16} className="text-[var(--accent-secondary)]" />
          English
          <span className="text-[var(--text-secondary)]">(Native)</span>
        </span>
        <span className="flex items-center gap-2 text-[var(--foreground)]">
          <Globe size={16} className="text-[var(--accent-secondary)]" />
          Arabic
          <span className="text-[var(--text-secondary)]">(Native)</span>
        </span>
      </div>
    </div>
  );
}
