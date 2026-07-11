import { Link } from 'react-router-dom';
import styles from './Header.module.css';

export default function Header() {
  return (
    <>
      {/* Top banner: Gov of India | Ministry of Education */}
      <div className={styles.topBanner}>
        <div className={styles.innerContainer}>
          <a href="https://www.india.gov.in/" target="_blank" rel="noopener noreferrer" className={styles.bannerLink}>Government of India</a>
          <span className={styles.sep}>|</span>
          <a href="https://www.education.gov.in/" target="_blank" rel="noopener noreferrer" className={styles.bannerLink}>Ministry of Education</a>
        </div>
      </div>

      {/* Main header */}
      <header className={styles.header}>
        <div className={`${styles.innerContainer} ${styles.headerInner}`}>
          {/* Left: KYS logo */}
          <div className={styles.headerLeft}>
            <Link to="/" className={styles.logoLink}>
              <img
                src="/assets/images/kys-logo.svg"
                alt="Know Your School"
                className={styles.kysLogo}
              />
            </Link>
          </div>

          {/* Right: UDISE+ and Department logos */}
          <div className={styles.headerRight}>
            <a href="https://udiseplus.gov.in/#/en/home" target="_blank" rel="noopener noreferrer">
              <img src="/assets/images/udise-logo.png" alt="UDISE+" className={styles.udiseLogo} />
            </a>
            <a href="https://www.dsel-education.gov.in/" target="_blank" rel="noopener noreferrer">
              <img src="/assets/images/department-logo.jpg" alt="Department of School Education & Literacy" className={styles.deptLogo} />
            </a>
          </div>
        </div>
      </header>
    </>
  );
}
