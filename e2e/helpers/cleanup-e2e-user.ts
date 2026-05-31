import { prisma } from '@/lib/prisma';

export function assertE2EUsername(username: string) {
  if (!username.startsWith('e2e_')) {
    throw new Error('Refusing to delete non-e2e user.');
  }
}

export async function cleanupE2EUser(username: string) {
  assertE2EUsername(username);

  return prisma.user.deleteMany({
    where: { username },
  });
}
