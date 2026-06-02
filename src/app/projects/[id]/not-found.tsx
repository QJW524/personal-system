import Link from 'next/link';
import styles from './page.module.css';

export default function NotFound() {
  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <div className={styles.stateCard}>
          <p className={styles.eyebrow}>Not Found</p>
          <h1 className={styles.stateTitle}>没有找到这个项目。</h1>
          <p className={styles.stateBody}>它可能不存在，或者当前登录账号没有访问权限。你可以先回到工作台查看其他项目。</p>
          <Link href='/' className={styles.backLink}>
            返回工作台
          </Link>
        </div>
      </div>
    </main>
  );
}
