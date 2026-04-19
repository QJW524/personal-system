import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

async function getHomepageData() {
  try {
    const profile = await prisma.siteProfile.findUnique({
      where: { id: 1 },
      include: {
        highlights: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    return profile;
  } catch (error) {
    console.error('Failed to load homepage data', error);
    return null;
  }
}

export default async function Home() {
  const profile = await getHomepageData();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.hero}>
          <p className={styles.badge}>Personal Website</p>
          <h1>{profile?.siteTitle ?? 'Qiu 的个人系统'}</h1>
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

        <section className={styles.section}>
          <h2>最近在做的事</h2>
          <ul>
            {(profile?.highlights ?? []).map((item) => (
              <li key={item.id}>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
              </li>
            ))}
            {!profile && (
              <li>
                <h3>数据库尚未初始化</h3>
                <p>先启动 Postgres，再执行 Prisma migrate 和 seed 即可恢复。</p>
              </li>
            )}
          </ul>
        </section>

        <section className={styles.section}>
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
