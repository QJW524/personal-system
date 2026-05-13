import { describe, expect, it } from 'vitest';

import { normalizeLoginIdentifier } from '@/lib/auth/login-identifier';

describe('normalizeLoginIdentifier', () => {
  it('lowercases email-like identifiers', () => {
    expect(normalizeLoginIdentifier('User@Example.COM')).toBe('user@example.com');
  });

  it('preserves username case when no @', () => {
    expect(normalizeLoginIdentifier('Alice')).toBe('Alice');
  });
});
