import { describe, expect, it } from 'vitest';

import { loginSchema, registerSchema } from '@/lib/validators/auth';

describe('loginSchema', () => {
  it('accepts username identifier', () => {
    const r = loginSchema.safeParse({
      identifier: 'alice',
      password: 'password1',
    });
    expect(r.success).toBe(true);
  });

  it('accepts email identifier', () => {
    const r = loginSchema.safeParse({
      identifier: 'a@b.co',
      password: 'password1',
    });
    expect(r.success).toBe(true);
  });

  it('rejects empty identifier', () => {
    const r = loginSchema.safeParse({
      identifier: '   ',
      password: 'password1',
    });
    expect(r.success).toBe(false);
  });
});

describe('registerSchema', () => {
  it('parses valid payload and lowercases email', () => {
    const r = registerSchema.safeParse({
      username: 'alice',
      email: 'Alice@Example.com',
      password: 'password1',
    });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.email).toBe('alice@example.com');
    }
  });

  it('rejects username shorter than 3 chars', () => {
    const r = registerSchema.safeParse({
      username: 'ab',
      email: 'a@b.co',
      password: 'password1',
    });
    expect(r.success).toBe(false);
  });
});
