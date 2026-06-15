import { Link } from 'react-router-dom';
import styles from './PolicyPage.module.css';

export default function PrivacyPolicy() {
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
            <h1 className={styles.heroTitle}>Privacy Policy</h1>
            <nav className={styles.breadcrumb}>
              <Link to="/home">Home</Link>
              <span className={styles.breadcrumbSep}>/</span>
              <span>Privacy Policy</span>
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
            <h2 className={styles.cardTitle}>Privacy Policy</h2>
            <div className={styles.cardBody}>
              <p className={styles.sectionHeading}>Privacy Policy for UDISE Plus – Know Your School Mobile App</p>
              <p>
                This privacy policy governs your access and usage of the UDISE Plus – Know Your
                School for mobile devices that is hosted at NIC e-Gov Mobile App Store and Google
                Play Store. The application mainly captures the location and photographs of the
                schools in UDISE+ database. The contents captured on this application will be
                used by the Department of School Education and Literacy, Ministry of Education,
                Government of India. The information captured through this application may not
                have any legal sanctity and is only for UDISE+ information, unless otherwise
                specified. Users are advised to verify the correctness of the details captured
                here from the concerned authorities. Neither National Informatics Centre nor
                Government of India will be responsible for the accuracy and correctness of the
                contents available in this application.
              </p>

              <p className={styles.sectionHeading}>User Provided Information:</p>
              <p>
                This application will only capture the GIS location and photographs of the school
                with the consent of the user. The user need not register on the application
                separately or provide any other additional information, as this app is mapped with
                the UDISE+ database, where the details would be already provided by the school/
                or block level user.
              </p>

              <p className={styles.sectionHeading}>Automatically Collected Information :</p>
              <p>
                The Application may collect certain information automatically, including, but not
                limited to, the type of mobile device you use, your mobile device's unique device
                ID, its IP address, mobile operating system, the type of mobile Internet browsers
                you use, and information about the way you use this application.
              </p>

              <p className={styles.sectionHeading}>We may disclose the Automatically Collected Information:</p>
              <ul>
                <li>as required by law, such as to comply with a subpoena, or similar legal process;</li>
                <li>when we believe in good faith that disclosure is necessary to protect our rights, protect your safety or the safety of others, investigate fraud, or respond to a government request;</li>
                <li>with our trusted services providers who work on our behalf, do not have an independent use of the information we disclose to them, and have agreed to adhere to the rules set forth in this privacy statement.</li>
              </ul>
              <p>
                You can stop all collection of information by the Application easily by
                uninstalling the Application. You may use the standard uninstall processes as may
                be available as part of your mobile device or via the mobile application
                marketplace or network.
              </p>

              <p className={styles.sectionHeading}>Data Retention Policy, Managing Your Information</p>
              <p>
                The location details and images provided by the school user will be retained till
                the time it is updated/ changed by the user as per the requirement.
              </p>
              <p>
                The school location and images captured through this application can be accessed
                by designated users at the block, district, state and national levels
              </p>

              <p className={styles.sectionHeading}>Misuse by Non-Targeted Users</p>
              <p>
                All mobile apps are meant for use by the targeted audience only. Misuse by
                non-targeted users should be prevented by owner of the mobile.
              </p>

              <p className={styles.sectionHeading}>Security</p>
              <p>
                We are concerned about safeguarding the confidentiality of your information. We
                provide physical, electronic, and procedural safeguards to protect information we
                process and maintain. For example, we limit access to this information to
                authorized employees and contractors who need to know that information in order to
                operate, develop or improve our application. Please be aware that, although we
                endeavour to provide reasonable security for information we process and maintain,
                no security system can prevent all potential security breaches
              </p>

              <p className={styles.sectionHeading}>Changes</p>
              <p>
                This Privacy Policy may be updated from time to time for any reason. You will be
                notified of any changes to our Privacy Policy here. You are advised to check the
                Privacy Policy regularly for any changes, as continued use is deemed approval of
                all changes. You can check the history of this policy
              </p>

              <p className={styles.sectionHeading}>Your Consent</p>
              <p>
                By using the Application, you are consenting to sharing, and our processing of
                your information as set forth in this Privacy Policy now and, as and when amended
                by us.
              </p>

              <p className={styles.sectionHeading}>Contact us</p>
              <p>
                If you have any questions regarding privacy while using the Application, or have
                questions about our practices, please contact us via email at
                udiseplus-mhrd[at]gov[dot]in
              </p>
              <ul>
                <li>Policy version : v.1.0</li>
                <li>Updated on : 06/06/2025</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
