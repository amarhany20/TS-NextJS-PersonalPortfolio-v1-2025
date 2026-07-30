'use client';
import SectionHeader from '@/components/ui/SectionHeader';
import SectionCard from '@/components/ui/SectionCard';
import { formatMonthYear } from '@/utils/helpers';
import type { Certificate } from '@/types/certificate';

interface CertificatesSectionProps {
  items?: Certificate[];
}

export default function CertificatesSection({ items }: CertificatesSectionProps) {
  const certificates = items ?? [];
  if (!certificates.length)
    return (
      <section id="certificates" className="scroll-mt-8">
        <SectionHeader
          title="Certificates"
          subtitle="Professional certifications and achievements"
        />
        <div className="flex items-center justify-center py-12">
          <p className="text-[var(--text-secondary)]">No certificates available</p>
        </div>
      </section>
    );
  return (
    <section id="certificates" className="scroll-mt-8">
      <SectionHeader title="Certificates" subtitle="Professional certifications and achievements" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certificates.map((cert) => {
          if (cert.verifyUrl) {
            return (
              <a
                key={cert.id}
                href={cert.verifyUrl}
                className="group"
                aria-label={`Open ${cert.name} document`}
              >
                <SectionCard hover className="group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-1">{cert.name}</h3>
                      <p className="text-[var(--accent-primary)] font-medium mb-2">{cert.issuer}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    {cert.description ? (
                      <p className="text-[var(--text-secondary)] text-sm mb-2">
                        {cert.description}
                      </p>
                    ) : null}
                    <div className="flex flex-col gap-1 text-sm">
                      <p className="text-[var(--text-secondary)]">
                        <span className="font-medium">Completed:</span> {formatMonthYear(cert.date)}
                      </p>
                    </div>
                  </div>
                </SectionCard>
              </a>
            );
          }
          return (
            <SectionCard key={cert.id} hover className="group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-1">{cert.name}</h3>
                  <p className="text-[var(--accent-primary)] font-medium mb-2">{cert.issuer}</p>
                </div>
              </div>
              <div className="mb-4">
                {cert.description ? (
                  <p className="text-[var(--text-secondary)] text-sm mb-2">{cert.description}</p>
                ) : null}
                <div className="flex flex-col gap-1 text-sm">
                  <p className="text-[var(--text-secondary)]">
                    <span className="font-medium">Completed:</span> {formatMonthYear(cert.date)}
                  </p>
                </div>
              </div>
            </SectionCard>
          );
        })}
      </div>
    </section>
  );
}
