import { afterEach, describe, expect, it, vi } from 'vitest';

import { getSessionCookieOptions } from '@/lib/auth/cookies';

describe('getSessionCookieOptions', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('forces secure when SESSION_COOKIE_SECURE is true', () => {
    vi.stubEnv('SESSION_COOKIE_SECURE', 'true');
    const opts = getSessionCookieOptions();
    expect(opts.secure).toBe(true);
    expect(opts.httpOnly).toBe(true);
    expect(opts.sameSite).toBe('lax');
    expect(opts.path).toBe('/');
  });

  it('disables secure when SESSION_COOKIE_SECURE is false', () => {
    vi.stubEnv('SESSION_COOKIE_SECURE', 'false');
    expect(getSessionCookieOptions().secure).toBe(false);
  });

  it('detects https from x-forwarded-proto', () => {
    const req = new Request('http://internal/', {
      headers: { 'x-forwarded-proto': 'https, http' },
    });
    expect(getSessionCookieOptions(req).secure).toBe(true);
  });

  it('uses request url protocol when no forwarded proto', () => {
    const req = new Request('https://example.com/');
    expect(getSessionCookieOptions(req).secure).toBe(true);
  });

  it('respects custom maxAge', () => {
    expect(getSessionCookieOptions(undefined, { maxAge: 60 }).maxAge).toBe(60);
  });
});
