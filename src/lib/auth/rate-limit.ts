import { getRedis } from '@/lib/redis';

const WINDOW_SECONDS = 10 * 60;
const MAX_ATTEMPTS = 8;
const KEY_PREFIX = 'auth:ratelimit:login';

function createKey(scope: 'ip' | 'identifier', value: string) {
  return `${KEY_PREFIX}:${scope}:${value}`;
}

async function hit(key: string) {
  const redis = getRedis();
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, WINDOW_SECONDS);
  }
  return count;
}

export async function isLoginRateLimited(ip: string, identifier: string) {
  const normalizedIdentifier = identifier.trim().toLowerCase();
  const ipCount = await hit(createKey('ip', ip));
  const identifierCount = await hit(createKey('identifier', normalizedIdentifier));
  return ipCount > MAX_ATTEMPTS || identifierCount > MAX_ATTEMPTS;
}
