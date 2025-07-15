import SectionHeader from "@/components/UI/SectionHeader";
import SectionCard from "@/components/UI/SectionCard";
import { cvInfo } from "@/data/profile";
import { Download, FileText, Eye } from "lucide-react";

export default function CVSection() {
  return (
    <section id="cv" className="scroll-mt-8">
      <SectionHeader title="Curriculum Vitae" subtitle="Download my resume or view it online" />

      <SectionCard>
        <div className="text-center">
          <div className="w-20 h-20 bg-[var(--accent-muted)] rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="text-[var(--accent-primary)]" size={32} />
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-2">{cvInfo.title}</h3>

          <p className="text-[var(--text-secondary)] mb-6 max-w-2xl mx-auto">{cvInfo.subtitle}</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={cvInfo.downloadUrl} download="Ammar_Hany_Resume.pdf" className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent-primary)] text-black font-semibold rounded-lg hover:bg-[var(--accent-primary)]/90 transition-colors">
              <Download size={20} />
              Download Resume
            </a>

            <a href={cvInfo.downloadUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 border border-[var(--border)] text-foreground font-semibold rounded-lg hover:bg-[var(--accent-muted)] transition-colors">
              <Eye size={20} />
              View Online
            </a>
          </div>

          <div className="mt-6 text-center">
            <p className="text-[var(--text-secondary)] text-sm">Last updated: {cvInfo.lastUpdated}</p>
            <div className="flex justify-center gap-4 mt-2">
              <span className="text-[var(--text-secondary)] text-sm">Available formats:</span>
              <div className="flex gap-2">
                {cvInfo.formats.map((format, index) => (
                  <span key={index} className="px-2 py-1 bg-[var(--accent-muted)] text-[var(--text-secondary)] text-xs rounded">
                    {format}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SectionCard>
    </section>
  );
}
