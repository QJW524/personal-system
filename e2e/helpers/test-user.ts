import { randomUUID } from 'crypto';

export type E2ETestUser = {
  username: string;
  email: string;
  password: string;
};

export function createE2ETestUser(): E2ETestUser {
  const suffix = randomUUID().replace(/-/g, '').slice(0, 12);

  return {
    username: `e2e_${suffix}`,
    email: `e2e_${suffix}@example.com`,
    password: `Pass_${suffix}_123`,
  };
}
