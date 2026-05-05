import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth/password';
import { registerSchema } from '@/lib/validators/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

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

    const { username, email, password } = parsed.data;

    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'USER_ALREADY_EXISTS',
            message: '用户名或邮箱已被占用',
          },
        },
        { status: 409 },
      );
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: user,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Register failed', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'REGISTER_FAILED',
          message: '注册失败，请稍后再试',
        },
      },
      { status: 500 },
    );
  }
}
