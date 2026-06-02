import { prisma } from '@/lib/prisma';
import type { ProjectStatusInput } from '@/lib/validators/projects';

export async function listProjectsForUser(userId: number, status?: ProjectStatusInput) {
  return prisma.project.findMany({
    where: {
      userId,
      ...(status ? { status } : {}),
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });
}

export async function getProjectDashboard(userId: number) {
  const items = await listProjectsForUser(userId);
  const counts: Record<ProjectStatusInput, number> = {
    IDEA: 0,
    ACTIVE: 0,
    PAUSED: 0,
    DONE: 0,
  };

  for (const item of items) {
    counts[item.status] += 1;
  }

  const recentUpdates = await prisma.projectUpdate.findMany({
    where: {
      project: {
        userId,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 5,
    include: {
      project: {
        select: {
          id: true,
          name: true,
          status: true,
        },
      },
    },
  });

  return {
    items,
    counts,
    recentUpdates,
  };
}

export async function getProjectDetailForUser(userId: number, projectId: number) {
  return prisma.project.findFirst({
    where: {
      id: projectId,
      userId,
    },
    include: {
      updates: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });
}
