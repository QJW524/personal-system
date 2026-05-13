import { NextResponse } from 'next/server';
import { deleteSession } from '@/lib/auth/session';
import { getSessionCookieOptions, SESSION_COOKIE_NAME } from '@/lib/auth/cookies';
import { getCookieValue } from '@/lib/http/cookie-parse';

export async function POST(request: Request) {
  try {
    const sessionId = getCookieValue(request.headers.get('cookie'), SESSION_COOKIE_NAME);
    if (sessionId) {
      await deleteSession(sessionId);
    }

    const response = NextResponse.json({
      success: true,
      data: { loggedOut: true },
    });

    response.cookies.set(SESSION_COOKIE_NAME, '', getSessionCookieOptions(request, { maxAge: 0 }));

    return response;
  } catch (error) {
    console.error('Logout failed', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'LOGOUT_FAILED',
          message: '登出失败，请稍后再试',
        },
      },
      { status: 500 },
    );
  }
}
