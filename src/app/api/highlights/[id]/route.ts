import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type Params = {
  params: { id: string };
};

function parseId(id: string) {
  const parsed = Number(id);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = params;
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

    const item = await prisma.highlight.update({
      where: { id: itemId },
      data: { title, summary },
    });

    return NextResponse.json({ item });
  } catch (error) {
    console.error('Failed to update highlight', error);
    return NextResponse.json({ error: '更新失败，请稍后重试。' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    const { id } = params;
    const itemId = parseId(id);
    if (!itemId) {
      return NextResponse.json({ error: '无效的记录 ID。' }, { status: 400 });
    }

    await prisma.highlight.delete({
      where: { id: itemId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete highlight', error);
    return NextResponse.json({ error: '删除失败，请稍后重试。' }, { status: 500 });
  }
}
