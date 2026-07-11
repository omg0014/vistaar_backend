import { useState, useEffect, useRef } from 'react';
import styles from './RegionProfile.module.css';
import { getStates, getDistricts, getBlocks } from '../services/mastersService';
import { getRegionFacilities, getRegionEnrolment, getRegionTeachers } from '../services/regionService';

const YEARS = [
  { yearId: 11, label: '2024-25' },
  { yearId: 10, label: '2023-24' },
  { yearId: 9,  label: '2022-23' },
  { yearId: 8,  label: '2021-22' },
  { yearId: 0,  label: 'Real Time' },
];

// SVG path data (24×24 viewBox)
const PATH = {
  school:  'M12 3 2 12h3v8h6v-5h2v5h6v-8h3L12 3z',
  pie:     'M11 2v20C5.93 21.5 2 17.21 2 12S5.93 2.5 11 2zm2 0c4.73.47 8.5 4.25 8.97 8.99H13V2zm.03 11.01H22C21.53 17.75 17.76 21.53 13 22v-8.99z',
  monitor: 'M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z',
  people:  'M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 15.17 10.33 14 8 14zm8 0c-.29 0-.62.02-.97.05A4.94 4.94 0 0 1 17 17.5V19h6v-2.5C23 15.17 18.33 14 16 14z',
  water:   'M12 2C6.67 6.55 4 10.48 4 13.8 4 18.78 7.8 22 12 22s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8z',
  bolt:    'M7 2v11h3v9l7-12h-4l4-8H7z',
  book:    'M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z',
  desktop: 'M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z',
  globe:   'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z',
  wheel:   'M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm8 7h-5l-1-4H8c-.55 0-1 .45-1 1v7h2v-3h3l1 4H7c-.55 0-1 .45-1 1v5h2v-4h9v4h2v-7c0-1.1-.9-2-2-2h-2z',
  teacher: 'M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3 1 9l11 6 9-4.91V17h2V9L12 3z',
  percent: 'M7.5 11C9.43 11 11 9.43 11 7.5S9.43 4 7.5 4 4 5.57 4 7.5 5.57 11 7.5 11zm0-5C8.33 6 9 6.67 9 7.5S8.33 9 7.5 9 6 8.33 6 7.5 6.67 6 7.5 6zM4.0 20l1.5-1.5 14-14L21 6l-1.5 1.5-14 14L4 20zm12.5 0c1.93 0 3.5-1.57 3.5-3.5S18.43 13 16.5 13 13 14.57 13 16.5s1.57 3.5 3.5 3.5zm0-5c.83 0 1.5.67 1.5 1.5S17.33 18 16.5 18 15 17.33 15 16.5s.67-1.5 1.5-1.5z',
  // enrolment tab
  enrol:    'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z',
  girl:     'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM7.07 18.28c.43-.9 3.05-1.78 4.93-1.78s4.51.88 4.93 1.78C15.57 19.36 13.86 20 12 20s-3.57-.64-4.93-1.72zm11.29-1.45c-1.43-1.74-4.9-2.33-6.36-2.33s-4.93.59-6.36 2.33C4.62 15.49 4 13.82 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8c0 1.82-.62 3.49-1.64 4.83zM12 6c-1.94 0-3.5 1.56-3.5 3.5S10.06 13 12 13s3.5-1.56 3.5-3.5S13.94 6 12 6z',
  // teacher tab
  tchMale:  'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
  tchFem:   'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z',
  tchDesk:  'M20 6h-2.18c.07-.44.18-.88.18-1.33C18 2.54 16.3 1 14.24 1c-1.18 0-2.12.66-2.98 1.56L10 4 8.74 2.56C7.88 1.66 6.94 1 5.76 1 3.7 1 2 2.54 2 4.67 2 5.12 2.13 5.56 2.18 6H0v2h1v12h22V8h1V6h-4zM14.24 3c.97 0 1.76.7 1.76 1.67 0 .86-.78 1.52-1.56 2.33H11.7C11.04 6.29 10 5.55 10 4.67 10 3.7 10.79 3 11.76 3h2.48zM5.76 3h2.48C9.21 3 10 3.7 10 4.67c0 .86-.78 1.52-1.56 2.33H6C5.22 6.19 4.44 5.53 4.44 4.67 4.44 3.7 5.23 3 5.76 3zM21 18H3V8h18v10z',
  tchPoint: 'M11 17H9V8l-3 3-1.42-1.42L9 5.17l4.59 4.41L12 11l-1-1v7zm4 3v-8h2v8h-2zm-8 0v-4h2v4H7zM5 20h14v2H5z',
  grad:     'M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3 1 9l11 6 9-4.91V17h2V9L12 3z',
  tchGrad:  'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 15.17 10.33 14 8 14zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
};

function Icon({ k }) {
  return (
    <svg viewBox="0 0 24 24" width="44" height="44" fill="currentColor">
      <path d={PATH[k] ?? PATH.pie} />
    </svg>
  );
}

const FACILITY_CARDS = [
  { key: 'totalSchool',             label: 'Number of Schools',                              icon: 'school',   fmt: 'num' },
  { key: 'totalGovtSchoolPer',      label: '% of Government Schools to Total Schools',       icon: 'pie',      fmt: 'pct' },
  { key: 'prySchoolPer',            label: '% of Primary Schools to Total Schools',          icon: 'pie',      fmt: 'pct' },
  { key: 'upperPrySchoolPer',       label: '% of Upper Primary Schools to Total Schools',    icon: 'percent',  fmt: 'pct' },
  { key: 'secSchoolPer',            label: '% of Secondary Schools to Total Schools',        icon: 'percent',  fmt: 'pct' },
  { key: 'higSecSchoolPer',         label: '% of Higher Secondary Schools to Total Schools', icon: 'percent',  fmt: 'pct' },
  { key: 'schHaveClassRoomPer',     label: '% of Schools Having Classrooms',                 icon: 'percent',  fmt: 'pct' },
  { key: 'schClassRoomRatio',       label: 'Number of students per classroom (Approx)',      icon: 'monitor',  fmt: 'dec' },
  { key: 'totSchFunToiletBoysPer',  label: '% of Schools Having Functional Boys Toilet',     icon: 'people',   fmt: 'pct' },
  { key: 'totSchFunToiletGirlsPer', label: '% of Schools Having Functional Girls Toilet',    icon: 'people',   fmt: 'pct' },
  { key: 'totSchFunDrnkWaterPer',   label: '% of Schools with Functional Drinking Water',    icon: 'water',    fmt: 'pct' },
  { key: 'totSchFunElectricityPer', label: '% of Schools with Functional Electricity',       icon: 'bolt',     fmt: 'pct' },
  { key: 'totSchLibraryPer',        label: '% of Schools with Library',                      icon: 'book',     fmt: 'pct' },
  { key: 'totSchFunDesktopPer',     label: '% of Schools with Functional Desktop',           icon: 'pie',      fmt: 'pct' },
  { key: 'schHaveInternetPer',      label: '% of Schools with Internet',                     icon: 'globe',    fmt: 'pct' },
  { key: 'schHaveRampPer',          label: '% of Schools with Ramp',                         icon: 'wheel',    fmt: 'pct' },
];

const ENROLMENT_CARDS = [
  { key: 'totEnrollment',      label: 'Total Enrolment (Pre Primary - Class 12)', icon: 'enrol',   fmt: 'num' },
  { key: 'totGovEnrolPer',     label: '% of Enrolment in Government school',      icon: 'school',  fmt: 'pct' },
  { key: 'totBoysEnrolPer',    label: '% of Boys Enrolment',                      icon: 'percent', fmt: 'pct' },
  { key: 'totGirlsEnrolPer',   label: '% of Girls Enrolment',                     icon: 'girl',    fmt: 'pct' },
  { key: 'totPryEnrolPer',     label: '% of Primary Enrolment',                   icon: 'percent', fmt: 'pct' },
  { key: 'totUppPryEnrolPer',  label: '% of Upper Primary Enrolment',             icon: 'percent', fmt: 'pct' },
  { key: 'totSecEnrolPer',     label: '% of Secondary Enrolment',                 icon: 'percent', fmt: 'pct' },
  { key: 'totHighSecEnrolPer', label: '% of Higher Secondary Enrolment',          icon: 'percent', fmt: 'pct' },
  { key: 'totSCEnrolPer',      label: '% of SC Enrolment',                        icon: 'percent', fmt: 'pct' },
  { key: 'totSTEnrolPer',      label: '% of ST Enrolment',                        icon: 'percent', fmt: 'pct' },
  { key: 'totOBCEnrolPer',     label: '% of OBC Enrolment',                       icon: 'percent', fmt: 'pct' },
  { key: 'totMuslimEnrolPer',  label: '% of Muslim Enrolment',                    icon: 'percent', fmt: 'pct' },
];

const TEACHER_CARDS = [
  { key: 'totTch',                 label: 'Total Teachers',                                   icon: 'people',   fmt: 'num' },
  { key: 'totTchMalePer',          label: '% of Total Teachers Male',                         icon: 'tchMale',  fmt: 'pct' },
  { key: 'totTchFemalePer',        label: '% of Total Teachers Female',                       icon: 'tchFem',   fmt: 'pct' },
  { key: 'totSchWoutFemTchPer',    label: '% Total Schools Without Female Teacher',           icon: 'tchDesk',  fmt: 'pct' },
  { key: 'totTchRegPer',           label: '% Total Regular Teachers',                         icon: 'tchPoint', fmt: 'pct' },
  { key: 'totTchNonRegPer',        label: '% Total Non Regular Teachers',                     icon: 'tchPoint', fmt: 'pct' },
  { key: 'totSchWithSingleTchPer', label: '% Total Schools with Single Teacher',              icon: 'percent',  fmt: 'pct' },
  { key: 'totTchAbove55Per',       label: '% Total Teachers Above 55',                        icon: 'tchPoint', fmt: 'pct' },
  { key: 'totTchGraduatePer',      label: '% Total Teachers Graduate',                        icon: 'grad',     fmt: 'pct' },
  { key: 'totTchAboveGraduatePer', label: '% Total Teachers Post Graduate and Above',         icon: 'tchGrad',  fmt: 'pct' },
  { key: 'totTchNoProfPer',        label: '% Total Teachers Without Professional Qualification', icon: 'tchPoint', fmt: 'pct' },
  { key: 'totTchCompTrainedPer',   label: '% Total Teachers Trained in Computer',             icon: 'desktop',  fmt: 'pct' },
];

function fmtVal(val, fmt) {
  if (val == null) return '—';
  const n = Number(val);
  if (fmt === 'num') return n.toLocaleString('en-IN');
  if (fmt === 'pct') return `${n.toFixed(2)}%`;
  return n.toFixed(2);
}

export default function RegionProfile() {
  const [tab, setTab] = useState('facilities');
  const [yearId, setYearId] = useState(11);

  // region selection
  const [selectedStateId, setSelectedStateId]     = useState(0);
  const [selectedDistrictId, setSelectedDistrictId] = useState(0);
  const [selectedBlockId, setSelectedBlockId]     = useState(0);
  const [regionCd, setRegionCd] = useState('50');

  // dropdowns
  const [states, setStates]       = useState([]);
  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks]       = useState([]);

  // stats
  const [facilityData, setFacilityData] = useState(null);
  const [enrolData, setEnrolData]       = useState(null);
  const [teacherData, setTeacherData]   = useState(null);
  const [loading, setLoading] = useState(false);

  // Load states on mount (and on year change)
  useEffect(() => {
    getStates(yearId)
      .then(d => { if (d.status && d.data) setStates(d.data); })
      .catch(() => {});
  }, [yearId]);

  // Load districts when state is picked
  useEffect(() => {
    if (!selectedStateId) { setDistricts([]); return; }
    getDistricts(selectedStateId, yearId)
      .then(d => { if (d.status && d.data) setDistricts(d.data); })
      .catch(() => {});
  }, [selectedStateId, yearId]);

  // Load blocks when district is picked
  useEffect(() => {
    if (!selectedDistrictId) { setBlocks([]); return; }
    getBlocks(selectedDistrictId, yearId)
      .then(d => { if (d.status && d.data) setBlocks(d.data); })
      .catch(() => {});
  }, [selectedDistrictId, yearId]);

  // Fetch all 3 stats whenever region or year changes
  const statsKey = `${regionCd}:${yearId}`;
  const prevKey  = useRef('');
  useEffect(() => {
    if (prevKey.current === statsKey) return;
    prevKey.current = statsKey;
    setLoading(true);
    Promise.all([
      getRegionFacilities(regionCd, yearId),
      getRegionEnrolment(regionCd, yearId),
      getRegionTeachers(regionCd, yearId),
    ])
      .then(([f, e, t]) => {
        if (f.status) setFacilityData(f.data);
        if (e.status) setEnrolData(e.data);
        if (t.status) setTeacherData(t.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [statsKey, regionCd, yearId]);

  const handleStateChange = (id) => {
    setSelectedStateId(id);
    setSelectedDistrictId(0);
    setSelectedBlockId(0);
    if (id === 0) {
      setRegionCd('50');
    } else {
      const s = states.find((x) => x.stateId === id);
      setRegionCd(s?.udiseStateCode ?? '50');
    }
  };

  const handleDistrictChange = (id) => {
    setSelectedDistrictId(id);
    setSelectedBlockId(0);
    if (id === 0) {
      const s = states.find((x) => x.stateId === selectedStateId);
      setRegionCd(s?.udiseStateCode ?? '50');
    } else {
      const d = districts.find((x) => x.districtId === id);
      setRegionCd(d?.udiseDistrictCode ?? regionCd);
    }
  };

  const handleBlockChange = (id) => {
    setSelectedBlockId(id);
    if (id === 0) {
      const d = districts.find((x) => x.districtId === selectedDistrictId);
      setRegionCd(d?.udiseDistrictCode ?? regionCd);
    } else {
      const b = blocks.find((x) => x.blockId === id);
      setRegionCd(b?.udiseBlockCode ?? regionCd);
    }
  };

  const regionLabel = (() => {
    if (selectedBlockId) {
      const b = blocks.find((x) => x.blockId === selectedBlockId);
      return `Block: ${b?.blockName ?? ''}`;
    }
    if (selectedDistrictId) {
      const d = districts.find((x) => x.districtId === selectedDistrictId);
      return `District: ${d?.districtName ?? ''}`;
    }
    if (selectedStateId) {
      const s = states.find((x) => x.stateId === selectedStateId);
      return `State: ${s?.stateName ?? ''}`;
    }
    return 'Country: India';
  })();

  const yearLabel = YEARS.find(y => y.yearId === yearId)?.label ?? '';

  const data  = tab === 'facilities' ? facilityData : tab === 'enrolment' ? enrolData : teacherData;
  const cards = tab === 'facilities' ? FACILITY_CARDS : tab === 'enrolment' ? ENROLMENT_CARDS : TEACHER_CARDS;

  const TABS = [
    { key: 'facilities', label: 'SCHOOL AND FACILITIES' },
    { key: 'enrolment',  label: 'ENROLMENT' },
    { key: 'teachers',   label: 'TEACHERS' },
  ];

  return (
    <div className={styles.page}>

      {/* ── Tab bar ─────────────────────────────────────────────────── */}
      <div className={styles.tabBar}>
        <div className={styles.tabBarInner}>
          {TABS.map(t => (
            <button
              key={t.key}
              className={tab === t.key ? styles.tabActive : styles.tab}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────────────────── */}
      <div className={styles.content}>
        <p className={styles.hint}>Select Area (You can select any State/UT, District or Block from here)</p>

        {/* Filters */}
        <div className={styles.filtersRow}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Academic Year</label>
            <select className={styles.filterSelect} value={yearId}
              onChange={e => setYearId(Number(e.target.value))}>
              {YEARS.map(y => <option key={y.yearId} value={y.yearId}>{y.label}</option>)}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>State</label>
            <select className={styles.filterSelect} value={selectedStateId}
              onChange={e => handleStateChange(Number(e.target.value))}>
              <option value={0}>NATIONAL</option>
              {states.map((s) => (
                <option key={s.stateId} value={s.stateId}>{s.stateName}</option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>District</label>
            <select className={styles.filterSelect} value={selectedDistrictId}
              disabled={!selectedStateId}
              onChange={e => handleDistrictChange(Number(e.target.value))}>
              <option value={0}>Select District</option>
              {districts.map((d) => (
                <option key={d.districtId} value={d.districtId}>{d.districtName}</option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Block</label>
            <select className={styles.filterSelect} value={selectedBlockId}
              disabled={!selectedDistrictId}
              onChange={e => handleBlockChange(Number(e.target.value))}>
              <option value={0}>Select Block</option>
              {blocks.map((b) => (
                <option key={b.blockId} value={b.blockId}>{b.blockName}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Region + year info row */}
        <div className={styles.infoRow}>
          <span className={styles.regionLabel}>{regionLabel}</span>
          <span className={styles.yearBadge}>
            Academic Year: <strong>{yearLabel}</strong>
            <span className={styles.downloadCircle}>↓</span>
          </span>
        </div>

        {/* Cards */}
        {loading ? (
          <div className={styles.loadingRow}>
            <div className={styles.spinner} />
          </div>
        ) : (
          <div className={styles.cardsGrid}>
            {cards.map((card, i) => (
              <div
                key={card.key}
                className={styles.card}
                style={{ background: i % 2 === 0 ? '#BE3A5B' : '#3B2778' }}
              >
                <div className={styles.cardIconArea}>
                  <Icon k={card.icon} />
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.cardValue}>{fmtVal(data?.[card.key], card.fmt)}</div>
                  <div className={styles.cardLabel}>{card.label}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
