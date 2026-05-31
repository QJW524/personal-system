import { beforeEach, describe, expect, it, vi } from 'vitest';

const { deleteManyMock } = vi.hoisted(() => ({
  deleteManyMock: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      deleteMany: deleteManyMock,
    },
  },
}));

import { cleanupE2EUser } from './cleanup-e2e-user';

describe('cleanupE2EUser', () => {
  beforeEach(() => {
    deleteManyMock.mockReset();
    deleteManyMock.mockResolvedValue({ count: 1 });
  });

  it('rejects usernames without the e2e_ prefix before deleting', async () => {
    await expect(cleanupE2EUser('qiu')).rejects.toThrow('Refusing to delete non-e2e user.');
    expect(deleteManyMock).not.toHaveBeenCalled();
  });

  it('deletes only the exact temporary e2e user', async () => {
    await cleanupE2EUser('e2e_demo_user');
    expect(deleteManyMock).toHaveBeenCalledWith({
      where: { username: 'e2e_demo_user' },
    });
  });
});
