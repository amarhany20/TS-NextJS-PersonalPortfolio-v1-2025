import { describe, expect, it } from 'vitest';
import type { ProjectGalleryItem } from '@/types/portfolio';

/**
 * Calculates the wrapped previous index for gallery navigation.
 */
export function getPreviousIndex(currentIndex: number, total: number): number {
  if (total <= 0) return 0;
  return (currentIndex - 1 + total) % total;
}

/**
 * Calculates the wrapped next index for gallery navigation.
 */
export function getNextIndex(currentIndex: number, total: number): number {
  if (total <= 0) return 0;
  return (currentIndex + 1) % total;
}

/**
 * Clamps an index within safe bounds [0, total - 1].
 */
export function clampIndex(index: number, total: number): number {
  if (total <= 0) return 0;
  return Math.max(0, Math.min(index, total - 1));
}

describe('Portfolio Lightbox Navigation & Index Logic', () => {
  const sampleItems: ProjectGalleryItem[] = [
    { id: '1', image: '/img1.jpg', title: 'Image 1' },
    { id: '2', image: '/img2.jpg', title: 'Image 2' },
    { id: '3', image: '/img3.jpg', title: 'Image 3' },
  ];

  describe('getNextIndex', () => {
    it('advances to the next item index', () => {
      expect(getNextIndex(0, sampleItems.length)).toBe(1);
      expect(getNextIndex(1, sampleItems.length)).toBe(2);
    });

    it('wraps around to 0 when reaching the end of the gallery', () => {
      expect(getNextIndex(2, sampleItems.length)).toBe(0);
    });

    it('handles single item galleries', () => {
      expect(getNextIndex(0, 1)).toBe(0);
    });

    it('returns 0 when total is 0', () => {
      expect(getNextIndex(0, 0)).toBe(0);
    });
  });

  describe('getPreviousIndex', () => {
    it('moves to the previous item index', () => {
      expect(getPreviousIndex(2, sampleItems.length)).toBe(1);
      expect(getPreviousIndex(1, sampleItems.length)).toBe(0);
    });

    it('wraps around to the last index when at index 0', () => {
      expect(getPreviousIndex(0, sampleItems.length)).toBe(2);
    });

    it('handles single item galleries', () => {
      expect(getPreviousIndex(0, 1)).toBe(0);
    });
  });

  describe('clampIndex', () => {
    it('keeps valid indices unchanged', () => {
      expect(clampIndex(1, 3)).toBe(1);
    });

    it('clamps negative numbers to 0', () => {
      expect(clampIndex(-5, 3)).toBe(0);
    });

    it('clamps out-of-bounds upper indices to total - 1', () => {
      expect(clampIndex(10, 3)).toBe(2);
    });
  });
});
