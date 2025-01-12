import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Link href="/" className={styles.logo}>
          PiPi
        </Link>
        <div className={styles.rightMenu}>
          <span>파트너</span>
          <span>광고</span>
          <span>커머스</span>
        </div>
      </div>
    </header>
  );
}