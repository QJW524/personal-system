import { SESSION_COOKIE_NAME } from '@/lib/auth/cookies';
import { getSession } from '@/lib/auth/session';

function getCookieValue(cookieHeader: string | null, name: string) {
  if (!cookieHeader) {
    return null;
  }

  const target = cookieHeader
    .split(';')
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${name}=`));

  return target ? target.split('=')[1] ?? null : null;
}

export async function getSessionFromRequest(request: Request) {
  const sessionId = getCookieValue(request.headers.get('cookie'), SESSION_COOKIE_NAME);
  if (!sessionId) {
    return null;
  }

  return getSession(sessionId);
}
