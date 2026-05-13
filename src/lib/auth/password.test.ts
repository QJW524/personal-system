import { describe, expect, it } from 'vitest';

import { hashPassword, verifyPassword } from '@/lib/auth/password';

describe('password', () => {
  it('verifyPassword succeeds after hashPassword', async () => {
    const plain = 'correct-horse-battery-staple';
    const hash = await hashPassword(plain);
    expect(hash).not.toBe(plain);
    await expect(verifyPassword(plain, hash)).resolves.toBe(true);
  });

  it('verifyPassword fails for wrong password', async () => {
    const hash = await hashPassword('secret-one');
    await expect(verifyPassword('secret-two', hash)).resolves.toBe(false);
  });
});
