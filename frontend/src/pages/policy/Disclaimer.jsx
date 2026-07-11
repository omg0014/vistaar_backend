import { Link } from 'react-router-dom';
import styles from './PolicyPage.module.css';

export default function Disclaimer() {
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
            <h1 className={styles.heroTitle}>Disclaimer</h1>
            <nav className={styles.breadcrumb}>
              <Link to="/home">Home</Link>
              <span className={styles.breadcrumbSep}>/</span>
              <span>Disclaimer</span>
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
            <h2 className={styles.cardTitle}>Disclaimer</h2>
            <div className={styles.cardBody}>
              <p>
                This Website is designed &amp; developed by National Informatics Centre and
                maintained by Ministry of Education, Government of India.
              </p>

              <p>
                The contents of this website are for information purposes only, enabling the
                public at large to have a quick and an easy access to information and do not have
                any legal sanctity. Though every effort is made to provide accurate and updated
                information, it is likely that some details such as telephone numbers, names of
                the officer holding a post, etc may have changed prior to their update on the
                website. Hence, we do not assume any legal liability on the completeness, accuracy
                or usefulness of the contents provided in this website.
              </p>

              <p>
                The links are provided to other external sites in some web pages/documents. We do
                not take responsibility for the accuracy of the contents in those sites. The
                hyperlink given to external sites do not constitute an endorsement of information,
                products or services offered by these sites.
              </p>

              <p>
                Despite our best efforts, we do not guarantee that the documents in this site are
                free from infection by computer viruses etc.
              </p>

              <p>
                We welcome your suggestions to improve this website and request that error(if any)
                may kindly be brought to our notice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
