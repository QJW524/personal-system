import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/auth/request-session', () => ({
  getSessionFromRequest: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    project: {
      findFirst: vi.fn(),
      updateMany: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

import { GET, PATCH } from '@/app/api/projects/[id]/route';
import { getSessionFromRequest } from '@/lib/auth/request-session';
import { prisma } from '@/lib/prisma';

describe('GET /api/projects/[id]', () => {
  it('returns 401 when session missing', async () => {
    vi.mocked(getSessionFromRequest).mockResolvedValueOnce(null);

    const res = await GET(new Request('http://localhost/api/projects/2'), {
      params: Promise.resolve({ id: '2' }),
    });

    expect(res.status).toBe(401);
  });

  it('returns 404 when project missing or unowned', async () => {
    vi.mocked(getSessionFromRequest).mockResolvedValueOnce({
      userId: 3,
      username: 'qiu',
      email: 'qiu@example.com',
    });
    vi.mocked(prisma.project.findFirst).mockResolvedValueOnce(null);

    const res = await GET(new Request('http://localhost/api/projects/2'), {
      params: Promise.resolve({ id: '2' }),
    });

    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error?.code).toBe('NOT_FOUND');
  });
});

describe('PATCH /api/projects/[id]', () => {
  it('returns 400 for an invalid project id', async () => {
    vi.mocked(getSessionFromRequest).mockResolvedValueOnce({
      userId: 3,
      username: 'qiu',
      email: 'qiu@example.com',
    });

    const res = await PATCH(
      new Request('http://localhost/api/projects/abc', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Project Workbench',
          status: 'ACTIVE',
          currentGoal: '明确目标',
          nextAction: '补详情页',
        }),
      }),
      {
        params: Promise.resolve({ id: 'abc' }),
      },
    );

    expect(res.status).toBe(400);
  });

  it('returns 400 for an invalid overview payload', async () => {
    vi.mocked(getSessionFromRequest).mockResolvedValueOnce({
      userId: 3,
      username: 'qiu',
      email: 'qiu@example.com',
    });

    const res = await PATCH(
      new Request('http://localhost/api/projects/2', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: '',
          status: 'ACTIVE',
          currentGoal: '',
          nextAction: '',
        }),
      }),
      {
        params: Promise.resolve({ id: '2' }),
      },
    );

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error?.code).toBe('VALIDATION_ERROR');
  });

  it('returns 404 when the update target is missing or unowned', async () => {
    vi.mocked(getSessionFromRequest).mockResolvedValueOnce({
      userId: 3,
      username: 'qiu',
      email: 'qiu@example.com',
    });
    vi.mocked(prisma.project.updateMany).mockResolvedValueOnce({ count: 0 } as never);

    const res = await PATCH(
      new Request('http://localhost/api/projects/2', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Project Workbench',
          status: 'ACTIVE',
          currentGoal: '明确目标',
          nextAction: '补详情页',
        }),
      }),
      {
        params: Promise.resolve({ id: '2' }),
      },
    );

    expect(res.status).toBe(404);
  });

  it('updates and returns the latest project overview', async () => {
    vi.mocked(getSessionFromRequest).mockResolvedValueOnce({
      userId: 3,
      username: 'qiu',
      email: 'qiu@example.com',
    });
    vi.mocked(prisma.project.updateMany).mockResolvedValueOnce({ count: 1 } as never);
    vi.mocked(prisma.project.findUnique).mockResolvedValueOnce({
      id: 2,
      userId: 3,
      name: 'Project Workbench',
      status: 'ACTIVE',
      currentGoal: '明确目标',
      nextAction: '补详情页',
      createdAt: new Date('2026-06-01T08:00:00.000Z'),
      updatedAt: new Date('2026-06-01T09:00:00.000Z'),
    } as never);

    const res = await PATCH(
      new Request('http://localhost/api/projects/2', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Project Workbench',
          status: 'ACTIVE',
          currentGoal: '明确目标',
          nextAction: '补详情页',
        }),
      }),
      {
        params: Promise.resolve({ id: '2' }),
      },
    );

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.item.id).toBe(2);
  });
});
