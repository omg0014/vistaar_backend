import styles from '../ReportCard.module.css';
import { v } from '../constants';

export default function InfraTab({ facility, school, profile }) {
  const fc = facility || {};
  const pr = profile  || {};

  return (
    <div className={styles.tabContent}>
      <div className={styles.sectionTitle}>Infra &amp; Other Facility</div>

      {/* Toilets / Classrooms / Water */}
      <table className={styles.dataTable}>
        <thead>
          <tr>
            <th className={styles.thGroup} colSpan={3}>Toilets</th>
            <th className={styles.thGroup} colSpan={2}>Classrooms</th>
            <th className={styles.thGroup} colSpan={2}>Water &amp; Sanitation</th>
          </tr>
          <tr>
            <th className={styles.thGroup}></th>
            <th className={styles.thGroup}>Boys</th>
            <th className={styles.thGroup}>Girls</th>
            <th className={styles.thGroup}>Total Class Rooms</th>
            <th className={styles.thGroup}>{v(fc.clsrmsInst)}</th>
            <th className={styles.thGroup}>Drinking Water Available</th>
            <th className={styles.thGroup}>{v(fc.drinkWaterYnDesc)}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={styles.tdLabel}>Total (Excl. CWSN)</td>
            <td className={styles.tdValue}>{v(fc.toiletb)}</td>
            <td className={styles.tdValue}>{v(fc.toiletg)}</td>
            <td className={styles.tdLabel}>In Good Condition</td>
            <td className={styles.tdValue}>{v(fc.clsrmsGd)}</td>
            <td className={styles.tdLabel}>Drinking Water Functional</td>
            <td className={styles.tdValue}>{v(fc.drinkWaterYnDesc)}</td>
          </tr>
          <tr>
            <td className={styles.tdLabel}>Functional</td>
            <td className={styles.tdValue}>{v(fc.toiletbFun)}</td>
            <td className={styles.tdValue}>{v(fc.toiletgFun)}</td>
            <td className={styles.tdLabel}>Needs Minor Repair</td>
            <td className={styles.tdValue}>{v(fc.clsrmsMin)}</td>
            <td className={styles.tdLabel}>Rain Water Harvesting</td>
            <td className={styles.tdValue}>{v(fc.rainHarvestYnDesc)}</td>
          </tr>
          <tr>
            <td className={styles.tdLabel}>Func. CWSN Friendly</td>
            <td className={styles.tdValue}>{v(fc.toiletbCwsnFun)}</td>
            <td className={styles.tdValue}>{v(fc.toiletgCwsnFun)}</td>
            <td className={styles.tdLabel}>Needs Major Repair</td>
            <td className={styles.tdValue}>{v(fc.clsrmsMaj)}</td>
            <td className={styles.tdLabel}>Playground Available</td>
            <td className={styles.tdValue}>{v(fc.playgroundYnDesc)}</td>
          </tr>
          <tr>
            <td className={styles.tdLabel}>Urinal</td>
            <td className={styles.tdValue}>{v(fc.urinalsb)}</td>
            <td className={styles.tdValue}>{v(fc.urinalsg)}</td>
            <td className={styles.tdLabel}>Other Rooms</td>
            <td className={styles.tdValue}>{v(fc.othrooms)}</td>
            <td className={styles.tdLabel}>Furniture Availability</td>
            <td className={styles.tdValue}>{v(fc.stusHvFurnt)}</td>
          </tr>
          <tr>
            <td className={styles.tdLabel}>Handwash Near Toilet</td>
            <td className={styles.tdValue} colSpan={2}>{v(fc.handwashYnDesc)}</td>
            <td className={styles.tdLabel}>Library Availability</td>
            <td className={styles.tdValue}>{v(fc.libraryYnDesc)}</td>
            <td className={styles.tdLabel}>Electricity Availability</td>
            <td className={styles.tdValue}>{v(fc.electricityYnDesc)}</td>
          </tr>
          <tr>
            <td className={styles.tdLabel}>Handwash Facility for Meal</td>
            <td className={styles.tdValue} colSpan={2}>{v(fc.handwashMealYnDesc)}</td>
            <td className={styles.tdLabel}>Separate Room for HM</td>
            <td className={styles.tdValue}>{v(fc.hmRoomYnDesc)}</td>
            <td className={styles.tdLabel}>Solar Panel</td>
            <td className={styles.tdValue}>{v(fc.solarpanelYnDesc)}</td>
          </tr>
          <tr>
            <td colSpan={3} />
            <td className={styles.tdLabel}>Medical Checkups</td>
            <td className={styles.tdValue}>{v(fc.medchkYnDesc)}</td>
            <td colSpan={2} />
          </tr>
        </tbody>
      </table>

      {/* Digital + Students Received */}
      <div className={styles.infraDoubleGrid} style={{ marginTop: 16 }}>
        <div>
          <div className={styles.sectionTitle} style={{ marginBottom: 8 }}>Digital Facilities (Functional)</div>
          <table className={styles.dataTable}>
            <tbody>
              <tr>
                <td className={styles.tdLabel}>ICT Lab</td>
                <td className={styles.tdValue}>{v(fc.ictLabYnDesc)}</td>
                <td className={styles.tdLabel}>Internet</td>
                <td className={styles.tdValue}>{v(fc.internetYnDesc)}</td>
                <td className={styles.tdLabel}>Desktop</td>
                <td className={styles.tdValue}>{v(fc.desktopFun)}</td>
              </tr>
              <tr>
                <td className={styles.tdLabel}>Laptop</td>
                <td className={styles.tdValue}>{v(fc.laptopTot)}</td>
                <td className={styles.tdLabel}>Tablet</td>
                <td className={styles.tdValue}>{v(fc.tabletsTot)}</td>
                <td className={styles.tdLabel}>Printer</td>
                <td className={styles.tdValue}>{v(fc.printerTot)}</td>
              </tr>
              <tr>
                <td className={styles.tdLabel}>Projector</td>
                <td className={styles.tdValue}>{v(fc.projectorTot)}</td>
                <td className={styles.tdLabel}>DTH</td>
                <td className={styles.tdValue}>{v(fc.accessDthYnDesc)}</td>
                <td className={styles.tdLabel}>DigiBoard</td>
                <td className={styles.tdValue}>{v(fc.digiBoardTot)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <div className={styles.sectionTitle} style={{ marginBottom: 8 }}>No. of Students Received</div>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th className={styles.thGroup}></th>
                <th className={styles.thGroup}>Pri.</th>
                <th className={styles.thGroup}>Up.Pri.</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={styles.tdLabel}>Free Text Books</td>
                <td className={styles.tdValue}>{v(school.ftbPr)}</td>
                <td className={styles.tdValue}>{v(school.ftbUpr)}</td>
              </tr>
              <tr>
                <td className={styles.tdLabel}>Transport</td>
                <td className={styles.tdValue}>{v(school.transptPr)}</td>
                <td className={styles.tdValue}>{v(school.transptUpr)}</td>
              </tr>
              <tr>
                <td className={styles.tdLabel}>Free Uniform</td>
                <td className={styles.tdValue}>{v(school.uniformPr)}</td>
                <td className={styles.tdValue}>{v(school.uniformUpr)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SMC + Indicators */}
      <div className={styles.infraDoubleGrid} style={{ marginTop: 16 }}>
        <div>
          <div className={styles.sectionTitle} style={{ marginBottom: 8 }}>SMC &amp; SMDC Information</div>
          <table className={styles.dataTable}>
            <tbody>
              <tr>
                <td className={styles.tdLabel}>SMC Exists</td>
                <td className={styles.tdValue}>{v(pr.smcYnDesc ?? school.smcYn)}</td>
                <td className={styles.tdLabel}>SMDC Constituted</td>
                <td className={styles.tdValue}>{v(pr.smdcYnDesc ?? school.smdcYn)}</td>
              </tr>
              <tr>
                <td className={styles.tdLabel}>Text Books Received</td>
                <td className={styles.tdValue}>{v(pr.txtbkPriYnDesc)}</td>
                <td colSpan={2} />
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <div className={styles.sectionTitle} style={{ marginBottom: 8 }}>Indicators</div>
          <table className={styles.dataTable}>
            <tbody>
              <tr>
                <td className={styles.tdLabel}>Instructional Days</td>
                <td className={styles.tdValue}>{v(pr.instructionalDays)}</td>
              </tr>
              <tr>
                <td className={styles.tdLabel}>CCE</td>
                <td className={styles.tdValue}>{v(pr.cceYnDesc)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Grants */}
      <div className={styles.sectionTitle} style={{ marginTop: 16, marginBottom: 8 }}>
        Grants Details under Samagra Shiksha
      </div>
      <table className={styles.dataTable}>
        <tbody>
          <tr>
            <td className={styles.tdLabel}>Grants Receipt (₹)</td>
            <td className={styles.tdValue}>{v(school.totalGrant)}</td>
            <td className={styles.tdLabel}>Grants Expenditure (₹)</td>
            <td className={styles.tdValue}>{v(school.totalExpediture)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
