import styles from '../ReportCard.module.css';
import { v } from '../constants';

export default function ProfileTab({ school, profile, facility }) {
  const pr = profile  || {};
  const fc = facility || {};
  const classRange = school.lowClass != null && school.highClass != null
    ? `${school.lowClass}-${school.highClass}` : 'NA';

  return (
    <div className={styles.tabContent}>
      <div className={styles.sectionTitle}>School Profile Details</div>

      {/* Location */}
      <table className={styles.dataTable}>
        <tbody>
          <tr>
            <td className={styles.tdLabel}>UDISE CODE</td>
            <td className={styles.tdValue}>{v(school.udiseschCode)}</td>
            <td className={styles.tdLabel}>School Name</td>
            <td className={styles.tdValue} colSpan={3}>{v(school.schoolName)}</td>
          </tr>
          <tr>
            <td className={styles.tdLabel}>State</td>
            <td className={styles.tdValue}>{v(school.stateName)}</td>
            <td className={styles.tdLabel}>Educational District</td>
            <td className={styles.tdValue}>{v(school.districtName)}</td>
            <td className={styles.tdLabel}>Educational Block</td>
            <td className={styles.tdValue}>{v(school.blockName)}</td>
          </tr>
          <tr>
            <td className={styles.tdLabel}>Rural / Urban</td>
            <td className={styles.tdValue}>{v(school.schLocDesc)}</td>
            <td className={styles.tdLabel}>Cluster</td>
            <td className={styles.tdValue}>{v(school.clusterName)}</td>
            <td className={styles.tdLabel}>Pincode</td>
            <td className={styles.tdValue}>{v(school.pincode)}</td>
          </tr>
          <tr>
            <td className={styles.tdLabel}>LGD Block</td>
            <td className={styles.tdValue}>{v(school.lgdblockName)}</td>
            <td className={styles.tdLabel}>Urban Local Body</td>
            <td className={styles.tdValue}>{v(school.lgdurbanlocalbodyName ?? school.lgdvillpanchayatName)}</td>
            <td className={styles.tdLabel}>LGD Ward</td>
            <td className={styles.tdValue}>{v(school.lgdwardName ?? school.lgdvillName ?? school.villWardName)}</td>
          </tr>
        </tbody>
      </table>

      {/* Category / Medium / Visits */}
      <table className={styles.dataTable} style={{ marginTop: 16 }}>
        <thead>
          <tr>
            <th className={styles.thGroup} colSpan={2}>School Category</th>
            <th className={styles.thGroup} colSpan={2}>Medium of Instruction</th>
            <th className={styles.thGroup} colSpan={2}>Visit to school for / by</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={styles.tdLabel}>School Category</td>
            <td className={styles.tdValue}>{v(school.schCategoryDesc)}</td>
            <td className={styles.tdLabel}>Medium 1</td>
            <td className={styles.tdValue}>{v(pr.mediumOfInstrName1)}</td>
            <td className={styles.tdLabel}>Acad. Inspections</td>
            <td className={styles.tdValue}>{v(pr.noInspect)}</td>
          </tr>
          <tr>
            <td className={styles.tdLabel}>School Management</td>
            <td className={styles.tdValue}>{v(school.schMgmtStateDesc ?? school.schMgmtNationalDesc)}</td>
            <td className={styles.tdLabel}>Medium 2</td>
            <td className={styles.tdValue}>{v(pr.mediumOfInstrName2)}</td>
            <td className={styles.tdLabel}>CRC Coordinator</td>
            <td className={styles.tdValue}>{v(pr.noVisitCrc)}</td>
          </tr>
          <tr>
            <td className={styles.tdLabel}>School Type</td>
            <td className={styles.tdValue}>{v(school.schTypeDesc)}</td>
            <td className={styles.tdLabel}>Medium 3</td>
            <td className={styles.tdValue}>{v(pr.mediumOfInstrName3)}</td>
            <td className={styles.tdLabel}>Block Level Officers</td>
            <td className={styles.tdValue}>{v(pr.noVisitBrc)}</td>
          </tr>
          <tr>
            <td className={styles.tdLabel}>Lowest &amp; Highest Class</td>
            <td className={styles.tdValue}>{classRange}</td>
            <td className={styles.tdLabel}>Medium 4</td>
            <td className={styles.tdValue}>{v(pr.mediumOfInstrName4)}</td>
            <td className={styles.tdLabel}>State/District Officers</td>
            <td className={styles.tdValue}>{v(pr.noVisitDis)}</td>
          </tr>
          <tr>
            <td className={styles.tdLabel}>Pre Primary</td>
            <td className={styles.tdValue}>{v(pr.anganwadiYnDesc)}</td>
            <td colSpan={4} />
          </tr>
        </tbody>
      </table>

      {/* Establishment / Building / Residential */}
      <table className={styles.dataTable} style={{ marginTop: 16 }}>
        <tbody>
          <tr>
            <td className={styles.tdLabel}>Year of Establishment</td>
            <td className={styles.tdValue}>{v(pr.estdYear)}</td>
            <td className={styles.tdLabel}>Is this a Shift School?</td>
            <td className={styles.tdValue}>{v(pr.shiftSchYnDesc)}</td>
            <td className={styles.tdLabel}>Anganwadi At Premises</td>
            <td className={styles.tdValue}>{v(pr.anganwadiYnDesc)}</td>
          </tr>
          <tr>
            <td className={styles.tdLabel}>Year of Recognition-Pri.</td>
            <td className={styles.tdValue}>{v(pr.recogYearPri)}</td>
            <td className={styles.tdLabel}>Building Status</td>
            <td className={styles.tdValue}>{v(fc.bldStatus)}</td>
            <td className={styles.tdLabel}>Residential School</td>
            <td className={styles.tdValue}>{v(pr.resiSchDesc)}</td>
          </tr>
          <tr>
            <td className={styles.tdLabel}>Year of Recognition-Upr.Pr.</td>
            <td className={styles.tdValue}>{v(pr.recogYearUpr)}</td>
            <td className={styles.tdLabel}>Boundary wall</td>
            <td className={styles.tdValue}>{v(fc.bndrywallType)}</td>
            <td className={styles.tdLabel}>Residential Type</td>
            <td className={styles.tdValue}>{v(pr.resiSchTypeName)}</td>
          </tr>
          <tr>
            <td className={styles.tdLabel}>Year of Recognition-Sec.</td>
            <td className={styles.tdValue}>{v(pr.recogYearSec)}</td>
            <td className={styles.tdLabel}>No.of Building Blocks</td>
            <td className={styles.tdValue}>{v(fc.bldBlkTot)}</td>
            <td className={styles.tdLabel}>Minority School</td>
            <td className={styles.tdValue}>{v(pr.minorityYnDesc)}</td>
          </tr>
          <tr>
            <td className={styles.tdLabel}>Year of Recognition-Higher Sec.</td>
            <td className={styles.tdValue}>{v(pr.recogYearHsec)}</td>
            <td className={styles.tdLabel}>Pucca Building Blocks</td>
            <td className={styles.tdValue}>{v(fc.bldBlk)}</td>
            <td className={styles.tdLabel}>Approachable By All Weather Road</td>
            <td className={styles.tdValue}>{v(pr.approachRoadYnDesc)}</td>
          </tr>
          <tr>
            <td className={styles.tdLabel}>Affiliation Board-Sec</td>
            <td className={styles.tdValue}>{v(pr.boardSecName)}</td>
            <td className={styles.tdLabel}>Is Special School for CWSN?</td>
            <td className={styles.tdValue}>{v(pr.cwsnSchYnDesc)}</td>
            <td className={styles.tdLabel}>Availability of Handrails</td>
            <td className={styles.tdValue}>{v(fc.handrailsYnDesc)}</td>
          </tr>
          <tr>
            <td className={styles.tdLabel}>Affiliation Board-H.Sec</td>
            <td className={styles.tdValue}>{v(pr.boardHighSecName)}</td>
            <td className={styles.tdLabel}>Availability of Ramps</td>
            <td className={styles.tdValue}>{v(fc.rampsYnDesc)}</td>
            <td colSpan={2} />
          </tr>
        </tbody>
      </table>
    </div>
  );
}
