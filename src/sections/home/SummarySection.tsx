'use client';
import Link from 'next/link';
import { useMemo } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import { ArrowRight, Download, FolderOpen } from 'lucide-react';
import type { HeroContent } from '@/types/settings';

interface SummarySectionProps {
  hero: HeroContent;
}

export default function SummarySection({ hero }: SummarySectionProps) {
  const descriptionHtml = useMemo(() => {
    if (hero.descriptionHtml && hero.descriptionHtml.trim().length > 0) {
      return DOMPurify.sanitize(hero.descriptionHtml);
    }
    if (hero.highlights.length) {
      const list = hero.highlights.map((item) => `<li>${item}</li>`).join('');
      return DOMPurify.sanitize(`<ul>${list}</ul>`);
    }
    return '';
  }, [hero.descriptionHtml, hero.highlights]);

  if (!hero.greeting) return null;

  return (
    <section
      id="summary"
      className="relative flex flex-col items-start gap-6 py-8 md:py-14 scroll-mt-8"
    >
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-[var(--accent-primary)] drop-shadow-lg">
        {hero.greeting}
      </h1>
      {hero.subtitle ? (
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[var(--accent-secondary)]">
          {hero.subtitle}
        </h2>
      ) : null}
      {descriptionHtml ? (
        <div
          className="max-w-2xl text-[var(--text-secondary)] text-lg mb-2 prose prose-invert"
          dangerouslySetInnerHTML={{ __html: descriptionHtml }}
        />
      ) : null}
      <div className="flex flex-wrap gap-4 mt-2">
        {hero.primaryButton ? (
          <a
            href={hero.primaryButton.href || '#contact'}
            className="inline-flex items-center px-6 py-3 rounded-lg font-semibold bg-[var(--accent-primary)] text-[var(--accent-contrast,#ffffff)] hover:opacity-90 shadow-md transition"
            onClick={(event) => {
              const href = hero.primaryButton?.href || '';
              if (href.startsWith('#')) {
                event.preventDefault();
                const target = document.querySelector(href);
                const container = document.querySelector('main');
                if (target instanceof HTMLElement && container instanceof HTMLElement) {
                  const rect = target.getBoundingClientRect();
                  const cRect = container.getBoundingClientRect();
                  const offset = rect.top - cRect.top + container.scrollTop - 12;
                  container.scrollTo({ top: offset, behavior: 'smooth' });
                }
              }
            }}
          >
            {hero.primaryButton.text?.trim() || 'Get in Touch'}{' '}
            <ArrowRight className="ml-2" size={20} />
          </a>
        ) : null}
        {hero.secondaryButton?.href ? (
          <a
            href={hero.secondaryButton.href}
            className="inline-flex items-center px-6 py-3 rounded-lg font-semibold border border-[var(--accent-secondary)] text-[var(--accent-secondary)] hover:bg-[var(--accent-secondary)] hover:text-white transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Download className="mr-2" size={20} />
            {hero.secondaryButton.text?.trim() || 'Download CV'}
          </a>
        ) : null}
        <Link
          href="/portfolio"
          className="inline-flex items-center px-6 py-3 rounded-lg font-semibold bg-[var(--accent-muted)] text-[var(--accent-secondary)] hover:bg-[var(--accent-secondary)] hover:text-black transition"
        >
          <FolderOpen className="mr-2" size={20} /> Portfolio
        </Link>
      </div>
    </section>
  );
}
