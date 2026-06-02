'use client';

import Link from 'next/link';
import { startTransition, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ProjectStatusInput } from '@/lib/validators/projects';
import styles from './project-workbench.module.css';

type ProjectItem = {
  id: number;
  name: string;
  status: ProjectStatusInput;
  currentGoal: string;
  nextAction: string;
  createdAt: string;
  updatedAt: string;
};

type ProjectWorkbenchProps = {
  initialProjects: ProjectItem[];
};

type FilterValue = 'ALL' | ProjectStatusInput;

type WorkbenchStatus = {
  type: 'success' | 'error';
  text: string;
} | null;

const statusOptions: Array<{ value: ProjectStatusInput; label: string }> = [
  { value: 'IDEA', label: '想法中' },
  { value: 'ACTIVE', label: '进行中' },
  { value: 'PAUSED', label: '已暂停' },
  { value: 'DONE', label: '已完成' },
];

const filterOptions: Array<{ value: FilterValue; label: string }> = [
  { value: 'ALL', label: '全部' },
  ...statusOptions,
];

const statusToneClass: Record<ProjectStatusInput, string> = {
  IDEA: styles.statusIdea,
  ACTIVE: styles.statusActive,
  PAUSED: styles.statusPaused,
  DONE: styles.statusDone,
};

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

function normalizeItem(item: ProjectItem) {
  return {
    ...item,
    createdAt: new Date(item.createdAt).toISOString(),
    updatedAt: new Date(item.updatedAt).toISOString(),
  };
}

export function ProjectWorkbench({ initialProjects }: ProjectWorkbenchProps) {
  const router = useRouter();
  const [items, setItems] = useState<ProjectItem[]>(initialProjects.map(normalizeItem));
  const [filter, setFilter] = useState<FilterValue>('ALL');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<ProjectStatusInput>('IDEA');
  const [nextAction, setNextAction] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<WorkbenchStatus>(null);

  const canCreate = useMemo(() => Boolean(name.trim() && nextAction.trim()), [name, nextAction]);

  const counts = useMemo(() => {
    return items.reduce<Record<ProjectStatusInput, number>>(
      (result, item) => {
        result[item.status] += 1;
        return result;
      },
      {
        IDEA: 0,
        ACTIVE: 0,
        PAUSED: 0,
        DONE: 0,
      },
    );
  }, [items]);

  const filteredItems = useMemo(() => {
    if (filter === 'ALL') {
      return items;
    }
    return items.filter((item) => item.status === filter);
  }, [filter, items]);

  async function createProject() {
    if (!canCreate || submitting) {
      return;
    }

    setSubmitting(true);
    setNotice(null);
    try {
      const data = await requestJson<{ item: ProjectItem }>('/api/projects', {
        method: 'POST',
        body: JSON.stringify({
          name: name.trim(),
          status,
          nextAction: nextAction.trim(),
        }),
      });

      const item = normalizeItem(data.item);
      setItems((prev) => [item, ...prev]);
      setFilter(item.status);
      setName('');
      setStatus('IDEA');
      setNextAction('');
      setNotice({ type: 'success', text: '项目已记录，现在可以继续进入详情页补目标和更新。' });
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      setNotice({ type: 'error', text: (error as Error).message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.createBox}>
        <div className={styles.createHeader}>
          <div>
            <p className={styles.createEyebrow}>Quick Capture</p>
            <h3 className={styles.createTitle}>先记下项目名、状态和一句下一步动作。</h3>
          </div>
          <p className={styles.createBody}>V1 继续保持轻量，不要求一次把背景、资料和完整计划全写完。</p>
        </div>

        <div className={styles.fieldGrid}>
          <label className={styles.field}>
            <span>项目名</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder='例如：Project Workbench 第二轮改造'
            />
          </label>

          <label className={styles.field}>
            <span>当前状态</span>
            <select value={status} onChange={(event) => setStatus(event.target.value as ProjectStatusInput)}>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className={styles.field}>
          <span>下一步动作</span>
          <textarea
            value={nextAction}
            onChange={(event) => setNextAction(event.target.value)}
            placeholder='例如：补齐详情页与更新记录表单'
            rows={3}
          />
        </label>

        <button type='button' onClick={createProject} disabled={!canCreate || submitting} className={styles.createButton}>
          {submitting ? '创建中...' : '新增项目'}
        </button>
      </div>

      {notice && <p className={notice.type === 'error' ? styles.errorText : styles.successText}>{notice.text}</p>}

      <div className={styles.filterRow} aria-label='项目筛选'>
        {filterOptions.map((option) => {
          const count = option.value === 'ALL' ? items.length : counts[option.value];
          const active = option.value === filter;
          return (
            <button
              key={option.value}
              type='button'
              onClick={() => setFilter(option.value)}
              className={active ? styles.filterActive : styles.filterButton}
            >
              <span>{option.label}</span>
              <span className={styles.filterCount}>{count}</span>
            </button>
          );
        })}
      </div>

      <ul className={styles.list}>
        {filteredItems.map((item) => (
          <li key={item.id} className={styles.item}>
            <div className={styles.itemTop}>
              <div className={styles.itemMeta}>
                <span className={`${styles.statusPill} ${statusToneClass[item.status]}`}>
                  {statusOptions.find((option) => option.value === item.status)?.label ?? item.status}
                </span>
                <span className={styles.itemTime}>{formatDate(item.updatedAt)}</span>
              </div>
              <Link href={`/projects/${item.id}`} className={styles.detailLink}>
                查看详情
              </Link>
            </div>

            <div className={styles.itemBody}>
              <h3>{item.name}</h3>
              <div className={styles.noteBox}>
                <p className={styles.noteLabel}>Current Goal</p>
                <p>{item.currentGoal || '还没有明确当前目标，先进入详情页补一句当前目标。'}</p>
              </div>
              <div className={styles.noteBox}>
                <p className={styles.noteLabel}>Next Action</p>
                <p>{item.nextAction}</p>
              </div>
            </div>
          </li>
        ))}

        {filteredItems.length === 0 && items.length > 0 && (
          <li className={styles.emptyState}>
            <p>当前筛选下还没有项目。可以切换状态，或者先新增一条项目卡片。</p>
          </li>
        )}

        {items.length === 0 && (
          <li className={styles.emptyState}>
            <p>还没有项目卡片。先新增一个项目，把今天要推进的下一步动作写下来。</p>
          </li>
        )}
      </ul>
    </div>
  );
}
