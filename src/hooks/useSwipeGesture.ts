import { useEffect, useRef } from 'react';

/**
 * Configuration options for the swipe gesture hook.
 */
export interface UseSwipeGestureOptions {
  /** Callback fired when a left swipe gesture (swipe left to go to next item) is detected */
  onSwipeLeft?: () => void;
  /** Callback fired when a right swipe gesture (swipe right to go to previous item) is detected */
  onSwipeRight?: () => void;
  /** Minimum pixel threshold required to trigger a swipe action (default: 50px) */
  threshold?: number;
  /** Whether gesture listening is active (default: true) */
  enabled?: boolean;
}

/**
 * Custom React hook that attaches touch swipe gesture listeners to an element ref.
 * Supports touch start/end horizontal delta calculation for touch devices.
 *
 * @param elementRef Ref pointing to the container element receiving touch events
 * @param options Swipe configuration callbacks and options
 *
 * @example
 * ```tsx
 * const containerRef = useRef<HTMLDivElement>(null);
 * useSwipeGesture(containerRef, {
 *   onSwipeLeft: () => console.log('Next slide'),
 *   onSwipeRight: () => console.log('Previous slide'),
 * });
 * ```
 */
export function useSwipeGesture<T extends HTMLElement>(
  elementRef: React.RefObject<T | null>,
  options: UseSwipeGestureOptions,
): void {
  const { onSwipeLeft, onSwipeRight, threshold = 50, enabled = true } = options;
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const element = elementRef.current;
    if (!element) return;

    /**
     * Record the starting coordinates of a touch interaction.
     */
    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) return;
      touchStartX.current = event.touches[0].clientX;
      touchStartY.current = event.touches[0].clientY;
    };

    /**
     * Calculate delta and fire appropriate swipe callback if threshold is exceeded.
     */
    const handleTouchEnd = (event: TouchEvent) => {
      if (touchStartX.current === null || touchStartY.current === null) return;
      if (event.changedTouches.length === 0) return;

      const touchEndX = event.changedTouches[0].clientX;
      const touchEndY = event.changedTouches[0].clientY;

      const deltaX = touchEndX - touchStartX.current;
      const deltaY = touchEndY - touchStartY.current;

      // Only trigger horizontal swipe if horizontal movement is larger than vertical movement
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) >= threshold) {
        if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft();
        } else if (deltaX > 0 && onSwipeRight) {
          onSwipeRight();
        }
      }

      // Reset touch tracking coordinates
      touchStartX.current = null;
      touchStartY.current = null;
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [elementRef, onSwipeLeft, onSwipeRight, threshold, enabled]);
}
