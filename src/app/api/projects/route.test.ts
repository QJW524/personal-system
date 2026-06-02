import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/auth/request-session', () => ({
  getSessionFromRequest: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    project: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
}));

import { GET, POST } from '@/app/api/projects/route';
import { getSessionFromRequest } from '@/lib/auth/request-session';
import { prisma } from '@/lib/prisma';

describe('GET /api/projects', () => {
  it('returns 401 when session missing', async () => {
    vi.mocked(getSessionFromRequest).mockResolvedValueOnce(null);

    const res = await GET(new Request('http://localhost/api/projects'));

    expect(res.status).toBe(401);
    expect(vi.mocked(prisma.project.findMany)).not.toHaveBeenCalled();
  });

  it('returns 400 for an invalid status filter', async () => {
    vi.mocked(getSessionFromRequest).mockResolvedValueOnce({
      userId: 1,
      username: 'qiu',
      email: 'qiu@example.com',
    });

    const res = await GET(new Request('http://localhost/api/projects?status=ARCHIVED'));

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error?.code).toBe('VALIDATION_ERROR');
  });

  it('returns the authenticated user project list', async () => {
    vi.mocked(getSessionFromRequest).mockResolvedValueOnce({
      userId: 7,
      username: 'qiu',
      email: 'qiu@example.com',
    });
    vi.mocked(prisma.project.findMany).mockResolvedValueOnce([
      {
        id: 3,
        name: 'Project Workbench',
        status: 'ACTIVE',
        currentGoal: '',
        nextAction: '完成详情页',
        updatedAt: new Date('2026-06-01T09:00:00.000Z'),
        createdAt: new Date('2026-06-01T08:00:00.000Z'),
        userId: 7,
      },
    ] as never);

    const res = await GET(new Request('http://localhost/api/projects?status=ACTIVE'));

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.items).toHaveLength(1);
    expect(vi.mocked(prisma.project.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: 7, status: 'ACTIVE' },
      }),
    );
  });
});

describe('POST /api/projects', () => {
  it('returns 401 when session missing', async () => {
    vi.mocked(getSessionFromRequest).mockResolvedValueOnce(null);

    const res = await POST(
      new Request('http://localhost/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Project Workbench',
          status: 'ACTIVE',
          nextAction: '完成详情页',
        }),
      }),
    );

    expect(res.status).toBe(401);
  });

  it('returns 400 for an invalid payload', async () => {
    vi.mocked(getSessionFromRequest).mockResolvedValueOnce({
      userId: 7,
      username: 'qiu',
      email: 'qiu@example.com',
    });

    const res = await POST(
      new Request('http://localhost/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: '',
          status: 'ACTIVE',
          nextAction: '',
        }),
      }),
    );

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error?.code).toBe('VALIDATION_ERROR');
  });

  it('creates a project for the authenticated user', async () => {
    vi.mocked(getSessionFromRequest).mockResolvedValueOnce({
      userId: 7,
      username: 'qiu',
      email: 'qiu@example.com',
    });
    vi.mocked(prisma.project.create).mockResolvedValueOnce({
      id: 4,
      name: 'Project Workbench',
      status: 'ACTIVE',
      currentGoal: '',
      nextAction: '完成详情页',
      updatedAt: new Date('2026-06-01T09:00:00.000Z'),
      createdAt: new Date('2026-06-01T08:00:00.000Z'),
      userId: 7,
    } as never);

    const res = await POST(
      new Request('http://localhost/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Project Workbench',
          status: 'ACTIVE',
          nextAction: '完成详情页',
        }),
      }),
    );

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.item.name).toBe('Project Workbench');
    expect(vi.mocked(prisma.project.create)).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: 7,
          name: 'Project Workbench',
          status: 'ACTIVE',
          nextAction: '完成详情页',
        }),
      }),
    );
  });
});
