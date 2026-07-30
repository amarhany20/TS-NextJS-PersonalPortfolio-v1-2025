'use client';
import React from 'react';
import type { Project, ProjectGalleryItem } from '@/types/portfolio';
import Image from 'next/image';

interface AccordionItemProps {
  item: ProjectGalleryItem;
  open: boolean;
  onToggle: () => void;
}

// Simple accessible accordion + horizontally scrollable gallery per item
function AccordionItem({ item, open, onToggle }: AccordionItemProps) {
  return (
    <div className="border border-[var(--border)] rounded-md overflow-hidden bg-[var(--card-bg)]">
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[var(--border)]/20 transition"
      >
        <span className="text-sm font-medium text-foreground">{item.title || 'Image'}</span>
        <span className="text-[10px] text-[var(--text-secondary)]">{open ? 'Hide' : 'Show'}</span>
      </button>
      {open ? (
        <div className="p-3">
          <div className="relative w-full overflow-x-auto flex gap-4 snap-x">
            <div className="flex gap-4">
              <figure className="flex-shrink-0 snap-center w-[320px] sm:w-[400px] md:w-[480px]">
                <Image
                  src={item.image}
                  alt={item.alt || item.title || 'Project image'}
                  width={1200}
                  height={800}
                  className="rounded-md border border-[var(--border)] object-cover w-full h-auto"
                />
                {item.alt ? (
                  <figcaption className="mt-2 text-sm text-[var(--text-secondary)]">
                    {item.alt}
                  </figcaption>
                ) : null}
              </figure>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function ProjectGallery({ project }: { project: Project }) {
  const gallery = project.gallery || [];
  const [open, setOpen] = React.useState<string | null>(gallery[0]?.id || null);
  if (!gallery.length) return null;
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Gallery</h3>
      <div className="space-y-2">
        {gallery.map((g) => (
          <AccordionItem
            key={g.id}
            item={g}
            open={open === g.id}
            onToggle={() => setOpen((o) => (o === g.id ? null : g.id))}
          />
        ))}
      </div>
    </div>
  );
}
