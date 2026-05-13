import { describe, expect, it } from 'vitest';

import { parsePositiveIntRecordId } from '@/lib/highlights/parse-record-id';

describe('parsePositiveIntRecordId', () => {
  it('parses positive integers', () => {
    expect(parsePositiveIntRecordId('42')).toBe(42);
  });

  it('rejects zero', () => {
    expect(parsePositiveIntRecordId('0')).toBeNull();
  });

  it('rejects negative', () => {
    expect(parsePositiveIntRecordId('-1')).toBeNull();
  });

  it('rejects float', () => {
    expect(parsePositiveIntRecordId('3.5')).toBeNull();
  });

  it('rejects non-numeric', () => {
    expect(parsePositiveIntRecordId('abc')).toBeNull();
  });
});
