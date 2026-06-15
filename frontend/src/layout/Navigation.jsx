import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Navigation.module.css';

export default function Navigation() {
  const location = useLocation();
  const pathname = location.pathname;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={styles.nav}>
      <div className={styles.innerContainer}>
        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
        <ul className={`${styles.navList}${menuOpen ? ` ${styles.navListOpen}` : ''}`}>
          <li>
            <Link
              to="/home"
              className={pathname === '/' || pathname === '/home' ? styles.navItemActive : styles.navItem}
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/region"
              className={pathname === '/region' ? styles.navItemActive : styles.navItem}
              onClick={() => setMenuOpen(false)}
            >
              Region Profile
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
