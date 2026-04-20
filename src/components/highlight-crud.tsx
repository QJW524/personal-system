'use client';

import { useMemo, useState } from 'react';
import styles from './highlight-crud.module.css';

type HighlightItem = {
  id: number;
  title: string;
  summary: string;
};

type HighlightCrudProps = {
  initialHighlights: HighlightItem[];
};

type Status = {
  type: 'success' | 'error';
  text: string;
} | null;

export function HighlightCrud({ initialHighlights }: HighlightCrudProps) {
  const [items, setItems] = useState<HighlightItem[]>(initialHighlights);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingSummary, setEditingSummary] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  const canCreate = useMemo(() => title.trim() && summary.trim(), [title, summary]);

  async function request<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
    const response = await fetch(input, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers ?? {}),
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error || '请求失败');
    }

    return data;
  }

  async function createItem() {
    if (!canCreate || submitting) {
      return;
    }

    setSubmitting(true);
    setStatus(null);
    try {
      const data = await request<{ item: HighlightItem }>('/api/highlights', {
        method: 'POST',
        body: JSON.stringify({
          title: title.trim(),
          summary: summary.trim(),
        }),
      });

      setItems((prev) => [...prev, data.item]);
      setTitle('');
      setSummary('');
      setStatus({ type: 'success', text: '新增成功。' });
    } catch (error) {
      setStatus({ type: 'error', text: (error as Error).message });
    } finally {
      setSubmitting(false);
    }
  }

  function startEdit(item: HighlightItem) {
    setEditingId(item.id);
    setEditingTitle(item.title);
    setEditingSummary(item.summary);
    setStatus(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingTitle('');
    setEditingSummary('');
  }

  async function saveEdit() {
    if (!editingId || submitting) {
      return;
    }

    setSubmitting(true);
    setStatus(null);
    try {
      const data = await request<{ item: HighlightItem }>(`/api/highlights/${editingId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: editingTitle.trim(),
          summary: editingSummary.trim(),
        }),
      });

      setItems((prev) => prev.map((item) => (item.id === editingId ? data.item : item)));
      cancelEdit();
      setStatus({ type: 'success', text: '更新成功。' });
    } catch (error) {
      setStatus({ type: 'error', text: (error as Error).message });
    } finally {
      setSubmitting(false);
    }
  }

  async function removeItem(id: number) {
    if (submitting) {
      return;
    }

    setSubmitting(true);
    setStatus(null);
    try {
      await request<{ success: true }>(`/api/highlights/${id}`, {
        method: 'DELETE',
      });
      setItems((prev) => prev.filter((item) => item.id !== id));
      setStatus({ type: 'success', text: '删除成功。' });
    } catch (error) {
      setStatus({ type: 'error', text: (error as Error).message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.createBox}>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder='标题，例如：完成后台重构'
        />
        <textarea
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
          placeholder='一句话描述你最近在做什么'
          rows={3}
        />
        <button type='button' onClick={createItem} disabled={!canCreate || submitting}>
          新增
        </button>
      </div>

      {status && (
        <p className={status.type === 'error' ? styles.errorText : styles.successText}>{status.text}</p>
      )}

      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.id} className={styles.item}>
            {editingId === item.id ? (
              <div className={styles.editBox}>
                <input value={editingTitle} onChange={(event) => setEditingTitle(event.target.value)} />
                <textarea
                  value={editingSummary}
                  onChange={(event) => setEditingSummary(event.target.value)}
                  rows={3}
                />
                <div className={styles.rowActions}>
                  <button type='button' onClick={saveEdit} disabled={submitting}>
                    保存
                  </button>
                  <button type='button' onClick={cancelEdit} className={styles.ghostButton} disabled={submitting}>
                    取消
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <div className={styles.rowActions}>
                  <button type='button' onClick={() => startEdit(item)} disabled={submitting}>
                    编辑
                  </button>
                  <button
                    type='button'
                    onClick={() => removeItem(item.id)}
                    className={styles.dangerButton}
                    disabled={submitting}
                  >
                    删除
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
        {items.length === 0 && (
          <li className={styles.emptyItem}>
            <p>还没有内容，先新增一条测试一下。</p>
          </li>
        )}
      </ul>
    </div>
  );
}
