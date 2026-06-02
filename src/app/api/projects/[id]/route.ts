import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth/request-session';
import { parsePositiveProjectId } from '@/lib/projects/parse-record-id';
import { projectOverviewSchema } from '@/lib/validators/projects';

type Params = {
  params: Promise<{ id: string }>;
};

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

function notFoundResponse() {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: '项目不存在或无权限访问。',
      },
    },
    { status: 404 },
  );
}

export async function GET(request: Request, { params }: Params) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return unauthorizedResponse();
  }

  const { id } = await params;
  const projectId = parsePositiveProjectId(id);
  if (!projectId) {
    return validationError('无效的项目 ID。');
  }

  const item = await prisma.project.findFirst({
    where: {
      id: projectId,
      userId: session.userId,
    },
    include: {
      updates: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!item) {
    return notFoundResponse();
  }

  return NextResponse.json({
    success: true,
    data: {
      item,
    },
  });
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return unauthorizedResponse();
    }

    const { id } = await params;
    const projectId = parsePositiveProjectId(id);
    if (!projectId) {
      return validationError('无效的项目 ID。');
    }

    const body = await request.json();
    const parsed = projectOverviewSchema.safeParse(body);
    if (!parsed.success) {
      return validationError(parsed.error.issues[0]?.message ?? '参数不合法');
    }

    const updateResult = await prisma.project.updateMany({
      where: {
        id: projectId,
        userId: session.userId,
      },
      data: {
        name: parsed.data.name,
        status: parsed.data.status,
        currentGoal: parsed.data.currentGoal,
        nextAction: parsed.data.nextAction,
      },
    });

    if (updateResult.count === 0) {
      return notFoundResponse();
    }

    const item = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        item,
      },
    });
  } catch (error) {
    console.error('Failed to update project', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'PROJECT_UPDATE_FAILED',
          message: '更新项目失败，请稍后重试。',
        },
      },
      { status: 500 },
    );
  }
}
