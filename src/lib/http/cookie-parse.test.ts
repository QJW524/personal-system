import { describe, expect, it } from 'vitest';

import { getCookieValue } from '@/lib/http/cookie-parse';

describe('getCookieValue', () => {
  it('returns null when header missing', () => {
    expect(getCookieValue(null, 'sid')).toBeNull();
  });

  it('returns value for first matching name', () => {
    expect(getCookieValue('a=1; sid=abc123; b=2', 'sid')).toBe('abc123');
  });

  it('trims segments', () => {
    expect(getCookieValue('other=1;  sid=xyz  ', 'sid')).toBe('xyz');
  });

  it('returns null when name absent', () => {
    expect(getCookieValue('foo=bar', 'sid')).toBeNull();
  });
});
