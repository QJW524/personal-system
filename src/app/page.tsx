import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ProjectWorkbench } from '@/components/project-workbench';
import { LogoutButton } from '@/components/logout-button';
import { SESSION_COOKIE_NAME } from '@/lib/auth/cookies';
import { getSession } from '@/lib/auth/session';
import { getProjectDashboard } from '@/lib/projects/queries';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

const workflowLanes = [
  {
    code: 'IDEA',
    name: '想法中',
    label: 'Idea',
    description: '先留住方向，先不要急着把它做成完整方案。',
  },
  {
    code: 'ACTIVE',
    name: '进行中',
    label: 'Active',
    description: '真正投入时间推进的项目，下一步动作应该始终清楚。',
  },
  {
    code: 'PAUSED',
    name: '已暂停',
    label: 'Paused',
    description: '暂时搁置，但仍保留下次重新开始时需要的上下文。',
  },
  {
    code: 'DONE',
    name: '已完成',
    label: 'Done',
    description: '已经做完，后续更适合沉淀方法、复盘和复用经验。',
  },
] as const;

const workflowLabels = {
  IDEA: '想法中',
  ACTIVE: '进行中',
  PAUSED: '已暂停',
  DONE: '已完成',
} as const;

function formatUpdateDate(date: Date) {
  return new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

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

  const dashboard = await getProjectDashboard(session.userId);
  const siteTitle = `${session.username} 的项目工作台`;
  const tagline = '把项目想法、推进状态和下一步动作放回一个稳定入口。';
  const capturedProjects = dashboard.items.length;
  const currentFocus =
    dashboard.items.find((item) => item.status === 'ACTIVE')?.name ??
    dashboard.items[0]?.name ??
    '先新增一个项目';

  const initialProjects = dashboard.items.map((item) => ({
    ...item,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  }));

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        <header className={styles.header}>
          <div className={styles.headerMain}>
            <p className={styles.sessionNote}>Workbench</p>
            <p className={styles.userText}>
              {session.username} · {session.email}
            </p>
          </div>

          <div className={styles.headerActions}>
            <div className={styles.headerChip}>已登录</div>
            <LogoutButton />
          </div>
        </header>

        <main className={styles.main}>
          <section className={styles.hero} aria-labelledby='site-title'>
            <div className={styles.heroCopy}>
              <p className={styles.heroEyebrow}>Project Workbench</p>
              <h1 id='site-title' className={styles.title}>
                {siteTitle}
              </h1>
              <p className={styles.tagline}>{tagline}</p>
              <p className={styles.heroNote}>
                现在首页已经切到真实 `Project` 数据：状态总览、项目列表和最近更新都围绕同一套模型组织，后续只需要继续补迁移与增强能力。
              </p>
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
                  查看 Next.js 文档
                </a>
              </nav>
            </div>

            <div className={styles.metricGrid} aria-label='当前工作台概览'>
              <article className={styles.metricCard}>
                <p className={styles.metricLabel}>Captured Projects</p>
                <p className={styles.metricValue}>{capturedProjects}</p>
                <p className={styles.metricText}>这里展示当前账号下全部项目卡片的真实数量。</p>
              </article>

              <article className={styles.metricCard}>
                <p className={styles.metricLabel}>Recent Updates</p>
                <p className={styles.metricValue}>{dashboard.recentUpdates.length}</p>
                <p className={styles.metricText}>最近更新会帮助你在重新打开工作台时快速回到上下文。</p>
              </article>

              <article className={styles.metricCard}>
                <p className={styles.metricLabel}>Current Focus</p>
                <p className={styles.metricFocus}>{currentFocus}</p>
                <p className={styles.metricText}>优先展示正在推进的项目；如果还没有，就先新增一条想法。</p>
              </article>
            </div>
          </section>

          <section className={styles.workflow} aria-labelledby='workflow-title'>
            <div className={styles.sectionHeading}>
              <div>
                <p className={styles.sectionEyebrow}>Workflow</p>
                <h2 id='workflow-title' className={styles.sectionTitle}>
                  先看项目状态，再决定今天把时间放到哪里。
                </h2>
              </div>
              <p className={styles.sectionBody}>
                状态卡现在已经由真实 `Project.status` 驱动，首页不再只展示概念说明，而是帮助你直接判断当前推进面。
              </p>
            </div>

            <div className={styles.workflowGrid}>
              {workflowLanes.map((lane) => (
                <article key={lane.code} className={styles.workflowCard}>
                  <p className={styles.workflowLabel}>{lane.label}</p>
                  <p className={styles.workflowCount}>{dashboard.counts[lane.code]}</p>
                  <h3 className={styles.workflowName}>{lane.name}</h3>
                  <p className={styles.workflowText}>{lane.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.workspace} aria-label='工作台内容区'>
            <section className={styles.projectsPanel} aria-labelledby='projects-title'>
              <div className={styles.panelHeader}>
                <div>
                  <p className={styles.sectionEyebrow}>Projects</p>
                  <h2 id='projects-title' className={styles.panelTitle}>
                    当前项目卡片
                  </h2>
                </div>
                <p className={styles.panelBody}>
                  首页负责快速创建、按状态筛选和浏览项目卡片；进入详情页后，再补项目目标、更新历史与更完整的上下文。
                </p>
              </div>

              <div className={styles.projectsBody}>
                <ProjectWorkbench initialProjects={initialProjects} />
              </div>
            </section>

            <aside className={styles.updatesPanel} aria-labelledby='updates-title'>
              <div className={styles.panelHeader}>
                <div>
                  <p className={styles.sectionEyebrow}>Recent Updates</p>
                  <h2 id='updates-title' className={styles.panelTitle}>
                    最近更新
                  </h2>
                </div>
                <p className={styles.panelBody}>优先帮你回到最近推进过的项目，而不是在首页堆一整条长时间线。</p>
              </div>

              <div className={styles.updatesList}>
                {dashboard.recentUpdates.map((item) => (
                  <article key={item.id} className={styles.updateItem}>
                    <div className={styles.updateTop}>
                      <div className={styles.updateProjectMeta}>
                        <span className={styles.updateStatus}>{workflowLabels[item.project.status]}</span>
                        <Link className={styles.updateProjectLink} href={`/projects/${item.project.id}`}>
                          {item.project.name}
                        </Link>
                      </div>
                      <span>{formatUpdateDate(item.createdAt)}</span>
                    </div>
                    <p>{item.content}</p>
                  </article>
                ))}

                {dashboard.recentUpdates.length === 0 && (
                  <div className={styles.emptyUpdate}>
                    <p>还没有更新记录。先进入某个项目详情页，补一条今天的推进记录。</p>
                  </div>
                )}
              </div>

              <section className={styles.baseline} aria-labelledby='baseline-heading'>
                <h2 id='baseline-heading' className={styles.baselineTitle}>
                  当前基线
                </h2>
                <p>工作台首页已经切到真实 Project 数据，并且支持快速创建、状态筛选和进入详情页。</p>
                <p>旧的 Highlight 数据仍保留在数据库中，后续是否迁移到 Project 模型会继续在同一个 change 里判断。</p>
              </section>
            </aside>
          </section>
        </main>

        <footer className={styles.footer}>
          <span>© {new Date().getFullYear()} Qiu</span>
          <span className={styles.footerMeta}>Personal System · Project Workbench on Next.js + Prisma</span>
        </footer>
      </div>
    </div>
  );
}
