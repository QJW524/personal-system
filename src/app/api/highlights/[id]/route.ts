import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth/request-session';

type Params = {
  params: Promise<{ id: string }>;
};

function parseId(id: string) {
  const parsed = Number(id);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: '未登录或登录状态失效。' }, { status: 401 });
    }

    const { id } = await params;
    const itemId = parseId(id);
    if (!itemId) {
      return NextResponse.json({ error: '无效的记录 ID。' }, { status: 400 });
    }

    const body = (await request.json()) as { title?: string; summary?: string };
    const title = body.title?.trim();
    const summary = body.summary?.trim();
    if (!title || !summary) {
      return NextResponse.json({ error: '标题和内容不能为空。' }, { status: 400 });
    }

    const updateResult = await prisma.highlight.updateMany({
      where: {
        id: itemId,
        profile: {
          userId: session.userId,
        },
      },
      data: { title, summary },
    });
    if (updateResult.count === 0) {
      return NextResponse.json({ error: '记录不存在或无权限。' }, { status: 404 });
    }

    const item = await prisma.highlight.findUnique({
      where: { id: itemId },
    });

    return NextResponse.json({ item });
  } catch (error) {
    console.error('Failed to update highlight', error);
    return NextResponse.json({ error: '更新失败，请稍后重试。' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: '未登录或登录状态失效。' }, { status: 401 });
    }

    const { id } = await params;
    const itemId = parseId(id);
    if (!itemId) {
      return NextResponse.json({ error: '无效的记录 ID。' }, { status: 400 });
    }

    const deleteResult = await prisma.highlight.deleteMany({
      where: {
        id: itemId,
        profile: {
          userId: session.userId,
        },
      },
    });
    if (deleteResult.count === 0) {
      return NextResponse.json({ error: '记录不存在或无权限。' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete highlight', error);
    return NextResponse.json({ error: '删除失败，请稍后重试。' }, { status: 500 });
  }
}
