import { getPersonalInfo, getSocialLinks } from "@/lib/database-services";
import { Mail, Phone, MapPin, MessageCircle, Github, Linkedin } from "lucide-react";

export default async function ContactPage() {
  try {
    const personalInfo = await getPersonalInfo();
    const socialLinks = await getSocialLinks();

    if (!personalInfo) {
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
                    <a href={`mailto:${personalInfo.email}`} className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors">
                      {personalInfo.email as string}
                    </a>
                  </div>
                </div>

                {socialLinks?.whatsapp && personalInfo.phoneNumbers && Array.isArray(personalInfo.phoneNumbers) && (personalInfo.phoneNumbers as Array<{ label: string; number: string }>)[1] && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-[var(--accent-primary)]" />
                    <div>
                      <p className="font-medium text-foreground">Phone</p>
                      <a href={socialLinks.whatsapp} className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors">
                        {(personalInfo.phoneNumbers as Array<{ label: string; number: string }>)[1].number}
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[var(--accent-primary)]" />
                  <div>
                    <p className="font-medium text-foreground">Location</p>
                    <p className="text-[var(--text-secondary)]">{personalInfo.location as string}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            {socialLinks && (
              <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-lg p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Connect with Me</h2>

                <div className="grid grid-cols-2 gap-4">
                  {socialLinks.github && (
                    <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-[var(--accent-muted)] rounded-lg hover:bg-[var(--accent-primary)] hover:text-black transition-colors">
                      <Github className="w-5 h-5" />
                      <span className="font-medium">GitHub</span>
                    </a>
                  )}

                  {socialLinks.linkedin && (
                    <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-[var(--accent-muted)] rounded-lg hover:bg-[var(--accent-primary)] hover:text-black transition-colors">
                      <Linkedin className="w-5 h-5" />
                      <span className="font-medium">LinkedIn</span>
                    </a>
                  )}

                  {socialLinks.whatsapp && (
                    <a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-[var(--accent-muted)] rounded-lg hover:bg-[var(--accent-primary)] hover:text-black transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      <span className="font-medium">WhatsApp</span>
                    </a>
                  )}

                  {socialLinks.email && (
                    <a href={socialLinks.email} className="flex items-center gap-3 p-3 bg-[var(--accent-muted)] rounded-lg hover:bg-[var(--accent-primary)] hover:text-black transition-colors">
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

            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                  Name
                </label>
                <input type="text" id="name" className="w-full px-3 py-2 bg-[var(--accent-muted)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent text-foreground" placeholder="Your name" />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                  Email
                </label>
                <input type="email" id="email" className="w-full px-3 py-2 bg-[var(--accent-muted)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent text-foreground" placeholder="your@email.com" />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-1">
                  Subject
                </label>
                <input type="text" id="subject" className="w-full px-3 py-2 bg-[var(--accent-muted)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent text-foreground" placeholder="Project discussion" />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={6}
                  className="w-full px-3 py-2 bg-[var(--accent-muted)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent text-foreground resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>

              <button type="submit" className="w-full bg-[var(--accent-primary)] text-black py-3 px-4 rounded-lg font-medium hover:bg-[var(--accent-secondary)] transition-colors">
                Send Message
              </button>
            </form>
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
