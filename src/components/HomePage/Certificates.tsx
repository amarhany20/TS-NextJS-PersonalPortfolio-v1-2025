import SectionHeader from "@/components/UI/SectionHeader";
import SectionCard from "@/components/UI/SectionCard";
import { certificates } from "@/data/profile";
import { ExternalLink } from "lucide-react";

export default function Certificates() {
  return (
    <section id="certificates" className="scroll-mt-8">
      <SectionHeader title="Certificates" subtitle="Professional certifications and achievements" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certificates.map((cert) => (
          <SectionCard key={cert.id} hover className="group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-1">{cert.name}</h3>
                <p className="text-[var(--accent-primary)] font-medium mb-2">{cert.organization}</p>
              </div>
              {cert.link && (
                <a href={cert.link} target="_blank" rel="noopener noreferrer" className="text-[var(--accent-secondary)] hover:text-[var(--accent-primary)] transition-colors" aria-label="View credential">
                  <ExternalLink size={16} />
                </a>
              )}
            </div>

            <div className="mb-4">
              <p className="text-[var(--text-secondary)] text-sm mb-2">{cert.description}</p>

              <div className="flex flex-col gap-1 text-sm">
                <p className="text-[var(--text-secondary)]">
                  <span className="font-medium">Completed:</span>{" "}
                  {new Date(cert.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </SectionCard>
        ))}
      </div>
    </section>
  );
}
