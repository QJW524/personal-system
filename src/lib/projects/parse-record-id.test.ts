import { describe, expect, it } from 'vitest';

import { parsePositiveProjectId } from '@/lib/projects/parse-record-id';

describe('parsePositiveProjectId', () => {
  it('parses a positive integer id', () => {
    expect(parsePositiveProjectId('42')).toBe(42);
  });

  it('rejects zero, negative, and non-integer values', () => {
    expect(parsePositiveProjectId('0')).toBeNull();
    expect(parsePositiveProjectId('-1')).toBeNull();
    expect(parsePositiveProjectId('1.5')).toBeNull();
  });

  it('rejects non-numeric values', () => {
    expect(parsePositiveProjectId('abc')).toBeNull();
  });
});
