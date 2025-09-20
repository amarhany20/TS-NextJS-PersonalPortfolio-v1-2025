"use client";

import SectionHeader from "@/components/UI/SectionHeader";
import SectionCard from "@/components/UI/SectionCard";
import { useCertificates } from "@/hooks/useStaticData";
import { formatMonthYear } from "@/utils/helpers";
import { ExternalLink, Loader2 } from "lucide-react";
import { useState } from "react";

export default function Certificates() {
  const { data: certificates, loading, error } = useCertificates();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  if (loading) {
    return (
      <section id="certificates" className="scroll-mt-8">
        <SectionHeader title="Certificates" subtitle="Professional certifications and achievements" />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--accent-primary)]" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="certificates" className="scroll-mt-8">
        <SectionHeader title="Certificates" subtitle="Professional certifications and achievements" />
        <div className="flex items-center justify-center py-12">
          <p className="text-red-500">Error loading certificates: {error}</p>
        </div>
      </section>
    );
  }

  if (!certificates || certificates.length === 0) {
    return (
      <section id="certificates" className="scroll-mt-8">
        <SectionHeader title="Certificates" subtitle="Professional certifications and achievements" />
        <div className="flex items-center justify-center py-12">
          <p className="text-[var(--text-secondary)]">No certificates available</p>
        </div>
      </section>
    );
  }

  return (
    <section id="certificates" className="scroll-mt-8">
      <SectionHeader title="Certificates" subtitle="Professional certifications and achievements" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certificates.map((cert, index) => (
          <SectionCard key={index} hover className="group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-1">{cert.name}</h3>
                <p className="text-[var(--accent-primary)] font-medium mb-2">{cert.issuer}</p>
              </div>
              {cert.verifyUrl && (
                <a href={cert.verifyUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--accent-secondary)] hover:text-[var(--accent-primary)] transition-colors" aria-label="View credential">
                  <ExternalLink size={16} />
                </a>
              )}
            </div>

            <div className="mb-4">
              <p className="text-[var(--text-secondary)] text-sm mb-2">{cert.description}</p>

              <div className="flex flex-col gap-1 text-sm">
                <p className="text-[var(--text-secondary)]">
                  <span className="font-medium">Completed:</span> {formatMonthYear(cert.date)}
                </p>
                {(cert.image || cert.credential) && (
                  <div className="mt-2">
                    <button
                      className="text-[var(--accent-primary)] hover:underline text-sm font-medium"
                      onClick={() => {
                        const url = cert.image || `/files/cv/${encodeURIComponent(cert.credential || "")}.pdf`;
                        setPreviewUrl(url!);
                      }}
                    >
                      View certificate
                    </button>
                  </div>
                )}
              </div>
            </div>
          </SectionCard>
        ))}
      </div>

      {previewUrl && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setPreviewUrl(null)}>
          <div className="bg-[var(--background)] rounded-lg shadow-xl w-11/12 h-5/6 p-2" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-end mb-2">
              <button className="px-3 py-1 rounded bg-[var(--accent-muted)] hover:bg-[var(--accent-primary)] hover:text-black" onClick={() => setPreviewUrl(null)}>Close</button>
            </div>
            {previewUrl.endsWith(".pdf") ? (
              <iframe src={previewUrl} className="w-full h-full rounded" />
            ) : (
              // image fallback
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewUrl} alt="Certificate" className="max-h-full max-w-full mx-auto" />
            )}
          </div>
        </div>
      )}
    </section>
  );
}
