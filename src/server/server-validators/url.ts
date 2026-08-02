import { z } from 'zod';

/**
 * Accepts either an absolute URL (https://…, /feed paths are not URLs) or a
 * `/`-relative path such as an uploaded attachment path. Used for fields like
 * certificate URLs, recommendation letter links, and photos where the value may
 * be an external link (LinkedIn, PDF) or a path to an uploaded attachment.
 */
export const optionalUrlOrPathSchema = z
  .string()
  .trim()
  .refine(
    (value) => {
      if (!value) {
        return true;
      }
      if (value.startsWith('/')) {
        return true;
      }
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
    { message: 'Invalid URL format' },
  )
  .optional();
