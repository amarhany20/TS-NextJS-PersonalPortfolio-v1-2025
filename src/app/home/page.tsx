import Summary from "@/components/HomePage/Summary";
import Experience from "@/components/HomePage/Experience";
import Education from "@/components/HomePage/Education";
import Certificates from "@/components/HomePage/Certificates";
import Recommendations from "@/components/HomePage/Recommendations";
import Skills from "@/components/HomePage/Skills";
import ContactSection from "@/components/HomePage/ContactSection";
import CVSection from "@/components/HomePage/CVSection";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-12">
      <Summary />
      <Experience />
      <Education />
      <Certificates />
      <Recommendations />
      <Skills />
      <ContactSection />
      <CVSection />
    </div>
  );
}
