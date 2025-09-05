import SectionHeader from "@/components/UI/SectionHeader";
import SectionCard from "@/components/UI/SectionCard";
import { getRecommendations } from "@/lib/database-services";
import { Linkedin, Quote } from "lucide-react";
import Image from "next/image";

function formatDisplayDate(value: string | Date): string {
  if (!value) return "";
  // Allow known labels like "Present"
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (/present/i.test(trimmed)) return "Present";
    // Try parsing common formats
    const parsed = new Date(trimmed);
    if (!isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    }
    // Fallback to raw string if unparseable
    return trimmed;
  }
  const d = new Date(value);
  return !isNaN(d.getTime()) ? d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "";
}

export default async function Recommendations() {
  const recommendations = await getRecommendations();

  return (
    <section id="recommendations" className="scroll-mt-8">
      <SectionHeader title="Recommendations" subtitle="What colleagues and clients say about working with me" />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {recommendations.map((rec, index) => {
          const dateStr = formatDisplayDate(rec.date as unknown as string);
          return (
            <SectionCard key={index} hover className="group">
              <div className="flex items-start justify-between mb-4">
                <Quote className="text-[var(--accent-primary)] flex-shrink-0 mt-1" size={22} />
                {rec.linkedin && (
                  <a href={rec.linkedin} target="_blank" rel="noopener noreferrer" className="text-[var(--accent-secondary)] hover:text-[var(--accent-primary)] transition-colors" aria-label="View LinkedIn profile">
                    <Linkedin size={18} />
                  </a>
                )}
              </div>

              <blockquote className="text-[var(--text-secondary)] text-[15px] mb-5 leading-relaxed">“{rec.content}”</blockquote>

              <div className="flex items-center gap-3">
                {rec.photo && <Image src={rec.photo} alt={rec.name} width={44} height={44} className="w-11 h-11 rounded-full object-cover" />}
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-[var(--text-primary)] text-sm">{rec.name}</h4>
                    <span className="text-[var(--accent-primary)] text-xs font-medium">{rec.position}</span>
                    <span className="text-[var(--text-secondary)] text-xs">{rec.company}</span>
                  </div>
                  {rec.relationship && <p className="text-[var(--text-secondary)] text-xs mt-0.5">{rec.relationship}</p>}
                </div>
              </div>

              {dateStr && (
                <div className="mt-4 pt-4 border-t border-[var(--accent-muted)]">
                  <p className="text-[var(--text-secondary)] text-xs">{dateStr}</p>
                </div>
              )}
            </SectionCard>
          );
        })}
      </div>
    </section>
  );
}
