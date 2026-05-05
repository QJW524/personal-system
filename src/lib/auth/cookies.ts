export const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME ?? 'ps_session';

export function getSessionCookieOptions() {
  const maxAge = Number(process.env.SESSION_TTL_SECONDS ?? 7 * 24 * 60 * 60);

  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  };
}
