import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/auth/session', () => ({
  deleteSession: vi.fn().mockResolvedValue(undefined),
}));

import { POST } from '@/app/api/auth/logout/route';
import { deleteSession } from '@/lib/auth/session';

describe('POST /api/auth/logout', () => {
  beforeEach(() => {
    vi.mocked(deleteSession).mockClear();
  });
  it('calls deleteSession when session cookie present', async () => {
    const res = await POST(
      new Request('http://localhost/api/auth/logout', {
        method: 'POST',
        headers: { cookie: 'ps_session=my-sid' },
      }),
    );
    expect(res.status).toBe(200);
    expect(deleteSession).toHaveBeenCalledWith('my-sid');
    const body = await res.json();
    expect(body.success).toBe(true);
  });

  it('skips deleteSession when no session cookie', async () => {
    const res = await POST(
      new Request('http://localhost/api/auth/logout', { method: 'POST' }),
    );
    expect(res.status).toBe(200);
    expect(deleteSession).not.toHaveBeenCalled();
  });
});
