'use client';

import { FormEvent, useMemo, useState } from 'react';
import styles from './page.module.css';

const workbenchValues = [
  {
    title: 'Capture Ideas',
    text: '先记下项目名、当前状态和下一步动作，不让想法只留在脑子里。',
  },
  {
    title: 'Track Momentum',
    text: '登录后第一眼先看状态，再决定今天把时间放到哪个项目上。',
  },
  {
    title: 'Stay Grounded',
    text: '第一版只保留真正会日常使用的工作台信息，不堆复杂管理功能。',
  },
] as const;

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
          <p className={styles.brandEyebrow}>Project Workbench</p>
          <h1>把项目想法、推进状态和下一步动作收进一个地方。</h1>
          <p className={styles.brandDescription}>
            这不是一个泛泛的个人主页入口，而是一个你每天都愿意打开的项目工作台。先看当前状态，再回到具体项目的下一步动作。（重构流程版）
          </p>

          <div className={styles.featureGrid}>
            {workbenchValues.map((item) => (
              <article key={item.title} className={styles.featureCard}>
                <p className={styles.featureTitle}>{item.title}</p>
                <p className={styles.featureText}>{item.text}</p>
              </article>
            ))}
          </div>

          <section className={styles.rhythmNote} aria-label='daily rhythm'>
            <p className={styles.rhythmLabel}>Daily Rhythm</p>
            <p>今天推进什么、暂停什么、下一步做什么，应该在 10 秒内就能回到上下文。</p>
          </section>
        </aside>

        <section className={styles.authCard}>
          <header className={styles.header}>
            <p className={styles.cardEyebrow}>{mode === 'login' ? 'Login' : 'Register'}</p>
            <h2>{mode === 'login' ? '欢迎回来' : '创建你的工作台账号'}</h2>
            <p>
              {mode === 'login'
                ? '输入账号信息，继续回到你的项目工作台。'
                : '先注册账号，再直接切回登录流程开始使用。'}
            </p>
          </header>

          <div className={styles.tabs}>
            <button
              type='button'
              onClick={() => setMode('login')}
              className={mode === 'login' ? styles.tabActive : styles.tab}
            >
              Login
            </button>
            <button
              type='button'
              onClick={() => setMode('register')}
              className={mode === 'register' ? styles.tabActive : styles.tab}
            >
              Register
            </button>
          </div>

          {status && (
            <p className={status.type === 'error' ? styles.errorBanner : styles.successBanner}>{status.text}</p>
          )}

          {mode === 'login' && (
            <section className={styles.inlineNote} aria-label='login note'>
              <p>支持用户名或邮箱登录，成功后会继续回到站内安全的目标路径。</p>
            </section>
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
                  {loading ? '处理中...' : '登录并进入工作台'}
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
                  {loading ? '处理中...' : '创建账号'}
                </button>
              </form>
            </section>
          )}
        </section>
      </section>
    </main>
  );
}
