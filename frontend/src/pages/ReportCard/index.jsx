import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

import styles from './ReportCard.module.css';
import { SECTIONS, YEAR_OPTIONS } from './constants';
import ProfileTab  from './tabs/ProfileTab';
import InfraTab    from './tabs/InfraTab';
import TeachersTab from './tabs/TeachersTab';
import MinorityTab from './tabs/MinorityTab';
import EnrolTable  from './components/EnrolTable';
import useReportCard from '../../hooks/useReportCard';

export default function ReportCard() {
  const { id, yearId: paramYear } = useParams();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState('profile');
  const [selectedYear,  setSelectedYear]  = useState(paramYear || '11');

  const {
    school, profileData, facility,
    socialRows, socialTotal, minorityRows,
    gradeRows, gradeTotal, ewsRows, ewsTotal, rteRows, rteTotal,
    loading, error,
  } = useReportCard(id, selectedYear);

  const secRefs = useRef({});

  // Highlight active nav item based on scroll position
  useEffect(() => {
    if (!school) return;
    const observers = [];
    SECTIONS.forEach(({ key }) => {
      const el = secRefs.current[key];
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(key); },
        { rootMargin: '-15% 0px -70% 0px' }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, [school]);

  const scrollTo = (key) => {
    secRefs.current[key]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (loading) return (
    <div className={styles.centerMsg}>
      <div className={styles.spinner} />
      <p>Loading school report card…</p>
    </div>
  );

  if (error || !school) return (
    <div className={styles.centerMsg}>
      <p style={{ color: '#d32f2f' }}>{error || 'School not found.'}</p>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>← Back</button>
    </div>
  );

  const schoolName = (school.schoolName || 'Unknown School').trim().toUpperCase();
  const yearDesc   = YEAR_OPTIONS.find(y => String(y.yearId) === String(selectedYear))?.yearDesc ?? selectedYear;

  return (
    <div className={styles.page}>

      {/* Top bar */}
      <div className={styles.topBar}>
        <div className={styles.topBarInner}>
          <div className={styles.titleBlock}>
            <h1 className={styles.pageTitle}>School Report Card</h1>
            <p className={styles.schoolSubName}>{schoolName}</p>
          </div>
          <div className={styles.topControls}>
            <button className={styles.backBtn} onClick={() => navigate(-1)}>‹ BACK</button>
            <div className={styles.yearGroup}>
              <span className={styles.yearLabel}>Year</span>
              <select
                className={styles.yearSelect}
                value={selectedYear}
                onChange={e => { setSelectedYear(e.target.value); navigate(`/reportcard/${id}/${e.target.value}`, { replace: true }); }}
              >
                {YEAR_OPTIONS.map(y => (
                  <option key={y.yearId} value={y.yearId}>{y.yearDesc}</option>
                ))}
              </select>
            </div>
            <span className={styles.downloadBtn} title="Download PDF">↓</span>
          </div>
        </div>
        <div className={styles.academicYearLabel}>Academic Year ({yearDesc})</div>
      </div>

      {/* Sticky section nav */}
      <div className={styles.stickyNav}>
        <div className={styles.stickyNavInner}>
          {SECTIONS.map(s => (
            <button
              key={s.key}
              className={activeSection === s.key ? styles.navBtnActive : styles.navBtn}
              onClick={() => scrollTo(s.key)}
            >
              {s.label} ›
            </button>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div className={styles.content}>

        <div ref={el => { secRefs.current['profile'] = el; }}>
          <ProfileTab school={school} profile={profileData} facility={facility} />
        </div>

        <div className={styles.sectionDivider} />
        <div ref={el => { secRefs.current['infra'] = el; }}>
          <InfraTab facility={facility} school={school} profile={profileData} />
        </div>

        <div className={styles.sectionDivider} />
        <div ref={el => { secRefs.current['teachers'] = el; }}>
          <TeachersTab school={school} />
        </div>

        <div className={styles.sectionDivider} />
        <div ref={el => { secRefs.current['rte'] = el; }}>
          <div className={styles.tabContent}>
            <div className={styles.sectionTitle}>Enrolment (By RTE &amp; EWS)</div>
            <div className={styles.enrolNote}>
              Note -<span className={styles.enrolNoteRed}> Boys' Count is inclusive of Transgender Students.</span>
            </div>
            <EnrolTable rows={rteRows} total={rteTotal} />
            <div style={{ marginTop: 16 }} />
            <EnrolTable rows={ewsRows} total={ewsTotal} />
          </div>
        </div>

        <div className={styles.sectionDivider} />
        <div ref={el => { secRefs.current['social'] = el; }}>
          <div className={styles.tabContent}>
            <div className={styles.enrolHeaderRow}>
              <div className={styles.sectionTitle}>Enrolment (By Social Category)</div>
              <div className={styles.enrolNoteRight}>* Gen = General, G.Total = Grand Total</div>
            </div>
            <EnrolTable rows={socialRows} total={socialTotal} />
          </div>
        </div>

        <div className={styles.sectionDivider} />
        <div ref={el => { secRefs.current['minority'] = el; }}>
          <MinorityTab rows={minorityRows} />
        </div>

        <div className={styles.sectionDivider} />
        <div ref={el => { secRefs.current['grade'] = el; }}>
          <div className={styles.tabContent}>
            <div className={styles.sectionTitle}>
              Enrolment by grade in the current academic session
              <span className={styles.sectionSubtitle}> (by Age in completed years)</span>
            </div>
            <EnrolTable rows={gradeRows} total={gradeTotal} categoryLabel="Age" useItemId />
          </div>
        </div>

        <div className={styles.sectionDivider} />
        <div className={styles.sourceRow}>Source : UDISE+ {yearDesc}</div>

        <div className={styles.disclaimer}>
          <div className={styles.disclaimerTitle}>Disclaimer</div>
          <p className={styles.disclaimerText}>
            Though all the efforts have been made to ensure the accuracy and currency of the content
            on this website the same should not be construed as a statement of law or used for any
            legal purposes. This Report is based on voluntary uploading of data by the schools having
            active UDISE+ codes in a reference year, with 30th September as the reference date.
          </p>
        </div>

      </div>
    </div>
  );
}
