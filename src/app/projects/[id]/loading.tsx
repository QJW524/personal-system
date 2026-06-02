import styles from './page.module.css';

export default function Loading() {
  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <div className={styles.stateCard}>
          <p className={styles.eyebrow}>Loading</p>
          <h1 className={styles.stateTitle}>正在载入项目详情…</h1>
          <p className={styles.stateBody}>把当前目标、下一步动作和最近更新整理到同一页里，马上就好。</p>
        </div>
      </div>
    </main>
  );
}
