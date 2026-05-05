import { randomBytes } from 'crypto';
import { getRedis } from '@/lib/redis';

type SessionPayload = {
  userId: number;
  username: string;
  email: string;
};

const SESSION_PREFIX = 'auth:session:';
const SESSION_TTL_SECONDS = Number(process.env.SESSION_TTL_SECONDS ?? 7 * 24 * 60 * 60);

function getSessionKey(sessionId: string) {
  return `${SESSION_PREFIX}${sessionId}`;
}

export function generateSessionId() {
  return randomBytes(32).toString('hex');
}

export async function createSession(payload: SessionPayload) {
  const redis = getRedis();
  const sessionId = generateSessionId();
  await redis.set(getSessionKey(sessionId), JSON.stringify(payload), 'EX', SESSION_TTL_SECONDS);
  return sessionId;
}

export async function getSession(sessionId: string) {
  const redis = getRedis();
  const raw = await redis.get(getSessionKey(sessionId));
  if (!raw) {
    return null;
  }

  try {
    const payload = JSON.parse(raw) as SessionPayload;
    return payload;
  } catch {
    return null;
  }
}

export async function deleteSession(sessionId: string) {
  const redis = getRedis();
  await redis.del(getSessionKey(sessionId));
}

export async function rotateSession(sessionId: string, payload: SessionPayload) {
  await deleteSession(sessionId);
  return createSession(payload);
}

export function getSessionTtlSeconds() {
  return SESSION_TTL_SECONDS;
}
