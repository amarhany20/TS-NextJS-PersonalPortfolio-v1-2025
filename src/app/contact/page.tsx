import SectionHeader from '@/components/UI/SectionHeader';
import ContactSection from '@/sections/home/ContactSection';

export default function ContactPage() {
  return (
    <main className="prose prose-invert">
      <SectionHeader title="Contact" subtitle="Get in touch" />
      <ContactSection />
    </main>
  );
}
