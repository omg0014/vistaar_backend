import styles from '../ReportCard.module.css';
import { GRADE_COLS } from '../constants';
import EnrolTable from '../components/EnrolTable';

const MINORITY_NAMES = new Set(['Muslim', 'Christian', 'Sikh', 'Buddhist', 'Parsi', 'Jain']);

export default function MinorityTab({ rows }) {
  const minorityReligious = rows.filter(r => MINORITY_NAMES.has(r.enrollmentName));
  const otherRows         = rows.filter(r => !MINORITY_NAMES.has(r.enrollmentName) && r.enrollmentName);

  const relTotal = minorityReligious.reduce((acc, row) => {
    GRADE_COLS.forEach(c => {
      acc[c.bKey] = (acc[c.bKey] || 0) + (row[c.bKey] || 0);
      acc[c.gKey] = (acc[c.gKey] || 0) + (row[c.gKey] || 0);
    });
    acc.rowBoyTotal  = (acc.rowBoyTotal  || 0) + (row.rowBoyTotal  || 0);
    acc.rowGirlTotal = (acc.rowGirlTotal || 0) + (row.rowGirlTotal || 0);
    acc.rowTotal     = (acc.rowTotal     || 0) + (row.rowTotal     || 0);
    return acc;
  }, {});

  const relGTotal = {};
  GRADE_COLS.forEach(c => { relGTotal[c.totKey] = (relTotal[c.bKey] || 0) + (relTotal[c.gKey] || 0); });
  relGTotal.rowTotal   = relTotal.rowTotal || 0;
  relGTotal.finalTotal = relTotal.rowTotal || 0;

  return (
    <div className={styles.tabContent}>
      <div className={styles.sectionTitle}>Enrolment (By minority and other)</div>

      {minorityReligious.length > 0 && (
        <EnrolTable rows={minorityReligious} total={relGTotal} />
      )}

      {otherRows.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div className={styles.tableScroll}>
            <table className={styles.enrolTable}>
              <thead>
                <tr>
                  <th className={styles.enrolTh} rowSpan={2}>Class</th>
                  {GRADE_COLS.map((c, i) => (
                    <th
                      key={c.label}
                      className={i > 0 && i % 2 === 0 ? styles.enrolThColored : styles.enrolTh}
                      colSpan={2}
                    >
                      {c.label === 'Pre-Pr' ? 'Pre-Pri.' : `Class ${c.label}`}
                    </th>
                  ))}
                  <th className={styles.enrolTh} colSpan={3}>Total</th>
                </tr>
                <tr>
                  {GRADE_COLS.flatMap((c, i) => [
                    <th key={c.bKey} className={i > 0 && i % 2 === 0 ? styles.enrolThSubColored : styles.enrolThSub}>B</th>,
                    <th key={c.gKey} className={i > 0 && i % 2 === 0 ? styles.enrolThSubColored : styles.enrolThSub}>G</th>,
                  ])}
                  <th className={styles.enrolThSub}>B</th>
                  <th className={styles.enrolThSub}>G</th>
                  <th className={styles.enrolThSub}>All</th>
                </tr>
              </thead>
              <tbody>
                {otherRows.map((row, i) => (
                  <tr key={i}>
                    <td className={styles.enrolCat}>{row.enrollmentName?.toUpperCase() || '-'}</td>
                    {GRADE_COLS.flatMap(c => [
                      <td key={c.bKey} className={styles.enrolNum}>{row[c.bKey] ?? 0}</td>,
                      <td key={c.gKey} className={styles.enrolNum}>{row[c.gKey] ?? 0}</td>,
                    ])}
                    <td className={styles.enrolNum}>{row.rowBoyTotal ?? 0}</td>
                    <td className={styles.enrolNum}>{row.rowGirlTotal ?? 0}</td>
                    <td className={styles.enrolNumBold}>{row.rowTotal ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {rows.length === 0 && (
        <p className={styles.noData}>Data not available for this academic year.</p>
      )}
    </div>
  );
}
