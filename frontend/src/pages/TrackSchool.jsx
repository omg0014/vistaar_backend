import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import styles from './TrackSchool.module.css';
import { trackSchool } from '../services/schoolService';
import { clean } from '../utils/formatters';

// ── Sub-components ──────────────────────────────────────────────

function Field({ label, value }) {
  return (
    <div className={styles.listField}>
      <span className={styles.listLabel}>{label}: </span>
      {value || '—'}
    </div>
  );
}

function StatusTag({ name, status }) {
  const isOp = status === 0;
  return (
    <span className={isOp ? styles.statusTag : styles.statusTagRed}>
      {name || (isOp ? 'Operational' : 'Non-Operational')}
    </span>
  );
}

// ── Calendar SVG icon ───────────────────────────────────────────
function CalIcon() {
  return (
    <svg className={styles.calIcon} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8"  y1="2" x2="8"  y2="6" />
      <line x1="3"  y1="10" x2="21" y2="10" />
    </svg>
  );
}

// ── Timeline view ───────────────────────────────────────────────
function TimelineView({ records }) {
  return (
    <div className={styles.timeline}>
      <div className={styles.timelineLine} />
      {records.map((rec, i) => {
        const isLeft = i % 2 === 0;
        const card = (
          <div className={styles.tlCard}>
            <Link
              to={`/schooldetail/${rec.schoolId}/11`}
              className={styles.tlName}
            >
              {rec.schoolName}
            </Link>
            <div className={styles.tlGrid}>
              <div className={styles.tlField}>
                <span className={styles.tlLabel}>UDISE Code: </span>{rec.udiseschCode}
              </div>
              <div className={styles.tlField}>
                <span className={styles.tlLabel}>Category: </span>{clean(rec.schcatDesc) || '—'}
              </div>
              <div className={styles.tlField}>
                <span className={styles.tlLabel}>State: </span>{rec.stateName || '—'}
              </div>
              <div className={styles.tlField}>
                <span className={styles.tlLabel}>District: </span>{rec.districtName || '—'}
              </div>
              <div className={styles.tlField}>
                <span className={styles.tlLabel}>Block: </span>{rec.blockName || '—'}
              </div>
              <div className={styles.tlField}>
                <span className={styles.tlLabel}>Type: </span>{clean(rec.schtypeDesc) || '—'}
              </div>
              <div className={styles.tlField}>
                <span className={styles.tlLabel}>Status: </span>{rec.schStatusName || '—'}
              </div>
            </div>
          </div>
        );
        const pill = <span className={styles.yearPill}>{rec.sessionYear}</span>;

        return (
          <div key={rec.yearId} className={styles.timelineRow}>
            {/* Left column */}
            <div className={styles.tlLeft}>
              {isLeft
                ? <div className={styles.tlCardInner}>{card}</div>
                : <div style={{ paddingTop: 8 }}>{pill}</div>
              }
            </div>

            {/* Center dot */}
            <div className={styles.timelineCenter}>
              <div className={styles.dot} />
            </div>

            {/* Right column */}
            <div className={styles.tlRight}>
              {isLeft
                ? <div style={{ paddingTop: 8 }}>{pill}</div>
                : <div className={styles.tlCardInner}>{card}</div>
              }
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── List view ───────────────────────────────────────────────────
function ListView({ records }) {
  return (
    <div className={styles.listContainer}>
      {records.map(rec => (
        <div key={rec.yearId} className={styles.listEntry}>
          {/* Year + icon */}
          <div className={styles.listLeft}>
            <CalIcon />
            <div className={styles.listYear}>{rec.sessionYear}</div>
          </div>

          <div className={styles.listDivider} />

          {/* Details */}
          <div className={styles.listRight}>
            <Link
              to={`/schooldetail/${rec.schoolId}/11`}
              className={styles.listName}
            >
              {rec.schoolName}
            </Link>
            <div className={styles.listGrid}>
              <Field label="UDISE Code"       value={rec.udiseschCode} />
              <Field label="School Category"  value={clean(rec.schcatDesc)} />
              <Field label="Academic Year"    value={rec.sessionYear} />
              <Field label="State"            value={rec.stateName} />
              <Field label="District"         value={rec.districtName} />
              <Field label="Block"            value={rec.blockName} />
              <Field label="School Type"      value={clean(rec.schtypeDesc)} />
              <div className={styles.listField}>
                <span className={styles.listLabel}>School Status: </span>
                <StatusTag name={rec.schStatusName} status={rec.schoolStatus} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main page ───────────────────────────────────────────────────
export default function TrackSchool() {
  const [searchParams] = useSearchParams();
  const schoolId   = searchParams.get('id');
  const schoolName = searchParams.get('name') || '';

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [view,    setView]    = useState('list');

  useEffect(() => {
    if (!schoolId) {
      setError('No school selected. Go back and click "Track School" on a school card.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    trackSchool(schoolId)
      .then(d => {
        if (d.status && d.data?.length) setRecords(d.data);
        else setError('No tracking data found for this school.');
      })
      .catch(() => setError('Failed to load tracking data. Please try again.'))
      .finally(() => setLoading(false));
  }, [schoolId]);

  const displayName = records[0]?.schoolName || schoolName;

  if (loading) return <div className={styles.centerMsg}>Loading school history…</div>;

  if (error) return <div className={styles.centerMsg}>{error}</div>;

  return (
    <div className={styles.page}>

      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Track School</h1>
        {displayName && <p className={styles.subtitle}>{displayName}</p>}
      </div>

      {/* View toggle */}
      <div className={styles.toggleGroup}>
        <button
          className={`${styles.btnTimeline} ${view === 'timeline' ? styles.btnActive : ''}`}
          onClick={() => setView('timeline')}
        >
          {/* clock icon */}
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          Time Line View
        </button>
        <button
          className={`${styles.btnList} ${view === 'list' ? styles.btnActive : ''}`}
          onClick={() => setView('list')}
        >
          {/* list icon */}
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <line x1="8"  y1="6"  x2="21" y2="6"  />
            <line x1="8"  y1="12" x2="21" y2="12" />
            <line x1="8"  y1="18" x2="21" y2="18" />
            <line x1="3"  y1="6"  x2="3.01" y2="6"  />
            <line x1="3"  y1="12" x2="3.01" y2="12" />
            <line x1="3"  y1="18" x2="3.01" y2="18" />
          </svg>
          List View
        </button>
      </div>

      {/* Content */}
      {view === 'timeline'
        ? <TimelineView records={records} />
        : <ListView     records={records} />
      }
    </div>
  );
}
