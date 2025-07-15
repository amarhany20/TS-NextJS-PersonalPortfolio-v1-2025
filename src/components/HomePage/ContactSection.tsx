import SectionHeader from "@/components/UI/SectionHeader";
import SectionCard from "@/components/UI/SectionCard";
import { socialLinks, personalInfo } from "@/data/profile";
import { Mail, MessageCircle, MapPin } from "lucide-react";

export default function ContactSection() {
  return (
    <section id="contact" className="scroll-mt-8">
      <SectionHeader title="Get In Touch" subtitle="Let's discuss your project or collaboration opportunities" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Information */}
        <SectionCard>
          <h3 className="text-lg font-semibold text-foreground mb-4">Contact Information</h3>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--accent-muted)] rounded-full flex items-center justify-center">
                <Mail className="text-[var(--accent-primary)]" size={18} />
              </div>
              <div>
                <p className="text-[var(--text-secondary)] text-sm">Email</p>
                <a href={`mailto:${personalInfo.email}`} className="text-foreground hover:text-[var(--accent-primary)] transition-colors">
                  {personalInfo.email}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--accent-muted)] rounded-full flex items-center justify-center">
                <MessageCircle className="text-[var(--accent-primary)]" size={18} />
              </div>
              <div>
                <p className="text-[var(--text-secondary)] text-sm">WhatsApp</p>
                <a href={socialLinks.whatsapp} className="text-foreground hover:text-[var(--accent-primary)] transition-colors" target="_blank" rel="noopener noreferrer">
                  {personalInfo.phoneNumbers[1].number}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--accent-muted)] rounded-full flex items-center justify-center">
                <MapPin className="text-[var(--accent-primary)]" size={18} />
              </div>
              <div>
                <p className="text-[var(--text-secondary)] text-sm">Location</p>
                <p className="text-foreground">{personalInfo.location}</p>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Quick Contact */}
        <SectionCard>
          <h3 className="text-lg font-semibold text-foreground mb-4">Quick Contact</h3>

          <div className="space-y-4">
            <p className="text-[var(--text-secondary)] text-sm">Ready to start a project or have questions? Choose your preferred way to reach out:</p>

            <div className="flex flex-col gap-3">
              <a href={`mailto:${personalInfo.email}`} className="flex items-center gap-3 p-3 bg-[var(--accent-muted)] rounded-lg hover:bg-[var(--accent-primary)] hover:text-black transition-all group">
                <Mail className="group-hover:text-black" size={20} />
                <span className="font-medium">Send me an email</span>
              </a>

              <a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-[var(--accent-muted)] rounded-lg hover:bg-[var(--success)] hover:text-black transition-all group">
                <MessageCircle className="group-hover:text-black" size={20} />
                <span className="font-medium">Chat on WhatsApp</span>
              </a>

              <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-[var(--accent-muted)] rounded-lg hover:bg-[var(--accent-secondary)] hover:text-white transition-all group">
                <svg className="w-5 h-5 group-hover:text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                <span className="font-medium">Connect on LinkedIn</span>
              </a>
            </div>
          </div>
        </SectionCard>
      </div>
    </section>
  );
}
