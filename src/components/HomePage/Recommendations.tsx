import SectionHeader from "@/components/UI/SectionHeader";
import SectionCard from "@/components/UI/SectionCard";
import { recommendations } from "@/data/profile";
import { Linkedin, Quote } from "lucide-react";
import Image from "next/image";

export default function Recommendations() {
  return (
    <section id="recommendations" className="scroll-mt-8">
      <SectionHeader title="Recommendations" subtitle="What colleagues and clients say about working with me" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((rec) => (
          <SectionCard key={rec.id} hover className="group">
            <div className="flex items-start justify-between mb-4">
              <Quote className="text-[var(--accent-primary)] flex-shrink-0 mt-1" size={20} />
              {rec.linkedinUrl && (
                <a href={rec.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--accent-secondary)] hover:text-[var(--accent-primary)] transition-colors" aria-label="View LinkedIn profile">
                  <Linkedin size={16} />
                </a>
              )}
            </div>

            <blockquote className="text-[var(--text-secondary)] text-sm mb-4 italic leading-relaxed">&quot;{rec.content}&quot;</blockquote>

            <div className="flex items-start gap-3">
              {rec.avatar && <Image src={rec.avatar} alt={rec.name} width={40} height={40} className="w-10 h-10 rounded-full object-cover" />}
              <div className="flex-1">
                <h4 className="font-semibold text-foreground text-sm">{rec.name}</h4>
                <p className="text-[var(--accent-primary)] text-xs font-medium">{rec.title}</p>
                <p className="text-[var(--text-secondary)] text-xs">{rec.company}</p>
                <p className="text-[var(--text-secondary)] text-xs mt-1">{rec.relationship}</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[var(--accent-muted)]">
              <p className="text-[var(--text-secondary)] text-xs">
                {new Date(rec.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </SectionCard>
        ))}
      </div>
    </section>
  );
}
