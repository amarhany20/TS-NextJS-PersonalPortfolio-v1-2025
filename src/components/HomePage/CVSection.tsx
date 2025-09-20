import SectionHeader from "@/components/UI/SectionHeader";
import SectionCard from "@/components/UI/SectionCard";
import { Download, FileText, Eye } from "lucide-react";

export default async function CVSection() {
  const cvInfo = { downloadUrl: "/cv/placeholder.pdf", lastUpdated: "2025-01-01", version: "1.0", fileSize: "120KB" };
  return (
    <section id="cv" className="scroll-mt-8">
      <SectionHeader title="Curriculum Vitae" subtitle="Download my resume or view it online" />

      <SectionCard>
        <div className="text-center">
          <div className="w-20 h-20 bg-[var(--accent-muted)] rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="text-[var(--accent-primary)]" size={32} />
          </div>{" "}
          <h3 className="text-xl font-semibold text-foreground mb-2">Professional Resume</h3>
          <p className="text-[var(--text-secondary)] mb-6 max-w-2xl mx-auto">Download my comprehensive resume or view it online</p>
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
            <p className="text-[var(--text-secondary)] text-sm">
              Version: {cvInfo.version} • Size: {cvInfo.fileSize}
            </p>
          </div>
        </div>
      </SectionCard>
    </section>
  );
}
