import { Link } from 'react-router-dom';
import styles from './PolicyPage.module.css';

export default function CopyrightPolicy() {
  const dots = Array.from({ length: 40 });

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroDecorDots}>
          {dots.map((_, i) => <span key={i} />)}
        </div>
        <div className={styles.heroInner}>
          <div className={styles.heroIllustration}>
            <img src="/assets/images/kys-logo.svg" alt="" />
          </div>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>Copyright Policy</h1>
            <nav className={styles.breadcrumb}>
              <Link to="/home">Home</Link>
              <span className={styles.breadcrumbSep}>/</span>
              <span>Copyright Policy</span>
            </nav>
          </div>
        </div>
      </section>

      <div className={styles.contentArea}>
        <div className={styles.contentDecor}>
          <div className={styles.sideDecorDots}>
            {Array.from({ length: 14 }).map((_, i) => <span key={i} />)}
          </div>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Copyright Policy</h2>
            <div className={styles.cardBody}>
              <p>
                Material featured on this site may not be reproduced in any format or media
                without due permission from Ministry of Education. This is subject to the material
                being reproduced accurately and not being used in a derogatory manner or in a
                misleading context. Where the material is being published or issued to others, the
                source must be prominently acknowledged. However, the permission to reproduce this
                material does not extend to any material on this site, which is explicitly
                identified as being the copyright of a third party. Authorisation to reproduce
                such material must be obtained from the copyright holders concerned.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
