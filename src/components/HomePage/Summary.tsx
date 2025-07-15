import { ArrowRight, Download } from "lucide-react";
import { heroContent, cvInfo } from "@/data/profile";

export default function Summary() {
  return (
    <section id="summary" className="relative flex flex-col items-start gap-6 py-8 md:py-14 scroll-mt-8">
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-[var(--accent-primary)] drop-shadow-lg">{heroContent.greeting}</h1>
      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[var(--accent-secondary)]">{heroContent.subtitle}</h2>
      <p className="max-w-2xl text-[var(--text-secondary)] text-lg mb-2">
        {heroContent.description}
        <br />
        {heroContent.callToAction}
      </p>
      <div className="flex gap-4 mt-2">
        <a href={heroContent.primaryButton.href} className="inline-flex items-center px-6 py-3 rounded-lg font-semibold bg-[var(--accent-primary)] text-black hover:bg-yellow-300 shadow-md transition">
          {heroContent.primaryButton.text} <ArrowRight className="ml-2" size={20} />
        </a>
        <a href={cvInfo.downloadUrl} className="inline-flex items-center px-6 py-3 rounded-lg font-semibold border border-[var(--accent-secondary)] text-[var(--accent-secondary)] hover:bg-[var(--accent-secondary)] hover:text-white transition" target="_blank" rel="noopener noreferrer">
          <Download className="mr-2" size={20} />
          {heroContent.secondaryButton.text}
        </a>
      </div>
    </section>
  );
}
