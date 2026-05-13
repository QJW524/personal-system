import { SESSION_COOKIE_NAME } from '@/lib/auth/cookies';
import { getSession } from '@/lib/auth/session';
import { getCookieValue } from '@/lib/http/cookie-parse';

export async function getSessionFromRequest(request: Request) {
  const sessionId = getCookieValue(request.headers.get('cookie'), SESSION_COOKIE_NAME);
  if (!sessionId) {
    return null;
  }

  return getSession(sessionId);
}
