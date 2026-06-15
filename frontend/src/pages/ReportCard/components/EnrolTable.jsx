import styles from '../ReportCard.module.css';
import { GRADE_COLS } from '../constants';

export default function EnrolTable({ rows, total, categoryLabel = 'Class', useItemId = false }) {
  if (!rows || rows.length === 0) {
    return <p className={styles.noData}>Data not available for this academic year.</p>;
  }

  const rowTotals = rows.reduce((acc, row) => {
    GRADE_COLS.forEach(c => {
      acc[c.bKey] = (acc[c.bKey] || 0) + (row[c.bKey] || 0);
      acc[c.gKey] = (acc[c.gKey] || 0) + (row[c.gKey] || 0);
    });
    acc.rowBoyTotal  = (acc.rowBoyTotal  || 0) + (row.rowBoyTotal  || 0);
    acc.rowGirlTotal = (acc.rowGirlTotal || 0) + (row.rowGirlTotal || 0);
    acc.rowTotal     = (acc.rowTotal     || 0) + (row.rowTotal     || 0);
    return acc;
  }, {});

  return (
    <div className={styles.tableScroll}>
      <table className={styles.enrolTable}>
        <thead>
          <tr>
            <th className={styles.enrolTh} rowSpan={2}>{categoryLabel}</th>
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
          {rows.map((row, i) => (
            <tr key={i}>
              <td className={styles.enrolCat}>
                {useItemId ? String(row.itemId ?? '-') : (row.enrollmentName || '-')}
              </td>
              {GRADE_COLS.flatMap(c => [
                <td key={c.bKey} className={styles.enrolNum}>{row[c.bKey] ?? 0}</td>,
                <td key={c.gKey} className={styles.enrolNum}>{row[c.gKey] ?? 0}</td>,
              ])}
              <td className={styles.enrolNum}>{row.rowBoyTotal ?? 0}</td>
              <td className={styles.enrolNum}>{row.rowGirlTotal ?? 0}</td>
              <td className={styles.enrolNumBold}>{row.rowTotal ?? 0}</td>
            </tr>
          ))}

          <tr className={styles.enrolTotalRow}>
            <td className={styles.enrolCat}>TOTAL</td>
            {GRADE_COLS.flatMap(c => [
              <td key={c.bKey} className={styles.enrolNum}>{rowTotals[c.bKey] ?? 0}</td>,
              <td key={c.gKey} className={styles.enrolNum}>{rowTotals[c.gKey] ?? 0}</td>,
            ])}
            <td className={styles.enrolNum}>{rowTotals.rowBoyTotal ?? 0}</td>
            <td className={styles.enrolNum}>{rowTotals.rowGirlTotal ?? 0}</td>
            <td className={styles.enrolNumBold}>{rowTotals.rowTotal ?? 0}</td>
          </tr>

          {total && (
            <tr className={styles.enrolGTotalRow}>
              <td className={styles.enrolCat}>G.TOTAL</td>
              {GRADE_COLS.map(c => (
                <td key={c.totKey} className={styles.enrolNumBold} colSpan={2}>
                  {total[c.totKey] ?? 0}
                </td>
              ))}
              <td className={styles.enrolNumBold} colSpan={2}>{total.rowTotal ?? 0}</td>
              <td className={styles.enrolNumBold}>{total.finalTotal ?? total.rowTotal ?? 0}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
