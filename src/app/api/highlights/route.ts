import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const DEFAULT_PROFILE_ID = 1;

export async function GET() {
  const items = await prisma.highlight.findMany({
    where: { profileId: DEFAULT_PROFILE_ID },
    orderBy: {
      createdAt: 'asc',
    },
  });

  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { title?: string; summary?: string };
    const title = body.title?.trim();
    const summary = body.summary?.trim();

    if (!title || !summary) {
      return NextResponse.json({ error: '标题和内容不能为空。' }, { status: 400 });
    }

    await prisma.siteProfile.upsert({
      where: { id: DEFAULT_PROFILE_ID },
      update: {},
      create: {
        id: DEFAULT_PROFILE_ID,
        siteTitle: 'Qiu 的个人系统',
        tagline: '记录我做过的事，而不是套模板的自我介绍。',
      },
    });

    const item = await prisma.highlight.create({
      data: {
        title,
        summary,
        profileId: DEFAULT_PROFILE_ID,
      },
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    console.error('Failed to create highlight', error);
    return NextResponse.json({ error: '创建失败，请稍后重试。' }, { status: 500 });
  }
}
