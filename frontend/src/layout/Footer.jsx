
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <section className={styles.footerLogos}>
        <a href="https://www.education.gov.in/" target="_blank" rel="noopener noreferrer" className={styles.footerLogoItem}>
          <img src="/assets/images/department-logo.jpg" alt="" className={styles.emblemImg} />
          <div className={styles.logoText}>
            <strong>Ministry of Education</strong>
            <span>Government of India</span>
          </div>
        </a>
        <a href="https://www.dsel-education.gov.in/" target="_blank" rel="noopener noreferrer" className={styles.footerLogoItem}>
          <img src="/assets/images/department-logo.jpg" alt="" className={styles.emblemImg} />
          <div className={styles.logoText}>
            <strong>स्कूल शिक्षा और साक्षरता विभाग</strong>
            <span>Department of School<br />Education &amp; Literacy</span>
          </div>
        </a>
        <a href="https://udiseplus.gov.in/#/en/home" target="_blank" rel="noopener noreferrer" className={styles.footerLogoItem}>
          <span className={styles.udisePlusText}>UDISE<span>+</span></span>
        </a>
        <a href="https://pgi.udiseplus.gov.in/#/" target="_blank" rel="noopener noreferrer" className={styles.footerLogoItem}>
          <div className={styles.pgiPlaceholder}>
            <div className={styles.pgiIconWrap}>
              <div className={styles.pgiBookIcon}>&#128218;</div>
              <div className={styles.pgiStars}>&#9733;&#9733;&#9733;&#9733;&#9733;</div>
            </div>
            <div className={styles.logoText}>
              <strong className={styles.pgiText}>PERFORMANCE<br />GRADING INDEX <span className={styles.pgiSub}>(PGI)</span></strong>
            </div>
          </div>
        </a>
      </section>

      <footer className={styles.mainFooter}>
        <div className={styles.footerContainer}>
          <div className={styles.footerColumn}>
            <h4>Main Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/region">Region Profile</Link></li>
              <li><Link to="/syncCount">KYS Sync Count</Link></li>
            </ul>
          </div>
          <div className={styles.footerColumn}>
            <h4>Quick Links</h4>
            <ul>
              <li><a href="https://udiseplus.gov.in/#/en/home" target="_blank" rel="noopener noreferrer">UDISE+ Dashboard</a></li>
              <li><a href="https://www.education.gov.in/" target="_blank" rel="noopener noreferrer">Ministry Of Education</a></li>
              <li><a href="https://udiseplus.gov.in/" target="_blank" rel="noopener noreferrer">UDISE+</a></li>
              <li><a href="https://schoolgis.nic.in/" target="_blank" rel="noopener noreferrer">School GIS</a></li>
              <li><a href="https://udiseplus.gov.in/#/en/feedback" target="_blank" rel="noopener noreferrer">UDISE+ Feedback</a></li>
            </ul>
          </div>
          <div className={styles.footerColumn}>
            <h4>Other Links</h4>
            <ul>
              <li><Link to="/termsconditions">Terms & Conditions</Link></li>
              <li><Link to="/privacypolicy">Privacy Policy</Link></li>
              <li><Link to="/copyrightpolicy">Copyright Policy</Link></li>
              <li><Link to="/hyperlink">Hyperlink Policy</Link></li>
              <li><Link to="/disclaimer">Disclaimer</Link></li>
            </ul>
          </div>
          <div className={styles.footerRight}>
            <div className={styles.nicLogo}>
              <strong>NIC</strong>
              <div className={styles.nicText}>
                <span>एन आई सी</span>
                <span>National</span>
                <span>Informatics</span>
                <span>Centre</span>
              </div>
            </div>
            <p className={styles.versionText}>Version : V 0.5 (23-09-2025)</p>
          </div>
        </div>
        <button className={styles.scrollTopBtn} onClick={scrollToTop}>&#8679;</button>
      </footer>
    </>
  );
}
