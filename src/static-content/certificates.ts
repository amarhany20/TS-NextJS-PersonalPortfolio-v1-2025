import type { Certificate } from '@/types/certificate';

/**
 * Legacy static fallback certificates.
 *
 * Launch content should come from the seeded database and admin CMS. Keep this empty so repo-level
 * template data does not leak example credentials into public surfaces.
 */
export const certificates: Certificate[] = [];
