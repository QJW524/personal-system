import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth/request-session';

async function getProfileIdByUser(userId: number) {
  const profile = await prisma.siteProfile.upsert({
    where: { userId },
    update: {},
    create: {
      userId,
      siteTitle: '我的个人系统',
      tagline: '记录项目、思考和可复用的方法。',
    },
    select: { id: true },
  });

  return profile.id;
}

export async function GET(request: Request) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: '未登录或登录状态失效。' }, { status: 401 });
  }

  const profileId = await getProfileIdByUser(session.userId);
  const items = await prisma.highlight.findMany({
    where: { profileId },
    orderBy: {
      createdAt: 'asc',
    },
  });

  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  try {
    const session = await getSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: '未登录或登录状态失效。' }, { status: 401 });
    }

    const body = (await request.json()) as { title?: string; summary?: string };
    const title = body.title?.trim();
    const summary = body.summary?.trim();

    if (!title || !summary) {
      return NextResponse.json({ error: '标题和内容不能为空。' }, { status: 400 });
    }

    const profileId = await getProfileIdByUser(session.userId);

    const item = await prisma.highlight.create({
      data: {
        title,
        summary,
        profileId,
      },
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    console.error('Failed to create highlight', error);
    return NextResponse.json({ error: '创建失败，请稍后重试。' }, { status: 500 });
  }
}
