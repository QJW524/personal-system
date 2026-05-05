import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { HighlightCrud } from '@/components/highlight-crud';
import { LogoutButton } from '@/components/logout-button';
import { SESSION_COOKIE_NAME } from '@/lib/auth/cookies';
import { getSession } from '@/lib/auth/session';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionId) {
    redirect('/login');
  }

  const session = await getSession(sessionId);
  if (!session) {
    redirect('/login');
  }

  const profile = await prisma.siteProfile.upsert({
    where: { userId: session.userId },
    update: {},
    create: {
      userId: session.userId,
      siteTitle: `${session.username} 的个人系统`,
      tagline: '用一个稳定的站点记录项目、思考和可复用的方法。',
    },
    include: {
      highlights: {
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  });

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.topbar}>
          <div>
            <p className={styles.badge}>已登录</p>
            <p className={styles.userText}>
              {session.username} · {session.email}
            </p>
          </div>
          <LogoutButton />
        </section>

        <section className={styles.hero}>
          <h1>{profile?.siteTitle ?? '周丽蛛的个人系统'}</h1>
          <p className={styles.tagline}>
            {profile?.tagline ?? '用一个稳定的站点记录项目、思考和可复用的方法。'}
          </p>
          <div className={styles.actions}>
            <Link href='/api/health'>查看健康检查</Link>
            <a href='https://nextjs.org/docs' target='_blank' rel='noreferrer'>
              Next.js 文档
            </a>
          </div>
        </section>

        <section className={styles.sectionCard}>
          <h2>最近在做的事</h2>
          <HighlightCrud initialHighlights={profile?.highlights ?? []} />
          {!profile && (
            <p className={styles.notice}>
              数据库尚未初始化。你可以直接在下面新增一条，系统会自动创建基础资料。
            </p>
          )}
        </section>

        <section className={styles.sectionCard}>
          <h2>站点基线</h2>
          <p>这版先把工程基线打好：Next.js + Prisma + Docker + GitHub Actions。</p>
          <p>内容后续按你的真实经历填充，不走 AI 模板文案。</p>
        </section>

        <div className={styles.footer}>
          <span>© {new Date().getFullYear()} Qiu</span>
          <span>Built with Next.js + Prisma</span>
        </div>
      </main>
    </div>
  );
}
