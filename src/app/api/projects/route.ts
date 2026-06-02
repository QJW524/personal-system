import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth/request-session';
import { projectFilterSchema, projectQuickCreateSchema } from '@/lib/validators/projects';

function unauthorizedResponse() {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: '未登录或登录状态失效。',
      },
    },
    { status: 401 },
  );
}

function validationError(message: string) {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message,
      },
    },
    { status: 400 },
  );
}

export async function GET(request: Request) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return unauthorizedResponse();
  }

  const searchParams = new URL(request.url).searchParams;
  const parsed = projectFilterSchema.safeParse({
    status: searchParams.get('status') ?? undefined,
  });

  if (!parsed.success) {
    return validationError(parsed.error.issues[0]?.message ?? '参数不合法');
  }

  const items = await prisma.project.findMany({
    where: {
      userId: session.userId,
      ...(parsed.data.status ? { status: parsed.data.status } : {}),
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  return NextResponse.json({
    success: true,
    data: {
      items,
    },
  });
}

export async function POST(request: Request) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return unauthorizedResponse();
    }

    const body = await request.json();
    const parsed = projectQuickCreateSchema.safeParse(body);
    if (!parsed.success) {
      return validationError(parsed.error.issues[0]?.message ?? '参数不合法');
    }

    const item = await prisma.project.create({
      data: {
        userId: session.userId,
        name: parsed.data.name,
        status: parsed.data.status,
        currentGoal: '',
        nextAction: parsed.data.nextAction,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          item,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Failed to create project', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'PROJECT_CREATE_FAILED',
          message: '创建项目失败，请稍后重试。',
        },
      },
      { status: 500 },
    );
  }
}
