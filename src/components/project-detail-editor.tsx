'use client';

import { startTransition, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ProjectStatusInput } from '@/lib/validators/projects';
import styles from './project-detail-editor.module.css';

type ProjectUpdateEntry = {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
};

type ProjectDetailRecord = {
  id: number;
  name: string;
  status: ProjectStatusInput;
  currentGoal: string;
  nextAction: string;
  createdAt: string;
  updatedAt: string;
  updates: ProjectUpdateEntry[];
};

type ProjectDetailEditorProps = {
  initialProject: ProjectDetailRecord;
};

type EditorStatus = {
  type: 'success' | 'error';
  text: string;
} | null;

const statusOptions: Array<{ value: ProjectStatusInput; label: string }> = [
  { value: 'IDEA', label: '想法中' },
  { value: 'ACTIVE', label: '进行中' },
  { value: 'PAUSED', label: '已暂停' },
  { value: 'DONE', label: '已完成' },
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    credentials: 'include',
  });

  const data = (await response.json()) as {
    success: boolean;
    data?: T;
    error?: { message?: string };
  };

  if (!response.ok || !data.success) {
    throw new Error(data.error?.message ?? '请求失败');
  }

  return data.data as T;
}

function normalizeProject(project: ProjectDetailRecord) {
  return {
    ...project,
    createdAt: new Date(project.createdAt).toISOString(),
    updatedAt: new Date(project.updatedAt).toISOString(),
    updates: project.updates.map((entry) => ({
      ...entry,
      createdAt: new Date(entry.createdAt).toISOString(),
      updatedAt: new Date(entry.updatedAt).toISOString(),
    })),
  };
}

function normalizeUpdate(entry: ProjectUpdateEntry) {
  return {
    ...entry,
    createdAt: new Date(entry.createdAt).toISOString(),
    updatedAt: new Date(entry.updatedAt).toISOString(),
  };
}

export function ProjectDetailEditor({ initialProject }: ProjectDetailEditorProps) {
  const router = useRouter();
  const [project, setProject] = useState<ProjectDetailRecord>(normalizeProject(initialProject));
  const [draft, setDraft] = useState({
    name: initialProject.name,
    status: initialProject.status,
    currentGoal: initialProject.currentGoal,
    nextAction: initialProject.nextAction,
  });
  const [updates, setUpdates] = useState<ProjectUpdateEntry[]>(normalizeProject(initialProject).updates);
  const [updateContent, setUpdateContent] = useState('');
  const [savingOverview, setSavingOverview] = useState(false);
  const [savingUpdate, setSavingUpdate] = useState(false);
  const [status, setStatus] = useState<EditorStatus>(null);

  const canSaveOverview = useMemo(() => {
    return Boolean(draft.name.trim() && draft.currentGoal.trim() && draft.nextAction.trim());
  }, [draft.currentGoal, draft.name, draft.nextAction]);

  const canCreateUpdate = useMemo(() => Boolean(updateContent.trim()), [updateContent]);

  async function saveOverview() {
    if (!canSaveOverview || savingOverview) {
      return;
    }

    setSavingOverview(true);
    setStatus(null);
    try {
      const data = await requestJson<{ item: Omit<ProjectDetailRecord, 'updates'> }>(`/api/projects/${project.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          name: draft.name.trim(),
          status: draft.status,
          currentGoal: draft.currentGoal.trim(),
          nextAction: draft.nextAction.trim(),
        }),
      });

      const nextProject = {
        ...project,
        ...normalizeProject({
          ...project,
          ...data.item,
          updates,
        }),
      };

      setProject(nextProject);
      setDraft({
        name: nextProject.name,
        status: nextProject.status,
        currentGoal: nextProject.currentGoal,
        nextAction: nextProject.nextAction,
      });
      setStatus({ type: 'success', text: '项目概览已更新。' });
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      setStatus({ type: 'error', text: (error as Error).message });
    } finally {
      setSavingOverview(false);
    }
  }

  async function createUpdate() {
    if (!canCreateUpdate || savingUpdate) {
      return;
    }

    setSavingUpdate(true);
    setStatus(null);
    try {
      const data = await requestJson<{ item: ProjectUpdateEntry }>(`/api/projects/${project.id}/updates`, {
        method: 'POST',
        body: JSON.stringify({
          content: updateContent.trim(),
        }),
      });

      const entry = normalizeUpdate(data.item);
      setUpdates((prev) => [entry, ...prev]);
      setProject((prev) => ({
        ...prev,
        updatedAt: entry.createdAt,
      }));
      setUpdateContent('');
      setStatus({ type: 'success', text: '更新记录已写入。' });
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      setStatus({ type: 'error', text: (error as Error).message });
    } finally {
      setSavingUpdate(false);
    }
  }

  return (
    <div className={styles.shell}>
      <section className={styles.overviewCard}>
        <div className={styles.cardHeader}>
          <div>
            <p className={styles.eyebrow}>Overview</p>
            <h2 className={styles.title}>{project.name}</h2>
          </div>
          <div className={styles.metaRow}>
            <span className={styles.metaPill}>
              {statusOptions.find((option) => option.value === project.status)?.label ?? project.status}
            </span>
            <span>创建于 {formatDate(project.createdAt)}</span>
            <span>最近更新 {formatDate(project.updatedAt)}</span>
          </div>
        </div>

        <div className={styles.fieldGrid}>
          <label className={styles.field}>
            <span>项目名</span>
            <input value={draft.name} onChange={(event) => setDraft((prev) => ({ ...prev, name: event.target.value }))} />
          </label>

          <label className={styles.field}>
            <span>当前状态</span>
            <select
              value={draft.status}
              onChange={(event) => setDraft((prev) => ({ ...prev, status: event.target.value as ProjectStatusInput }))}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className={styles.field}>
          <span>当前目标</span>
          <textarea
            rows={4}
            value={draft.currentGoal}
            onChange={(event) => setDraft((prev) => ({ ...prev, currentGoal: event.target.value }))}
            placeholder='这一页想解决什么问题、当前最重要的结果是什么。'
          />
        </label>

        <label className={styles.field}>
          <span>下一步动作</span>
          <textarea
            rows={4}
            value={draft.nextAction}
            onChange={(event) => setDraft((prev) => ({ ...prev, nextAction: event.target.value }))}
            placeholder='接下来最具体、最可执行的一步。'
          />
        </label>

        <div className={styles.actionRow}>
          <button type='button' onClick={saveOverview} disabled={!canSaveOverview || savingOverview} className={styles.primaryButton}>
            {savingOverview ? '保存中...' : '保存概览'}
          </button>
          <p className={styles.helperText}>概览字段会影响首页卡片的状态、目标和下一步动作展示。</p>
        </div>
      </section>

      <section className={styles.timelineCard}>
        <div className={styles.cardHeader}>
          <div>
            <p className={styles.eyebrow}>Updates</p>
            <h2 className={styles.title}>更新记录</h2>
          </div>
          <p className={styles.helperText}>每次推进后补一句记录，让下一次打开时可以快速回到上下文。</p>
        </div>

        <label className={styles.field}>
          <span>新增更新</span>
          <textarea
            rows={4}
            value={updateContent}
            onChange={(event) => setUpdateContent(event.target.value)}
            placeholder='例如：今天确认了首页状态总览和详情页职责边界。'
          />
        </label>

        <div className={styles.actionRow}>
          <button type='button' onClick={createUpdate} disabled={!canCreateUpdate || savingUpdate} className={styles.primaryButton}>
            {savingUpdate ? '提交中...' : '写入更新'}
          </button>
        </div>

        {status && <p className={status.type === 'error' ? styles.errorText : styles.successText}>{status.text}</p>}

        <div className={styles.timelineList}>
          {updates.map((entry) => (
            <article key={entry.id} className={styles.timelineItem}>
              <div className={styles.timelineTop}>
                <h3>记录 #{entry.id}</h3>
                <span>{formatDate(entry.createdAt)}</span>
              </div>
              <p>{entry.content}</p>
            </article>
          ))}

          {updates.length === 0 && (
            <div className={styles.emptyState}>
              <p>还没有更新记录。先补一条今天推进了什么，后面回看会省很多切换成本。</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
