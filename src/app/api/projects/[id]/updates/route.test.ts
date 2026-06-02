import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/auth/request-session', () => ({
  getSessionFromRequest: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    project: {
      findFirst: vi.fn(),
    },
    projectUpdate: {
      create: vi.fn(),
    },
  },
}));

import { POST } from '@/app/api/projects/[id]/updates/route';
import { getSessionFromRequest } from '@/lib/auth/request-session';
import { prisma } from '@/lib/prisma';

describe('POST /api/projects/[id]/updates', () => {
  it('returns 401 when session missing', async () => {
    vi.mocked(getSessionFromRequest).mockResolvedValueOnce(null);

    const res = await POST(
      new Request('http://localhost/api/projects/2/updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: '新增一条更新' }),
      }),
      {
        params: Promise.resolve({ id: '2' }),
      },
    );

    expect(res.status).toBe(401);
  });

  it('returns 400 for a blank update entry', async () => {
    vi.mocked(getSessionFromRequest).mockResolvedValueOnce({
      userId: 3,
      username: 'qiu',
      email: 'qiu@example.com',
    });

    const res = await POST(
      new Request('http://localhost/api/projects/2/updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: '   ' }),
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

  it('returns 404 when target project missing or unowned', async () => {
    vi.mocked(getSessionFromRequest).mockResolvedValueOnce({
      userId: 3,
      username: 'qiu',
      email: 'qiu@example.com',
    });
    vi.mocked(prisma.project.findFirst).mockResolvedValueOnce(null);

    const res = await POST(
      new Request('http://localhost/api/projects/2/updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: '新增一条更新' }),
      }),
      {
        params: Promise.resolve({ id: '2' }),
      },
    );

    expect(res.status).toBe(404);
  });

  it('creates a chronological update entry', async () => {
    vi.mocked(getSessionFromRequest).mockResolvedValueOnce({
      userId: 3,
      username: 'qiu',
      email: 'qiu@example.com',
    });
    vi.mocked(prisma.project.findFirst).mockResolvedValueOnce({
      id: 2,
      userId: 3,
    } as never);
    vi.mocked(prisma.projectUpdate.create).mockResolvedValueOnce({
      id: 5,
      projectId: 2,
      content: '新增一条更新',
      createdAt: new Date('2026-06-01T09:00:00.000Z'),
      updatedAt: new Date('2026-06-01T09:00:00.000Z'),
    } as never);

    const res = await POST(
      new Request('http://localhost/api/projects/2/updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: '新增一条更新' }),
      }),
      {
        params: Promise.resolve({ id: '2' }),
      },
    );

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.item.id).toBe(5);
  });
});
