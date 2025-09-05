import { getContactInfo, getSocialLinks } from "@/lib/database-services";
import { Mail, Phone, MapPin, MessageCircle, Github, Linkedin } from "lucide-react";
import ContactForm from "@/components/Contact/ContactForm";

export default async function ContactPage() {
  try {
  const contactInfo = await getContactInfo();
  const socialLinks = await getSocialLinks();

  if (!contactInfo) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Contact</h1>
          <p className="text-[var(--text-secondary)]">Personal information is being loaded...</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Contact</h1>
          <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">Let&apos;s discuss your project or collaboration opportunities</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Get in Touch</h2>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[var(--accent-primary)]" />
                  <div>
                    <p className="font-medium text-foreground">Email</p>
                    <a href={`mailto:${(contactInfo.email as string) || ""}`} className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors">
                      {(contactInfo.email as string) || ""}
                    </a>
                  </div>
                </div>

                {(() => {
                  const phone = (contactInfo.phone as string) || "";
                  const whatsapp = (socialLinks?.whatsappUrl as string) || "";
                  if (!phone || !whatsapp) return null;
                  return (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-[var(--accent-primary)]" />
                      <div>
                        <p className="font-medium text-foreground">Phone</p>
                        <a href={whatsapp} className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors">
                          {phone}
                        </a>
                      </div>
                    </div>
                  );
                })()}

                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[var(--accent-primary)]" />
                  <div>
                    <p className="font-medium text-foreground">Location</p>
                    <p className="text-[var(--text-secondary)]">{(contactInfo.location as string) || ""}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
    {socialLinks && (
              <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-lg p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Connect with Me</h2>

                <div className="grid grid-cols-2 gap-4">
      {!!(socialLinks as Record<string, unknown>).githubUrl && (
                    <a href={(socialLinks.githubUrl as string) || "#"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-[var(--accent-muted)] rounded-lg hover:bg-[var(--accent-primary)] hover:text-black transition-colors">
                      <Github className="w-5 h-5" />
                      <span className="font-medium">GitHub</span>
                    </a>
                  )}

      {!!(socialLinks as Record<string, unknown>).linkedInUrl && (
                    <a href={(socialLinks.linkedInUrl as string) || "#"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-[var(--accent-muted)] rounded-lg hover:bg-[var(--accent-primary)] hover:text-black transition-colors">
                      <Linkedin className="w-5 h-5" />
                      <span className="font-medium">LinkedIn</span>
                    </a>
                  )}

      {!!(socialLinks as Record<string, unknown>).whatsappUrl && (
                    <a href={(socialLinks.whatsappUrl as string) || "#"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-[var(--accent-muted)] rounded-lg hover:bg-[var(--accent-primary)] hover:text-black transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      <span className="font-medium">WhatsApp</span>
                    </a>
                  )}

      {!!(contactInfo as Record<string, unknown>).email && (
                    <a href={`mailto:${(contactInfo.email as string) || ""}`} className="flex items-center gap-3 p-3 bg-[var(--accent-muted)] rounded-lg hover:bg-[var(--accent-primary)] hover:text-black transition-colors">
                      <Mail className="w-5 h-5" />
                      <span className="font-medium">Email</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Contact Form */}
          <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Send a Message</h2>
            <ContactForm />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading contact page:", error);
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Contact</h1>
        <p className="text-[var(--text-secondary)]">Unable to load contact information. Please try again later.</p>
      </div>
    );
  }
}
