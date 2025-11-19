/**
 * Safe JSON parsing helpers for string-backed columns.
 */

export function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Failed to parse JSON column', error);
    }
    return fallback;
  }
}
