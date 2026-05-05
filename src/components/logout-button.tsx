'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './logout-button.module.css';

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    if (loading) {
      return;
    }

    setLoading(true);
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      router.push('/login');
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button type='button' onClick={handleLogout} disabled={loading} className={styles.button}>
      {loading ? '退出中...' : '退出登录'}
    </button>
  );
}
