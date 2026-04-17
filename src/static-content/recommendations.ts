import type { Recommendation } from '@/types/recommendation';

/**
 * Legacy static fallback recommendations.
 *
 * Public testimonials should be managed through seeded database content or the admin area rather
 * than shipping example endorsements in the repository.
 */
export const recommendations: Recommendation[] = [];
