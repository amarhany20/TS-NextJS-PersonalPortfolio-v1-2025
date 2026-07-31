'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Maximize2 } from 'lucide-react';
import type { Project, ProjectGalleryItem } from '@/types/portfolio';
import { PortfolioLightbox } from '@/components/UI/PortfolioLightbox';

interface AccordionItemProps {
  item: ProjectGalleryItem;
  open: boolean;
  onToggle: () => void;
  onOpenLightbox: () => void;
}

/**
 * Single Accordion Item displaying gallery item title, image thumbnail, and fullscreen trigger button.
 */
function AccordionItem({ item, open, onToggle, onOpenLightbox }: AccordionItemProps) {
  return (
    <div className="border border-[var(--border)] rounded-md overflow-hidden bg-[var(--card-bg)]">
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[var(--border)]/20 transition cursor-pointer"
      >
        <span className="text-sm font-medium text-foreground">{item.title || 'Image'}</span>
        <span className="text-[10px] text-[var(--text-secondary)] font-mono">
          {open ? 'Hide' : 'Show'}
        </span>
      </button>

      {open ? (
        <div className="p-3">
          <div className="relative w-full overflow-x-auto flex gap-4 snap-x">
            <div className="flex gap-4">
              <figure className="group relative flex-shrink-0 snap-center w-[320px] sm:w-[400px] md:w-[480px]">
                {/* Clickable Image Container triggering Lightbox */}
                <button
                  type="button"
                  onClick={onOpenLightbox}
                  aria-label={`View ${item.title || item.alt || 'project image'} in fullscreen lightbox`}
                  className="relative block w-full rounded-md overflow-hidden border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                >
                  <Image
                    src={item.image}
                    alt={item.alt || item.title || 'Project image'}
                    width={1200}
                    height={800}
                    className="object-cover w-full h-auto transition-transform duration-300 group-hover:scale-102"
                  />
                  {/* Fullscreen hover overlay indicator */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-medium text-xs sm:text-sm">
                    <Maximize2 className="w-5 h-5" />
                    <span>View Fullscreen</span>
                  </div>
                </button>

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

/**
 * ProjectGallery Component
 *
 * Renders an accessible gallery accordion for portfolio project detail views,
 * backed by a responsive, touch-friendly fullscreen Lightbox modal.
 *
 * @param props Project object containing gallery items
 */
export function ProjectGallery({ project }: { project: Project }): React.JSX.Element | null {
  const gallery = project.gallery || [];
  const [openAccordionId, setOpenAccordionId] = useState<string | null>(gallery[0]?.id || null);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);

  if (!gallery.length) return null;

  /**
   * Open the fullscreen lightbox at a specific item index.
   */
  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Gallery</h3>
        <button
          type="button"
          onClick={() => handleOpenLightbox(0)}
          className="text-xs text-primary hover:underline font-medium flex items-center gap-1 cursor-pointer"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Open Lightbox ({gallery.length})</span>
        </button>
      </div>

      <div className="space-y-2">
        {gallery.map((item, index) => (
          <AccordionItem
            key={item.id || index}
            item={item}
            open={openAccordionId === item.id}
            onToggle={() => setOpenAccordionId((prev) => (prev === item.id ? null : item.id))}
            onOpenLightbox={() => handleOpenLightbox(index)}
          />
        ))}
      </div>

      {/* Fullscreen accessible Lightbox Modal */}
      <PortfolioLightbox
        images={gallery}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onSelectIndex={(index) => setLightboxIndex(index)}
      />
    </div>
  );
}
