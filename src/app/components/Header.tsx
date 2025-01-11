import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <h1 className={styles.title}>PiPi</h1>
        <div className={styles.navLinks}>
          <Link className={styles.navLink} href="#">파트너</Link>
          <Link className={styles.navLink} href="#">광고</Link>
          <Link className={styles.navLink} href="#">커머스</Link>
        </div>
      </nav>
    </header>
  );
}