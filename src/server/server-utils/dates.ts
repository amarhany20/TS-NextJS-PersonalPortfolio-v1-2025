/**
 * Date parsing helpers for server-side data transforms.
 */

const YEAR_MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;

export function parseYearMonth(value?: string | null): Date | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  if (!YEAR_MONTH_PATTERN.test(trimmed)) {
    return null;
  }

  return new Date(`${trimmed}-01T00:00:00Z`);
}

export function parseISODate(value?: string | null): Date | null {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
}

export function nullIfEmpty(value?: string | null): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}
