'use client';

import { FormEvent, useMemo, useState } from 'react';
import styles from './page.module.css';

type AuthStatus = {
  type: 'success' | 'error';
  text: string;
} | null;

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

function readSafePostLoginPath(): string {
  if (typeof window === 'undefined') {
    return '/';
  }
  const raw = new URLSearchParams(window.location.search).get('redirect')?.trim() ?? '';
  if (raw.startsWith('/') && !raw.startsWith('//')) {
    return raw;
  }
  return '/';
}

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [status, setStatus] = useState<AuthStatus>(null);
  const [loading, setLoading] = useState(false);

  const canRegister = useMemo(
    () => registerUsername.trim() && registerEmail.trim() && registerPassword.trim(),
    [registerUsername, registerEmail, registerPassword],
  );
  const canLogin = useMemo(() => loginIdentifier.trim() && loginPassword.trim(), [loginIdentifier, loginPassword]);

  async function handleRegister(event: FormEvent) {
    event.preventDefault();
    if (!canRegister || loading) {
      return;
    }

    setLoading(true);
    setStatus(null);
    try {
      await requestJson('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          username: registerUsername.trim(),
          email: registerEmail.trim(),
          password: registerPassword,
        }),
      });
      setStatus({ type: 'success', text: '注册成功，请直接登录。' });
      setRegisterPassword('');
      setMode('login');
    } catch (error) {
      setStatus({ type: 'error', text: (error as Error).message });
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    if (!canLogin || loading) {
      return;
    }

    setLoading(true);
    setStatus(null);
    try {
      await requestJson('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          identifier: loginIdentifier.trim(),
          password: loginPassword,
        }),
      });
      setStatus({ type: 'success', text: '登录成功。' });
      setLoginPassword('');
      window.location.assign(readSafePostLoginPath());
    } catch (error) {
      setStatus({ type: 'error', text: (error as Error).message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.layout}>
        <aside className={styles.brandPanel}>
          <p className={styles.brandBadge}>Personal System</p>
          <h1>管理你的内容与记录</h1>
          <p>
            统一管理个人站内容、亮点清单与系统配置。登录后进入主页工作台，支持持续迭代和长期维护。
          </p>
          <ul className={styles.featureList}>
            <li>用户名/邮箱双模式登录</li>
            <li>Redis 会话，登录态稳定</li>
            <li>注册后可立即使用系统</li>
          </ul>
        </aside>

        <section className={styles.authCard}>
          <header className={styles.header}>
            <h2>{mode === 'login' ? '欢迎回来' : '创建账号'}</h2>
            <p>{mode === 'login' ? '请输入账号信息继续访问。' : '注册后可直接切换登录。'}</p>
          </header>

          <div className={styles.tabs}>
            <button
              type='button'
              onClick={() => setMode('login')}
              className={mode === 'login' ? styles.tabActive : styles.tab}
            >
              登录
            </button>
            <button
              type='button'
              onClick={() => setMode('register')}
              className={mode === 'register' ? styles.tabActive : styles.tab}
            >
              新用户注册
            </button>
          </div>

          {status && (
            <p className={status.type === 'error' ? styles.errorBanner : styles.successBanner}>{status.text}</p>
          )}

          {mode === 'login' ? (
            <section className={styles.block}>
              <form onSubmit={handleLogin} className={styles.form}>
                <label className={styles.field}>
                  <span>用户名或邮箱</span>
                  <input
                    value={loginIdentifier}
                    onChange={(event) => setLoginIdentifier(event.target.value)}
                    placeholder='请输入用户名或邮箱'
                  />
                </label>
                <label className={styles.field}>
                  <span>密码</span>
                  <input
                    value={loginPassword}
                    onChange={(event) => setLoginPassword(event.target.value)}
                    placeholder='请输入密码'
                    type='password'
                  />
                </label>
                <button type='submit' disabled={!canLogin || loading} className={styles.primaryButton}>
                  {loading ? '处理中...' : '登录并进入首页'}
                </button>
              </form>
            </section>
          ) : (
            <section className={styles.block}>
              <form onSubmit={handleRegister} className={styles.form}>
                <label className={styles.field}>
                  <span>用户名</span>
                  <input
                    value={registerUsername}
                    onChange={(event) => setRegisterUsername(event.target.value)}
                    placeholder='3-24位，字母数字下划线'
                  />
                </label>
                <label className={styles.field}>
                  <span>邮箱</span>
                  <input
                    value={registerEmail}
                    onChange={(event) => setRegisterEmail(event.target.value)}
                    placeholder='name@example.com'
                    type='email'
                  />
                </label>
                <label className={styles.field}>
                  <span>密码</span>
                  <input
                    value={registerPassword}
                    onChange={(event) => setRegisterPassword(event.target.value)}
                    placeholder='至少8位'
                    type='password'
                  />
                </label>
                <button type='submit' disabled={!canRegister || loading} className={styles.secondaryButton}>
                  {loading ? '处理中...' : '注册账号'}
                </button>
              </form>
            </section>
          )}
        </section>
      </section>
    </main>
  );
}
