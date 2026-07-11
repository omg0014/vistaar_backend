import { useParams, Link, useNavigate } from 'react-router-dom';
import styles from './SchoolDetail.module.css';
import useSchoolDetail from '../hooks/useSchoolDetail';
import { clean } from '../utils/formatters';

// Facility icons (SVG paths 24×24)
const FACILITY_ICONS = {
  toilet:    'M7 6c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm6 0c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zM6 8h4l1 5H9l-.5 5h-1L7 13H5l1-5zm8 0h4l1 5h-2l-.5 5h-1L15 13h-2l1-5z',
  tinkering: 'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z',
  library:   'M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z',
  electric:  'M7 2v11h3v9l7-12h-4l4-8z',
  playground:'M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z',
  water:     'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z',
  lab:       'M9 3v11.17l-2.44 2.44C5.68 17.49 5.86 19 6.99 19h10c1.13 0 1.31-1.51.44-2.39L15 14.17V3H9zm3 14c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2-8h-4V5h4v4z',
  medical:   'M20 6h-2.18c.07-.44.18-.88.18-1.33C18 2.54 16.3 1 14.24 1c-1.18 0-2.12.66-2.98 1.56L10 4 8.74 2.56C7.88 1.66 6.94 1 5.76 1 3.7 1 2 2.54 2 4.67 2 5.12 2.13 5.56 2.18 6H0v2h1v12h22V8h1V6h-4zm-5 9h-3v3h-2v-3H7v-2h3V10h2v3h3v2z',
  internet:  'M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4 2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z',
  ramp:      'M4 16v2h4v2h8v-2h4v-2H4zM12 2C9.24 2 7 4.24 7 7c0 2.04 1.19 3.81 2.93 4.67L12 13l2.07-1.33C15.81 10.81 17 9.04 17 7c0-2.76-2.24-5-5-5zm0 7c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z',
};

export default function SchoolDetail() {
  const { udise: schoolId, yearId = '11' } = useParams();
  const navigate = useNavigate();

  const { school, enrol, facility, profile, loading, error } = useSchoolDetail(schoolId);

  if (loading) return (
    <div className={styles.centerMsg}>
      <div className={styles.spinner} />
      <p>Loading school details…</p>
    </div>
  );

  if (error || !school) return (
    <div className={styles.centerMsg}>
      <p style={{ color: '#d32f2f' }}>{error || 'School not found.'}</p>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>← Go Back</button>
    </div>
  );

  const isOp      = school.schoolStatus === 0;
  const yearLabel = school.yearDesc || '';
  const totalTeachers = enrol ? (enrol.totalTeacherReg || 0) + (enrol.totalTeacherCon || 0) : 0;

  // Facilities list mapped from API fields
  const FACILITIES = [
    { label: 'Toilet',         icon: 'toilet',    yn: facility?.toiletYn },
    { label: 'Tinkering Lab',  icon: 'tinkering', yn: facility?.tinkeringLabYn },
    { label: 'Library',        icon: 'library',   yn: facility?.libraryYn },
    { label: 'Electric Power', icon: 'electric',  yn: facility?.electricityYn },
    { label: 'Playground',     icon: 'playground',yn: facility?.playgroundYn },
    { label: 'Drinking Water', icon: 'water',     yn: facility?.drinkWaterYn },
    { label: 'Laboratories',   icon: 'lab',       yn: facility?.integratedLabYn },
    { label: 'Medical Check-up', icon: 'medical', yn: facility?.medchkYn },
    { label: 'Internet',       icon: 'internet',  yn: facility?.internetYn },
    { label: 'Ramp',           icon: 'ramp',      yn: facility?.rampsYn },
  ];

  return (
    <div className={styles.page}>

      {/* ── School Info Header ─────────────────────────────────────── */}
      <div className={styles.infoCard}>
        <div className={styles.infoTop}>
          <div className={styles.infoLeft}>
            <div className={styles.udiseRow}>
              <span className={styles.udiseLabel}>UDISE Code :</span>
              <span className={styles.udiseCode}>{school.udiseschCode}</span>
              <span className={`${styles.statusBadge} ${isOp ? styles.operational : styles.closed}`}>
                {school.schoolStatusName || (isOp ? 'Operational' : 'Non-Operational')}
              </span>
            </div>
            <div className={styles.yearRow}>Academic Year : <strong>{yearLabel}</strong></div>
            <div className={styles.locationRow}>
              <span>State : <strong>{school.stateName}</strong></span>
              <span className={styles.pipe}>|</span>
              <span>District : <strong>{school.districtName}</strong></span>
              <span className={styles.pipe}>|</span>
              <span>Block : <strong>{school.blockName}</strong></span>
            </div>
            <h1 className={styles.schoolName}>{school.schoolName}</h1>
            {school.address && (
              <div className={styles.addressRow}>Address : {school.address}</div>
            )}
          </div>

          <div className={styles.infoRight}>
            <button className={styles.backLink} onClick={() => navigate(-1)}>‹ BACK</button>
            <div className={styles.actionBtns}>
              <Link
                to={`/reportcard/${schoolId}/${yearId}`}
                className={styles.reportBtn}
              >
                Report Card
              </Link>
              <Link
                to={`/trackschool?udise=${school.udiseschCode}`}
                className={styles.trackBtn}
              >
                Track School
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.content}>

        {/* ── Basic Details ──────────────────────────────────────────── */}
        <div className={styles.card}>
          <div className={styles.cardYearBadge}>Academic Year : <strong>2024-25</strong></div>
          <h2 className={styles.cardTitle}>Basic Details</h2>
          <div className={styles.basicGrid}>
            <BasicCell label="Location"               value={clean(school.schLocDesc)} />
            <BasicCell label="School Category"        value={clean(school.schCategoryType)} />
            <BasicCell label="Class From"             value={school.classFrm} />
            <BasicCell label="Class To"               value={school.classTo} />
            <BasicCell label="School Type"            value={clean(school.schTypeDesc)} />
            <BasicCell label="Year of Establishment"  value={profile?.estdYear || '—'} />
            <BasicCell label="National Management"    value={clean(school.schMgmtType)} />
            <BasicCell label="State Management"       value={clean(school.schMgmtDescSt)} />
            <BasicCell label="Affiliation Board Sec." value={clean(profile?.boardSecName) || '—'} />
            <BasicCell label="Affiliation Board HSec." value={clean(profile?.boardHighSecName) || '—'} />
          </div>
        </div>

        {/* ── Enrolment + Teachers ──────────────────────────────────── */}
        {enrol && (
          <div className={styles.card}>
            <div className={styles.cardYearBadge}>Academic Year : <strong>2024-25</strong></div>
            <div className={styles.statsRow}>

              {/* Student Enrolment */}
              <div className={styles.enrolCard}>
                <div className={styles.enrolTitle}>
                  <strong>Student Enrolment</strong>
                  <span className={styles.enrolSub}>(Class 1 To 12)</span>
                </div>
                <div className={styles.enrolInner}>
                  <div className={styles.enrolTotal}>
                    <div className={styles.enrolIconCircle}>
                      <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                        <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3 1 9l11 6 9-4.91V17h2V9L12 3z" />
                      </svg>
                    </div>
                    <div>
                      <div className={styles.enrolTotalLabel}>Total Students</div>
                      <div className={styles.enrolTotalNum}>{enrol.totalCount?.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className={styles.enrolBoys}>
                    <div className={styles.enrolStat}>Boys</div>
                    <div className={styles.enrolStatNum}>{enrol.totalBoy?.toLocaleString()}</div>
                  </div>
                  <div className={styles.enrolGirls}>
                    <div className={styles.enrolStat}>Girls</div>
                    <div className={styles.enrolStatNum}>{enrol.totalGirl?.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              {/* Teachers */}
              <div className={styles.teacherCard}>
                <div className={styles.teacherTitle}><strong>Teacher</strong></div>
                <div className={styles.teacherInner}>
                  <div className={styles.teacherTotal}>
                    <div className={styles.teacherIconCircle}>
                      <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 15.17 10.33 14 8 14zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                      </svg>
                    </div>
                    <div>
                      <div className={styles.enrolTotalLabel}>Total Teachers</div>
                      <div className={styles.enrolTotalNum}>{totalTeachers}</div>
                    </div>
                  </div>
                  <div className={styles.teacherMale}>
                    <div className={styles.enrolStat}>Male</div>
                    <div className={styles.enrolStatNum}>{enrol.totalTeacherMale}</div>
                  </div>
                  <div className={styles.teacherFemale}>
                    <div className={styles.enrolStat}>Female</div>
                    <div className={styles.enrolStatNum}>{enrol.totalTeacherFemale}</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ── Infrastructure & Facilities ───────────────────────────── */}
        {facility && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Infrastructure &amp; Facilities Available</h2>
            <div className={styles.facilityGrid}>
              {FACILITIES.map(f => (
                <div key={f.label} className={`${styles.facilityItem} ${f.yn === 1 ? styles.facActive : styles.facInactive}`}>
                  <div className={styles.facilityCircle}>
                    <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                      <path d={FACILITY_ICONS[f.icon]} />
                    </svg>
                  </div>
                  <span className={styles.facilityLabel}>{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function BasicCell({ label, value }) {
  return (
    <div className={styles.basicCell}>
      <div className={styles.basicLabel}>{label}</div>
      <div className={styles.basicValue}>{value ?? '—'}</div>
    </div>
  );
}
