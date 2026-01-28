import { describe, expect, it } from 'vitest';

import { formatYearMonth } from '@/server/serializers/utils';

describe('formatYearMonth', () => {
  it('formats Date inputs to YYYY-MM', () => {
    expect(formatYearMonth(new Date('2024-05-15T00:00:00Z'))).toBe('2024-05');
  });

  it('formats string inputs to YYYY-MM', () => {
    expect(formatYearMonth('2024-08-09T00:00:00Z')).toBe('2024-08');
  });

  it('returns empty string for invalid values', () => {
    expect(formatYearMonth('invalid')).toBe('');
    expect(formatYearMonth(null)).toBe('');
  });
});
