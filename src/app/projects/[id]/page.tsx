import Link from 'next/link';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { ProjectDetailEditor } from '@/components/project-detail-editor';
import { SESSION_COOKIE_NAME } from '@/lib/auth/cookies';
import { getSession } from '@/lib/auth/session';
import { getProjectDetailForUser } from '@/lib/projects/queries';
import { parsePositiveProjectId } from '@/lib/projects/parse-record-id';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjectDetailPage({ params }: PageProps) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionId) {
    redirect('/login');
  }

  const session = await getSession(sessionId);
  if (!session) {
    redirect('/login');
  }

  const { id } = await params;
  const projectId = parsePositiveProjectId(id);
  if (!projectId) {
    notFound();
  }

  const project = await getProjectDetailForUser(session.userId, projectId);
  if (!project) {
    notFound();
  }

  const serializedProject = {
    ...project,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
    updates: project.updates.map((entry) => ({
      ...entry,
      createdAt: entry.createdAt.toISOString(),
      updatedAt: entry.updatedAt.toISOString(),
    })),
  };

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <Link href='/' className={styles.backLink}>
          返回工作台
        </Link>

        <header className={styles.header}>
          <p className={styles.eyebrow}>Project Detail</p>
          <h1 className={styles.title}>把目标、下一步动作和更新记录收回同一页。</h1>
          <p className={styles.body}>
            当前项目：{project.name}。先补清概览信息，再把推进过程记录在下面，这样下次回来时就不用重新回忆上下文。
          </p>
        </header>

        <ProjectDetailEditor initialProject={serializedProject} />
      </div>
    </main>
  );
}
