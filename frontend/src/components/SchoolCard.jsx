import { Link } from 'react-router-dom';
import styles from './SchoolCard.module.css';

const YEAR_ID_MAP = {
  'Real Time': 0, '2024-25': 11, '2023-24': 10, '2022-23': 9, '2021-22': 8,
};

export default function SchoolCard({ school }) {
  const udise = school.udiseschCode || 'N/A';
  const name = (school.schoolName || 'Unknown School').trim();
  const year = school.yearDesc || '2024-25';
  const yearId = YEAR_ID_MAP[year] ?? 11;
  const isOperational = school.schoolStatus === 0;
  const lowCls  = school.lowClass  ?? school.classFrm;
  const highCls = school.highClass ?? school.classTo;
  const classRange = lowCls !== undefined && highCls !== undefined
    ? `${lowCls} To ${highCls}` : 'N/A';

  const schoolId = school.schoolId || udise;
  const detailPath = udise !== 'N/A' ? `/schooldetail/${schoolId}/${yearId}` : '#';

  return (
    <div className={styles.card}>
      {/* Top row */}
      <div className={styles.topRow}>
        <div className={styles.badges}>
          <span className={styles.udiseBadge}>
            UDISE Code: <span className={styles.udiseCode}>{udise}</span>
          </span>
          <span
            className={styles.statusBadge}
            style={{ background: isOperational ? '#10B981' : '#EF4444' }}
          >
            {school.schStatusName || school.schoolStatusName || (isOperational ? 'Operational' : 'Non-Operational')}
          </span>
        </div>
        <div className={styles.locationInfo}>
          <b>State:</b> <span>{school.stateName || 'N/A'}</span>&nbsp;&nbsp;
          <b>Edu. District:</b> <span>{school.districtName || 'N/A'}</span>&nbsp;&nbsp;
          <b>Edu. Block:</b> <span>{school.blockName || 'N/A'}</span>
        </div>
      </div>

      {/* Title row */}
      <div className={styles.schoolTitleRow}>
        <div className={styles.schoolName}>{name}</div>
        <div className={styles.academicYear}>Academic Year: {year}</div>
      </div>

      {/* Details grid */}
      <div className={styles.detailsGrid}>
        <div className={styles.detailCol}>
          <InfoItem label="School Category"  value={school.schCategoryDesc || school.schCatDesc || 'N/A'} />
          <InfoItem label="Class"            value={classRange} />
          <InfoItem label="School Location"  value={school.schLocDesc || 'N/A'} />
          <InfoItem label="LGD Panchayat"   value={school.lgdPanDesc || school.lgdvillpanchayatName || school.panDesc || 'NA'} />
        </div>

        <div className={styles.detailCol}>
          <InfoItem label="School Management" value={school.schMgmtStateDesc || school.schMgmtDescSt || school.schMgmtDesc || school.schMgmtNationalDesc || school.schMgmNationalDesc || 'N/A'} />
          <InfoItem label="School Type"       value={school.schTypeDesc || 'N/A'} />
          <InfoItem label="LGD Block"         value={school.lgdBlockName || school.lgdblockName || school.blockName || 'N/A'} />
          <InfoItem label="LGD Village"       value={school.lgdVillWardName || school.lgdvillName || school.villWardName || 'NA'} />
        </div>

        <div className={styles.rightPanel}>
          <div className={styles.addressBox}>
            <InfoItem label="Address"  value={school.address || 'N/A'} />
            <div style={{ marginTop: 6, fontSize: '0.75rem', color: '#374151', fontWeight: 700 }}>
              PIN Code: <span style={{ fontWeight: 400, color: '#4B5563' }}>{school.pincode || 'N/A'}</span>
            </div>
          </div>
          <div className={styles.btnGroup}>
            <Link to={`/reportcard/${school.schoolId || udise}/${yearId}`} className={`${styles.cardBtn} ${styles.reportBtn}`}>
              Report Card
            </Link>
            <Link to={detailPath} className={`${styles.cardBtn} ${styles.knowBtn}`}>
              Know More
            </Link>
            <Link to={`/trackschool?id=${school.schoolId}&name=${encodeURIComponent(name)}`} className={`${styles.cardBtn} ${styles.trackBtn}`}>
              Track School
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.lastModified}>
        Last Modified Time: {school.lastModifiedTime || school.lastmodifiedTime || school.lastModified || '—'}
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className={styles.detailItem}>
      <span className={styles.detailLabel}>{label}:</span>
      <span className={styles.detailValue}>{value}</span>
    </div>
  );
}
