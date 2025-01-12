import Link from 'next/link';
import styles from './main.module.css';

export default function Main() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>PiPi</h1>
      <p className={styles.description}>스트리밍 도구 플랫폼</p>
      <div className={styles.buttonContainer}>
        <Link href="/addon" className={styles.button}>
          스트리밍 Add-On
        </Link>
        <button className={styles.button}>퀴즈 퀴즈</button>
        <button className={styles.button}>미니 게임</button>
        <button className={styles.button}>미니 방송국</button>
      </div>
    </main>
  );
}