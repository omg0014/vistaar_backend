import styles from '../ReportCard.module.css';
import { v } from '../constants';

export default function TeachersTab({ school }) {
  const computerTrained = (school.compM || 0) + (school.compF || 0) || school.compT || 0;

  return (
    <div className={styles.tabContent}>
      <div className={styles.sectionTitle}>Teachers</div>

      {/* Classes taught / Appointment type / Gender */}
      <table className={styles.dataTable}>
        <thead>
          <tr>
            <th className={styles.thGroup} colSpan={4}>Classes Taught</th>
            <th className={styles.thGroup} colSpan={2}>Nature of Appointment</th>
            <th className={styles.thGroup} colSpan={2}>Gender</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={styles.tdLabel}>1-Primary</td>
            <td className={styles.tdValue}>{v(school.tchCat1)}</td>
            <td className={styles.tdLabel}>2-Up.Pr.</td>
            <td className={styles.tdValue}>{v(school.tchCat2)}</td>
            <td className={styles.tdLabel}>Regular</td>
            <td className={styles.tdValue}>{v(school.tchReg)}</td>
            <td className={styles.tdLabel}>Male</td>
            <td className={styles.tdValue}>{v(school.totMale)}</td>
          </tr>
          <tr>
            <td className={styles.tdLabel}>3-Pr. &amp; Up.Pr</td>
            <td className={styles.tdValue}>{v(school.tchCat3)}</td>
            <td className={styles.tdLabel}>5-Sec. only</td>
            <td className={styles.tdValue}>{v(school.tchCat5)}</td>
            <td className={styles.tdLabel}>Part-time</td>
            <td className={styles.tdValue}>{v(school.tchPart)}</td>
            <td className={styles.tdLabel}>Female</td>
            <td className={styles.tdValue}>{v(school.totFemale)}</td>
          </tr>
          <tr>
            <td className={styles.tdLabel}>6-H Sec only</td>
            <td className={styles.tdValue}>{v(school.tchCat6)}</td>
            <td className={styles.tdLabel}>7-Up pri and Sec.</td>
            <td className={styles.tdValue}>{v(school.tchCat7)}</td>
            <td className={styles.tdLabel}>Contract</td>
            <td className={styles.tdValue}>{v(school.tchCont)}</td>
            <td className={styles.tdLabel}>Transgender</td>
            <td className={styles.tdValue}>{v(school.totNr)}</td>
          </tr>
          <tr>
            <td className={styles.tdLabel}>8-Sec and H Sec</td>
            <td className={styles.tdValue}>{v(school.tchCat8)}</td>
            <td className={styles.tdLabel}>10- Pre-Primary Only.</td>
            <td className={styles.tdValue}>{v(school.tchCat10)}</td>
            <td colSpan={2} />
            <td className={styles.tdLabel}>Total</td>
            <td className={styles.tdValue}>{v(school.totalTeacher)}</td>
          </tr>
          <tr>
            <td className={styles.tdLabel}>11-Pre- Pri &amp; Pr</td>
            <td className={styles.tdValue}>{v(school.tchCat11)}</td>
            <td colSpan={3} />
            <th className={styles.thGroup} colSpan={2}>Academic Qualification</th>
            <td colSpan={2} />
          </tr>
        </tbody>
      </table>

      {/* Age / Training */}
      <table className={styles.dataTable} style={{ marginTop: 12 }}>
        <tbody>
          <tr>
            <td className={styles.tdLabel}>Teachers Aged above 55</td>
            <td className={styles.tdValue} colSpan={3}>{v(school.tchAbove55)}</td>
            <td className={styles.tdLabel}>Below Graduate</td>
            <td className={styles.tdValue}>{v(school.totTchBelowGraduate)}</td>
            <td className={styles.tdLabel}>Graduate</td>
            <td className={styles.tdValue}>{v(school.totTchGraduateAbove)}</td>
          </tr>
          <tr>
            <td className={styles.tdLabel}>No. of Total Teacher Received Service Training</td>
            <td className={styles.tdValue} colSpan={3}>{v(school.tchRecvdServiceTrng)}</td>
            <td className={styles.tdLabel}>Post Graduate and Above</td>
            <td className={styles.tdValue} colSpan={3}>{v(school.totTchPgraduateAbove)}</td>
          </tr>
          <tr>
            <td className={styles.tdLabel}>Total Teacher Involve in Non Training Assignment</td>
            <td className={styles.tdValue} colSpan={3}>{v(school.tchInvlovedNonTchAssign)}</td>
            <td className={styles.tdLabel}>Total Teacher Trained in Computer</td>
            <td className={styles.tdValue} colSpan={3}>{v(computerTrained)}</td>
          </tr>
        </tbody>
      </table>

      {/* Professional Qualifications */}
      <div className={styles.sectionTitle} style={{ marginTop: 20 }}>Professional Qualifications</div>
      <table className={styles.dataTable}>
        <tbody>
          <tr>
            <td className={styles.tdLabel}>Diploma or Certificate in basic teachers training</td>
            <td className={styles.tdValue}>{v(school.profQual1)}</td>
            <td className={styles.tdLabel}>Bachelor of Elementary Education (B.El.Ed.)</td>
            <td className={styles.tdValue}>{v(school.profQual2)}</td>
          </tr>
          <tr>
            <td className={styles.tdLabel}>B.Ed. or Equivalent</td>
            <td className={styles.tdValue}>{v(school.profQual3)}</td>
            <td className={styles.tdLabel}>M.Ed. or Equivalent</td>
            <td className={styles.tdValue}>{v(school.profQual4)}</td>
          </tr>
          <tr>
            <td className={styles.tdLabel}>Other</td>
            <td className={styles.tdValue}>{v(school.profQual5)}</td>
            <td className={styles.tdLabel}>None</td>
            <td className={styles.tdValue}>{v(school.profQual6)}</td>
          </tr>
          <tr>
            <td className={styles.tdLabel}>Diploma/degree in special Education</td>
            <td className={styles.tdValue}>{v(school.profQual7)}</td>
            <td className={styles.tdLabel}>Pursuing any Relevant Professional Course</td>
            <td className={styles.tdValue}>{v(school.profQual8)}</td>
          </tr>
          <tr>
            <td className={styles.tdLabel}>10-Diploma in Elementary Education (D.El.Ed.)</td>
            <td className={styles.tdValue}>{v(school.profQual10)}</td>
            <td className={styles.tdLabel}>11-Diploma in Nursery Teacher Education</td>
            <td className={styles.tdValue}>{v(school.profQual11)}</td>
          </tr>
          <tr>
            <td className={styles.tdLabel}>12-B.Ed (Nursery) from NCTE recognized institution</td>
            <td className={styles.tdValue}>{v(school.profQual12)}</td>
            <td colSpan={2} />
          </tr>
        </tbody>
      </table>
    </div>
  );
}
