import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { SESSION_COOKIE_NAME } from '@/lib/auth/cookies';

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

export async function GET(request: Request) {
  try {
    const sessionId = getCookieValue(request.headers.get('cookie'), SESSION_COOKIE_NAME);
    if (!sessionId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: '未登录',
          },
        },
        { status: 401 },
      );
    }

    const session = await getSession(sessionId);
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: '登录状态已失效',
          },
        },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      data: session,
    });
  } catch (error) {
    console.error('Get current user failed', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'AUTH_CHECK_FAILED',
          message: '鉴权失败，请稍后再试',
        },
      },
      { status: 500 },
    );
  }
}
