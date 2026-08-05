'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { ProjectGalleryItem } from '@/types/portfolio';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';

/**
 * Props for the PortfolioLightbox component.
 */
export interface PortfolioLightboxProps {
  /** Array of gallery items to display in the lightbox */
  images: ProjectGalleryItem[];
  /** Index of the currently active image */
  currentIndex: number;
  /** Whether the lightbox modal is visible */
  isOpen: boolean;
  /** Callback fired when the lightbox is closed */
  onClose: () => void;
  /** Callback fired when navigating to a specific image index */
  onSelectIndex: (index: number) => void;
}

/**
 * PortfolioLightbox Component
 *
 * Fullscreen modal component providing accessible, touch-friendly image viewing
 * for portfolio project galleries. Includes keyboard navigation (Arrow keys, Escape),
 * mobile swipe gesture support, focus trapping, and ARIA accessibility attributes.
 *
 * @param props Lightbox configuration, image list, active index, and event handlers
 */
export function PortfolioLightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onSelectIndex,
}: PortfolioLightboxProps): React.JSX.Element | null {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Validate current index bounds safely
  const safeIndex = Math.max(0, Math.min(currentIndex, images.length - 1));
  const activeItem = images[safeIndex];

  /**
   * Navigate to the previous image in the gallery (wraps around).
   */
  const handlePrevious = useCallback(() => {
    if (images.length <= 1) return;
    const nextIndex = (safeIndex - 1 + images.length) % images.length;
    onSelectIndex(nextIndex);
  }, [safeIndex, images.length, onSelectIndex]);

  /**
   * Navigate to the next image in the gallery (wraps around).
   */
  const handleNext = useCallback(() => {
    if (images.length <= 1) return;
    const nextIndex = (safeIndex + 1) % images.length;
    onSelectIndex(nextIndex);
  }, [safeIndex, images.length, onSelectIndex]);

  // Attach mobile swipe gesture handling
  useSwipeGesture(modalRef, {
    onSwipeLeft: handleNext,
    onSwipeRight: handlePrevious,
    enabled: isOpen && images.length > 1,
  });

  // Handle keyboard navigation shortcuts (Escape, ArrowLeft, ArrowRight)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          onClose();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          handlePrevious();
          break;
        case 'ArrowRight':
          event.preventDefault();
          handleNext();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handlePrevious, handleNext]);

  // Lock body scroll and focus close button when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus close button on open for keyboard accessibility
    setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen || !activeItem) {
    return null;
  }

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery lightbox"
      className="fixed inset-0 z-50 flex flex-col justify-between bg-black/90 backdrop-blur-md p-4 sm:p-6 text-white transition-opacity animate-in fade-in duration-200"
    >
      {/* Header bar: Counter + Title + Close Button */}
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto z-10 py-2">
        <div className="flex items-center gap-3">
          <span className="text-xs sm:text-sm font-medium tracking-wide text-white/70 bg-white/10 px-3 py-1 rounded-full">
            {safeIndex + 1} / {images.length}
          </span>
          <h4 className="text-sm sm:text-base font-semibold truncate max-w-[200px] sm:max-w-md">
            {activeItem.title || 'Gallery Image'}
          </h4>
        </div>

        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close lightbox"
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Main Image Stage + Navigation Controls */}
      <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden select-none">
        {/* Previous Image Button */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={handlePrevious}
            aria-label="Previous image"
            className="absolute left-2 sm:left-6 z-20 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white/90 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
        )}

        {/* Active Image Container */}
        <div className="relative max-w-5xl max-h-[75vh] w-full h-full flex flex-col items-center justify-center p-2">
          <Image
            src={activeItem.image}
            alt={activeItem.alt || activeItem.title || `Gallery image ${safeIndex + 1}`}
            width={1600}
            height={1000}
            priority
            className="object-contain max-h-[70vh] w-auto h-auto rounded-lg shadow-2xl transition-all duration-300"
          />

          {/* Optional Caption/Alt text */}
          {activeItem.alt && (
            <p className="mt-3 text-xs sm:text-sm text-white/80 text-center max-w-2xl px-4 py-1 bg-black/40 rounded-md backdrop-blur-sm">
              {activeItem.alt}
            </p>
          )}
        </div>

        {/* Next Image Button */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next image"
            className="absolute right-2 sm:right-6 z-20 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white/90 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
        )}
      </div>

      {/* Footer Thumbnail Navigation Strip */}
      {images.length > 1 && (
        <div className="flex items-center justify-center gap-2 max-w-4xl mx-auto py-2 overflow-x-auto w-full px-4">
          {images.map((item, idx) => (
            <button
              key={item.id || idx}
              type="button"
              onClick={() => onSelectIndex(idx)}
              aria-label={`View image ${idx + 1}: ${item.title || 'Thumbnail'}`}
              className={`relative flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-md overflow-hidden border-2 transition-all ${
                idx === safeIndex
                  ? 'border-white scale-105 opacity-100 ring-2 ring-white/30'
                  : 'border-transparent opacity-50 hover:opacity-80'
              }`}
            >
              <Image
                src={item.image}
                alt={item.alt || item.title || `Thumbnail ${idx + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Screen reader live announcement for active image changes */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Showing image {safeIndex + 1} of {images.length}:{' '}
        {activeItem.title || activeItem.alt || 'Gallery image'}
      </div>
    </div>
  );
}
