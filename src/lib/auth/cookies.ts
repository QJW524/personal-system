export const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME ?? 'ps_session';

/** 与 Set-Cookie 的 Secure 对齐：HTTP 访问时不能设 Secure，否则浏览器不会保存 Cookie。 */
function resolveCookieSecure(request?: Request): boolean {
  const fromEnv = process.env.SESSION_COOKIE_SECURE;
  if (fromEnv === 'true') {
    return true;
  }
  if (fromEnv === 'false') {
    return false;
  }

  if (request) {
    const forwarded = request.headers.get('x-forwarded-proto');
    if (forwarded) {
      return forwarded.split(',')[0]?.trim() === 'https';
    }
    try {
      return new URL(request.url).protocol === 'https:';
    } catch {
      return false;
    }
  }

  return process.env.NODE_ENV === 'production';
}

export function getSessionCookieOptions(request?: Request, options?: { maxAge?: number }) {
  const maxAge = options?.maxAge ?? Number(process.env.SESSION_TTL_SECONDS ?? 7 * 24 * 60 * 60);

  return {
    httpOnly: true,
    secure: resolveCookieSecure(request),
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  };
}
