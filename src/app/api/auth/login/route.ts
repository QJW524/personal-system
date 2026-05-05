import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isLoginRateLimited } from '@/lib/auth/rate-limit';
import { verifyPassword } from '@/lib/auth/password';
import { createSession, rotateSession } from '@/lib/auth/session';
import { getSessionCookieOptions, SESSION_COOKIE_NAME } from '@/lib/auth/cookies';
import { loginSchema } from '@/lib/validators/auth';

const LOCK_THRESHOLD = 10;
const LOCK_MINUTES = 15;

function getClientIp(request: Request) {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) {
    return xff.split(',')[0]?.trim() ?? 'unknown';
  }
  return request.headers.get('x-real-ip') ?? 'unknown';
}

function normalizeIdentifier(identifier: string) {
  return identifier.includes('@') ? identifier.toLowerCase() : identifier;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: parsed.error.issues[0]?.message ?? '参数不合法',
          },
        },
        { status: 400 },
      );
    }

    const ip = getClientIp(request);
    const identifier = normalizeIdentifier(parsed.data.identifier.trim());
    const password = parsed.data.password;

    const limited = await isLoginRateLimited(ip, identifier);
    if (limited) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'TOO_MANY_REQUESTS',
            message: '尝试过于频繁，请稍后再试',
          },
        },
        { status: 429 },
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username: identifier }, { email: identifier }],
      },
      select: {
        id: true,
        username: true,
        email: true,
        status: true,
        passwordHash: true,
        loginFailCount: true,
        lockedUntil: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: '用户名/邮箱或密码错误',
          },
        },
        { status: 401 },
      );
    }

    if (user.status === 'DISABLED') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'ACCOUNT_DISABLED',
            message: '账号已禁用，请联系管理员',
          },
        },
        { status: 403 },
      );
    }

    if (user.lockedUntil && user.lockedUntil.getTime() > Date.now()) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'ACCOUNT_LOCKED',
            message: '账号已临时锁定，请稍后再试',
          },
        },
        { status: 423 },
      );
    }

    const validPassword = await verifyPassword(password, user.passwordHash);
    if (!validPassword) {
      const failCount = user.loginFailCount + 1;
      const shouldLock = failCount >= LOCK_THRESHOLD;
      await prisma.user.update({
        where: { id: user.id },
        data: {
          loginFailCount: shouldLock ? 0 : failCount,
          lockedUntil: shouldLock ? new Date(Date.now() + LOCK_MINUTES * 60 * 1000) : null,
        },
      });

      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: '用户名/邮箱或密码错误',
          },
        },
        { status: 401 },
      );
    }

    const payload = {
      userId: user.id,
      username: user.username,
      email: user.email,
    };

    const existingSessionId = request.headers
      .get('cookie')
      ?.split(';')
      .find((item) => item.trim().startsWith(`${SESSION_COOKIE_NAME}=`))
      ?.split('=')[1];
    const sessionId = existingSessionId
      ? await rotateSession(existingSessionId, payload)
      : await createSession(payload);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        loginFailCount: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
      },
    });

    const response = NextResponse.json({
      success: true,
      data: payload,
    });

    response.cookies.set(SESSION_COOKIE_NAME, sessionId, getSessionCookieOptions());
    return response;
  } catch (error) {
    console.error('Login failed', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'LOGIN_FAILED',
          message: '登录失败，请稍后再试',
        },
      },
      { status: 500 },
    );
  }
}
