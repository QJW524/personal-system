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

  const siteTitle = profile?.siteTitle ?? `${session.username} 的个人系统`;
  const tagline =
    profile?.tagline ?? '用一个稳定的站点记录项目、思考和可复用的方法。';

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        <header className={styles.header}>
          <div className={styles.headerMain}>
            <p className={styles.sessionNote}>已登录</p>
            <p className={styles.userText}>
              {session.username} · {session.email}
            </p>
          </div>
          <LogoutButton />
        </header>

        <main className={styles.main}>
          <section className={styles.intro} aria-labelledby='site-title'>
            <h1 id='site-title' className={styles.title}>
              {siteTitle}
            </h1>
            <p className={styles.tagline}>{tagline}</p>
            <nav className={styles.actions} aria-label='快捷链接'>
              <Link className={styles.actionPrimary} href='/api/health'>
                查看健康检查
              </Link>
              <a
                className={styles.actionSecondary}
                href='https://nextjs.org/docs'
                target='_blank'
                rel='noreferrer'
              >
                Next.js 文档
              </a>
            </nav>
          </section>

          <section className={styles.block} aria-labelledby='highlights-heading'>
            <div className={styles.blockHead}>
              <h2 id='highlights-heading' className={styles.blockTitle}>
                最近在做的事
              </h2>
            </div>
            <div className={styles.blockBody}>
              <HighlightCrud initialHighlights={profile?.highlights ?? []} />
              {!profile && (
                <p className={styles.notice}>
                  数据库尚未初始化。你可以直接在下面新增一条，系统会自动创建基础资料。
                </p>
              )}
            </div>
          </section>

          <section className={styles.baseline} aria-labelledby='baseline-heading'>
            <h2 id='baseline-heading' className={styles.baselineTitle}>
              站点基线
            </h2>
            <p>这版先把工程基线打好：Next.js + Prisma + Docker + GitHub Actions。</p>
            <p>内容后续按你的真实经历填充，不走 AI 模板文案。</p>
          </section>
        </main>

        <footer className={styles.footer}>
          <span>© {new Date().getFullYear()} Qiu</span>
          <span className={styles.footerMeta}>Built with Next.js + Prisma</span>
        </footer>
      </div>
    </div>
  );
}
