import { beforeEach, describe, expect, it, vi } from 'vitest';

import type Redis from 'ioredis';

vi.mock('@/lib/redis', () => ({
  getRedis: vi.fn(),
}));

import { getRedis } from '@/lib/redis';
import { isLoginRateLimited } from '@/lib/auth/rate-limit';

describe('isLoginRateLimited', () => {
  beforeEach(() => {
    vi.mocked(getRedis).mockReturnValue({
      incr: vi.fn().mockResolvedValue(1),
      expire: vi.fn().mockResolvedValue(1),
    } as unknown as Redis);
  });

  it('returns false when both counters under max', async () => {
    await expect(isLoginRateLimited('203.0.113.1', 'alice')).resolves.toBe(false);
  });

  it('returns true when ip counter exceeds max', async () => {
    const incr = vi.fn(async (key: string) => (key.includes(':ip:') ? 9 : 1));
    vi.mocked(getRedis).mockReturnValue({
      incr,
      expire: vi.fn().mockResolvedValue(1),
    } as unknown as Redis);
    await expect(isLoginRateLimited('203.0.113.1', 'alice')).resolves.toBe(true);
  });

  it('returns true when identifier counter exceeds max', async () => {
    const incr = vi.fn(async (key: string) => (key.includes(':identifier:') ? 9 : 1));
    vi.mocked(getRedis).mockReturnValue({
      incr,
      expire: vi.fn().mockResolvedValue(1),
    } as unknown as Redis);
    await expect(isLoginRateLimited('203.0.113.1', 'alice')).resolves.toBe(true);
  });

  it('normalizes identifier to lowercase for redis key', async () => {
    const incr = vi.fn().mockResolvedValue(1);
    vi.mocked(getRedis).mockReturnValue({
      incr,
      expire: vi.fn().mockResolvedValue(1),
    } as unknown as Redis);
    await isLoginRateLimited('1.1.1.1', '  User@Example.COM  ');
    const identifierKeys = incr.mock.calls
      .map((c) => c[0] as string)
      .filter((k) => k.includes(':identifier:'));
    expect(identifierKeys.some((k) => k.endsWith('user@example.com'))).toBe(true);
  });
});
