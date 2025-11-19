/**
 * Serializer utilities shared across domain transformers.
 */

export function formatYearMonth(value?: Date | string | null): string {
  if (!value) return '';

  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toISOString().slice(0, 7);
}
