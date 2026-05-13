import { beforeEach, describe, expect, it, vi } from 'vitest';

import type Redis from 'ioredis';

vi.mock('@/lib/redis', () => ({
  getRedis: vi.fn(),
}));

import { getRedis } from '@/lib/redis';
import {
  createSession,
  deleteSession,
  generateSessionId,
  getSession,
  rotateSession,
} from '@/lib/auth/session';

function createRedisStub() {
  const store = new Map<string, string>();
  return {
    incr: vi.fn(),
    expire: vi.fn().mockResolvedValue(1),
    get: vi.fn((key: string) => Promise.resolve(store.get(key) ?? null)),
    set: vi.fn((key: string, val: string) => {
      store.set(key, val);
      return Promise.resolve('OK');
    }),
    del: vi.fn((key: string) => {
      const existed = store.delete(key);
      return Promise.resolve(existed ? 1 : 0);
    }),
    _store: store,
  };
}

describe('session', () => {
  beforeEach(() => {
    vi.mocked(getRedis).mockReturnValue(createRedisStub() as unknown as Redis);
  });

  it('generateSessionId returns 64-char hex', () => {
    const id = generateSessionId();
    expect(id).toMatch(/^[0-9a-f]{64}$/);
  });

  it('getSession returns null for missing key', async () => {
    await expect(getSession('nonexistent')).resolves.toBeNull();
  });

  it('getSession returns payload for valid json', async () => {
    const sid = await createSession({
      userId: 7,
      username: 'bob',
      email: 'bob@example.com',
    });
    await expect(getSession(sid)).resolves.toEqual({
      userId: 7,
      username: 'bob',
      email: 'bob@example.com',
    });
  });

  it('getSession returns null for invalid json', async () => {
    const stub = createRedisStub();
    stub._store.set('auth:session:badid', '{bad');
    vi.mocked(getRedis).mockReturnValue(stub as unknown as Redis);
    await expect(getSession('badid')).resolves.toBeNull();
  });

  it('deleteSession removes key', async () => {
    const sid = await createSession({
      userId: 1,
      username: 'a',
      email: 'a@b.co',
    });
    await deleteSession(sid);
    await expect(getSession(sid)).resolves.toBeNull();
  });

  it('rotateSession returns new id and invalidates old', async () => {
    const oldId = await createSession({
      userId: 2,
      username: 'c',
      email: 'c@d.co',
    });
    const newId = await rotateSession(oldId, {
      userId: 2,
      username: 'c2',
      email: 'c2@d.co',
    });
    expect(newId).not.toBe(oldId);
    await expect(getSession(oldId)).resolves.toBeNull();
    await expect(getSession(newId)).resolves.toMatchObject({
      username: 'c2',
      email: 'c2@d.co',
    });
  });
});
