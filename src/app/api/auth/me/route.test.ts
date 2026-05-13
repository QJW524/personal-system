import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/auth/session', () => ({
  getSession: vi.fn(),
}));

import { GET } from '@/app/api/auth/me/route';
import { getSession } from '@/lib/auth/session';

describe('GET /api/auth/me', () => {
  it('returns 401 when cookie missing', async () => {
    const res = await GET(new Request('http://localhost/api/auth/me'));
    expect(res.status).toBe(401);
    expect(getSession).not.toHaveBeenCalled();
  });

  it('returns 401 when session id invalid in redis', async () => {
    vi.mocked(getSession).mockResolvedValueOnce(null);
    const res = await GET(
      new Request('http://localhost/api/auth/me', {
        headers: { cookie: 'ps_session=expired' },
      }),
    );
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error?.code).toBe('UNAUTHORIZED');
  });

  it('returns session payload when valid', async () => {
    vi.mocked(getSession).mockResolvedValueOnce({
      userId: 9,
      username: 'neo',
      email: 'neo@example.com',
    });
    const res = await GET(
      new Request('http://localhost/api/auth/me', {
        headers: { cookie: 'ps_session=good' },
      }),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data).toEqual({
      userId: 9,
      username: 'neo',
      email: 'neo@example.com',
    });
  });
});
