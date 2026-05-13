import { afterEach, describe, expect, it, vi } from 'vitest';

describe('getRedis', () => {
  const prevUrl = process.env.REDIS_URL;

  afterEach(() => {
    if (prevUrl === undefined) {
      delete process.env.REDIS_URL;
    } else {
      process.env.REDIS_URL = prevUrl;
    }
    vi.resetModules();
  });

  it('throws when REDIS_URL is not set', async () => {
    delete process.env.REDIS_URL;
    vi.resetModules();
    const { getRedis } = await import('@/lib/redis');
    expect(() => getRedis()).toThrow('Missing REDIS_URL');
  });
});
