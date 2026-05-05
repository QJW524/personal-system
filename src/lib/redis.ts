import Redis from 'ioredis';

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

export function getRedis() {
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    throw new Error('Missing REDIS_URL in environment variables.');
  }

  if (globalForRedis.redis) {
    return globalForRedis.redis;
  }

  const client = new Redis(redisUrl, {
    maxRetriesPerRequest: 2,
    enableReadyCheck: true,
    lazyConnect: true,
  });

  client.on('error', (error) => {
    console.error('Redis connection error', error);
  });

  globalForRedis.redis = client;
  return client;
}
