import { Link } from 'react-router-dom';
import styles from './PolicyPage.module.css';

export default function TermsConditions() {
  const dots = Array.from({ length: 40 });

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroDecorDots}>
          {dots.map((_, i) => <span key={i} />)}
        </div>
        <div className={styles.heroInner}>
          <div className={styles.heroIllustration}>
            <img src="/assets/images/kys-logo.svg" alt="" />
          </div>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>Terms &amp; Conditions</h1>
            <nav className={styles.breadcrumb}>
              <Link to="/home">Home</Link>
              <span className={styles.breadcrumbSep}>/</span>
              <span>Terms &amp; Conditions</span>
            </nav>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className={styles.contentArea}>
        <div className={styles.contentDecor}>
          <div className={styles.sideDecorDots}>
            {Array.from({ length: 14 }).map((_, i) => <span key={i} />)}
          </div>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Terms &amp; Conditions</h2>
            <div className={styles.cardBody}>
              <p>
                This website is designed, developed and maintained by National Informatics Centre
                for Ministry of Education, Government of India.
              </p>
              <p>
                The contents of this website are for information purposes only, enabling the
                public at large to have a quick and an easy access to information and do not have
                any legal sanctity. Though all efforts have been made to ensure the accuracy of
                the content on this website, the same should not be construed as a statement of
                law or used for any legal purposes. In case of any ambiguity or doubts, users are
                advised to verify/check with the Ministry of Education and/or other source(s),
                and to obtain appropriate professional advice.
              </p>
              <p>
                Under no circumstances will NIC be liable for any expense, loss or damage
                including, without limitation, indirect or consequential loss or damage, or any
                expense, loss or damage whatsoever arising from use, or loss of use, of data,
                arising out of or in connection with the use of this website.
              </p>
              <p>
                These terms and conditions shall be governed by and construed in accordance with
                the Indian Laws. Any dispute arising under these terms and conditions shall be
                subject to the jurisdiction of the courts of India.
              </p>
              <p>
                The information posted on this website could include hypertext links or pointers
                to information created and maintained by non-Government / private organizations.
                National Informatics Centre is providing these links and pointers solely for your
                information and convenience. National Informatics Centre cannot authorize the use
                of copyrighted materials contained in linked websites. Users are advised to
                request such authorization from the owner of the linked website. National
                Informatic Centre, does not guarantee that linked websites comply with Indian
                Government Web Guidelines.
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
