import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/auth/session', () => ({
  getSession: vi.fn(),
}));

import { getSessionFromRequest } from '@/lib/auth/request-session';
import { getSession } from '@/lib/auth/session';

describe('getSessionFromRequest', () => {
  it('returns null when cookie header missing', async () => {
    await expect(getSessionFromRequest(new Request('http://localhost/'))).resolves.toBeNull();
    expect(getSession).not.toHaveBeenCalled();
  });

  it('returns null when session cookie absent', async () => {
    const req = new Request('http://localhost/', {
      headers: { cookie: 'other=1' },
    });
    await expect(getSessionFromRequest(req)).resolves.toBeNull();
    expect(getSession).not.toHaveBeenCalled();
  });

  it('loads session via cookie value', async () => {
    vi.mocked(getSession).mockResolvedValue({
      userId: 3,
      username: 'pat',
      email: 'pat@example.com',
    });
    const req = new Request('http://localhost/', {
      headers: { cookie: 'ps_session=sid-123; foo=bar' },
    });
    await expect(getSessionFromRequest(req)).resolves.toEqual({
      userId: 3,
      username: 'pat',
      email: 'pat@example.com',
    });
    expect(getSession).toHaveBeenCalledWith('sid-123');
  });
});
