import { Link } from 'react-router-dom';
import styles from './PolicyPage.module.css';

export default function HyperlinkPolicy() {
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
            <h1 className={styles.heroTitle}>Hyperlink Policy</h1>
            <nav className={styles.breadcrumb}>
              <Link to="/home">Home</Link>
              <span className={styles.breadcrumbSep}>/</span>
              <span>Hyperlink Policy</span>
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
            <h2 className={styles.cardTitle}>Hyperlink Policy</h2>
            <div className={styles.cardBody}>
              <p>
                At many places in this website, you shall find links to other websites/portals.
                These links have been placed for your convenience. National Informatic Centre is
                not responsible for the contents and reliability of the linked websites and does
                not necessarily endorse the views expressed in them. Mere presence of the link or
                its listing on this website should not be assumed as endorsement of any kind. We
                cannot guarantee that these links will work all the time, and we have no control
                over availability of linked pages.
              </p>

              <p>
                <strong>Links to the Know your school website by other websites/portals</strong>
              </p>
              <p>
                Prior permission is required before hyperlinks are directed from any
                website/portal to this site. Permission for the same, stating the nature of the
                content on the pages from where the link has to be given and the exact language
                of the Hyperlink should be taken from Ministry of Education.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
