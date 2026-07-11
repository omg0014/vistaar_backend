import styles from './Home.module.css';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyCaptcha } from '../services/searchService';
import { getRegionStats } from '../services/regionService';
import { useCaptcha } from '../hooks/useCaptcha';
import { useKeywordSuggestions } from '../hooks/useKeywordSuggestions';
import { useStates } from '../hooks/useStates';
import { STATS_YEAR_OPTIONS } from '../utils/constants';

const DEFAULT_STATS = {
  government: 0,
  governmentAided: 0,
  privateSch: 0,
  others: 0,
  primary: 0,
  upperPrimary: 0,
  secondary: 0,
  higherSecondary: 0,
  totalSch: 0,
};

const STAT_CARDS = [
  { key: 'government',      label: 'Government',       img: 'government.png' },
  { key: 'governmentAided', label: 'Government Aided', img: 'government-aided.png' },
  { key: 'privateSch',      label: 'Private',          img: 'private.png' },
  { key: 'others',          label: 'Others',           img: 'others.png' },
  { key: 'primary',         label: 'Primary',          img: 'primary.png' },
  { key: 'upperPrimary',    label: 'Upper Primary',    img: 'upper-primary.png' },
  { key: 'secondary',       label: 'Secondary',        img: 'secondary.png' },
  { key: 'higherSecondary', label: 'Higher Secondary', img: 'higher-secondary.png' },
];

export default function Home() {
  const navigate = useNavigate();

  // ── Search state ────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('keyword');
  const [keyword, setKeyword] = useState('');
  const [udiseInput, setUdiseInput] = useState('');
  const [pincodeInput, setPincodeInput] = useState('');
  const [schNameStateId, setSchNameStateId] = useState('');
  const [searchError, setSearchError] = useState('');
  const inputRef = useRef(null);

  const { captchaImg, captchaInput, setCaptchaInput, refreshCaptcha } = useCaptcha();
  const { suggestions, showSuggestions, setShowSuggestions } = useKeywordSuggestions(keyword, activeTab);

  // ── Statistics state ────────────────────────────────────────────────────────
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [selectedYear, setSelectedYear] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState('50');

  const states = useStates();

  // Fetch captcha once on mount
  useEffect(() => { refreshCaptcha(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Reload stats whenever year or region changes
  useEffect(() => {
    getRegionStats(selectedRegion, selectedYear)
      .then(d => {
        if (d.status && d.data) {
          setStats({
            government:      d.data.government      ?? 0,
            governmentAided: d.data.governmentAided ?? 0,
            privateSch:      d.data.privateSch      ?? 0,
            others:          d.data.others          ?? 0,
            primary:         d.data.primary         ?? 0,
            upperPrimary:    d.data.upperPrimary     ?? 0,
            secondary:       d.data.secondary       ?? 0,
            higherSecondary: d.data.higherSecondary  ?? 0,
            totalSch:        d.data.totalSch         ?? 0,
          });
        }
      })
      .catch(() => {});
  }, [selectedYear, selectedRegion]);

  const handleSimpleSearch = async () => {
    setSearchError('');
    const captchaVal = captchaInput.trim();
    if (!captchaVal) { setSearchError('Please enter the captcha.'); return; }

    // Verify captcha before navigating — wrong captcha stays on Home, user retypes
    try {
      const vResult = await verifyCaptcha(captchaVal);
      if (!vResult?.data) {
        setSearchError('Incorrect captcha. Please retype.');
        return;
      }
    } catch {
      // Network error on verify — proceed anyway
    }

    if (activeTab === 'keyword') {
      const q = keyword.trim();
      if (q.length < 3) { setSearchError('At least 3 characters required for search.'); return; }
      navigate(`/advancesearch?type=1&param=${encodeURIComponent(q)}&captcha=${encodeURIComponent(captchaVal)}`);
    } else if (activeTab === 'schoolName') {
      if (!schNameStateId) { setSearchError('Please select a state.'); return; }
      navigate(`/advancesearch?type=2&param=${encodeURIComponent(keyword.trim())}&captcha=${encodeURIComponent(captchaVal)}&stateId=${schNameStateId}`);
    } else if (activeTab === 'udise') {
      const q = udiseInput.trim();
      if (q.length < 11) { setSearchError('Please enter a valid 11-digit UDISE code.'); return; }
      navigate(`/advancesearch?type=3&param=${encodeURIComponent(q)}&captcha=${encodeURIComponent(captchaVal)}`);
    } else if (activeTab === 'pincode') {
      const q = pincodeInput.trim();
      if (q.length < 6) { setSearchError('Please enter a valid 6-digit PIN code.'); return; }
      navigate(`/advancesearch?type=4&param=${encodeURIComponent(q)}&captcha=${encodeURIComponent(captchaVal)}`);
    }
  };

  return (
    <div className={styles.container}>

      {/* ── Hero / Search ─────────────────────────────────────────── */}
      <section
        className={styles.hero}
        style={{ backgroundImage: 'url(/media/search-school-bg-GDH6VBBP.jpg)' }}
      >
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Know Your School</h1>

          {/* Tabs */}
          <div className={styles.searchTabs}>
            {(['keyword', 'schoolName', 'udise', 'pincode']).map((tab) => {
              const labels = {
                keyword: 'Search', schoolName: 'School Name', udise: 'UDISE Code', pincode: 'PIN Code',
              };
              return (
                <button
                  key={tab}
                  className={activeTab === tab ? styles.tabActive : styles.tab}
                  onClick={() => { setActiveTab(tab); setSearchError(''); }}
                >
                  {labels[tab]}
                </button>
              );
            })}
          </div>

          {/* Search box */}
          <div className={styles.searchBox}>
            <div className={styles.searchRow}>

              {activeTab === 'keyword' || activeTab === 'schoolName' ? (
                <div className={styles.inputGroup} style={{ position: 'relative' }}>
                  <label className={styles.inputLabel}>
                    {activeTab === 'keyword' ? 'Enter Keyword' : 'School Name'}
                  </label>
                  <input
                    ref={inputRef}
                    type="text"
                    className={styles.inputField}
                    value={keyword}
                    onChange={e => { setKeyword(e.target.value); setSearchError(''); setShowSuggestions(true); }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                    onKeyDown={e => e.key === 'Enter' && handleSimpleSearch()}
                  />
                  <span className={styles.micIcon}>
                    <img src="/assets/images/help/mic.svg" alt="mic" width={18} height={18} />
                  </span>
                  {showSuggestions && suggestions.length > 0 && (
                    <div className={styles.suggestionsDropdown}>
                      {suggestions.map((s, i) => (
                        <div key={i} className={styles.suggestionItem}
                          onMouseDown={() => { setKeyword(s.schoolName?.trim() || ''); setShowSuggestions(false); }}>
                          <span className={styles.suggestionText}>
                            {(s.keyword || '').trim().toUpperCase()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : activeTab === 'udise' ? (
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>UDISE Code</label>
                  <input type="text" className={styles.inputField} value={udiseInput}
                    onChange={e => { setUdiseInput(e.target.value); setSearchError(''); }}
                    onKeyDown={e => e.key === 'Enter' && handleSimpleSearch()} maxLength={11} />
                </div>
              ) : (
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>PIN Code</label>
                  <input type="text" className={styles.inputField} value={pincodeInput}
                    onChange={e => { setPincodeInput(e.target.value); setSearchError(''); }}
                    onKeyDown={e => e.key === 'Enter' && handleSimpleSearch()} maxLength={6} />
                </div>
              )}

              {/* State dropdown — only for School Name tab (searchType=2 requires stateId) */}
              {activeTab === 'schoolName' && (
                <div className={styles.inputGroup} style={{ flex: '0 0 160px' }}>
                  <label className={styles.inputLabel}>State</label>
                  <select className={styles.inputField} value={schNameStateId}
                    onChange={e => { setSchNameStateId(e.target.value); setSearchError(''); }}>
                    <option value="">Select State</option>
                    {states.map(s => (
                      <option key={s.stateId} value={s.stateId}>{s.stateName}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Real UDISE captcha — image fetched from backend, IP-based */}
              <div className={styles.captchaGroup}>
                <label className={styles.inputLabel}>Captcha</label>
                <input type="text" className={styles.inputField} value={captchaInput}
                  onChange={e => { setCaptchaInput(e.target.value); setSearchError(''); }}
                  onKeyDown={e => e.key === 'Enter' && handleSimpleSearch()}
                  placeholder="Enter Captcha" />
              </div>
              <div className={styles.captchaBox}>
                {captchaImg
                  ? <img src={`data:image/png;base64,${captchaImg}`} alt="captcha" style={{ height: 32, borderRadius: 2 }} />
                  : <span style={{ fontSize: '0.7rem', color: '#888' }}>Loading…</span>
                }
                <button className={styles.refreshBtn}
                  onClick={() => { refreshCaptcha(); setCaptchaInput(''); }}
                  title="Refresh captcha">
                  <img src="/assets/images/refresh.png" alt="refresh" width={20} height={20} />
                </button>
              </div>

              <button className={styles.searchBtn} onClick={handleSimpleSearch}>Search</button>
            </div>

            {searchError && <p className={styles.searchError}>{searchError}</p>}
          </div>
        </div>
      </section>

      {/* ── Explore State ─────────────────────────────────────────── */}
      <section className={styles.exploreWrapper}>
        <div className={styles.exploreSection}>
          <div className={styles.exploreHeader}>
            <div>
              <h2 className={styles.exploreTitle}>Explore State</h2>
              <p className={styles.exploreSubtitle}>Explore our school guide to find schools near you.</p>
            </div>
            <div className={styles.exploreControls}>
              <div className={styles.selectGroup}>
                <label className={styles.selectLabel}>Academic Year</label>
                <select className={styles.selectField} value={selectedYear}
                  onChange={e => setSelectedYear(Number(e.target.value))}>
                  {STATS_YEAR_OPTIONS.map(y => (
                    <option key={y.yearId} value={y.yearId}>{y.yearDesc}</option>
                  ))}
                </select>
              </div>
              <div className={styles.selectGroup}>
                <label className={styles.selectLabel}>State</label>
                <select className={styles.selectField} value={selectedRegion}
                  onChange={e => setSelectedRegion(e.target.value)}>
                  <option value="50">NATIONAL</option>
                  {states.map(s => (
                    <option key={s.stateId} value={s.udiseStateCode}>{s.stateName}</option>
                  ))}
                </select>
              </div>
              <div className={styles.totalSchool}>
                <p className={styles.totalSchoolNum}>{stats.totalSch.toLocaleString()}</p>
                <p className={styles.totalSchoolLabel}>Total School</p>
              </div>
            </div>
          </div>

          <div className={styles.cardsGrid}>
            {STAT_CARDS.map(({ key, label, img }) => (
              <div key={key} className={styles.card}>
                <img src={`/assets/images/kys-icon/${img}`} alt={label} className={styles.cardIcon} />
                <div className={styles.cardData}>
                  <p className={styles.cardNum}>{(stats[key] ?? 0).toLocaleString()}</p>
                  <p className={styles.cardLabel}>{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Partners / Schemes ────────────────────────────────────── */}
      <section className={styles.partnersSection}>
        {[
          { label: 'KVS',                     img: 'kvs-logo.png',  searchType: 5, searchParam: '92' },
          { label: 'NVS',                     img: 'nvs-logo.png',  searchType: 5, searchParam: '93' },
          { label: 'PM SHRI',                 img: 'pmShri.png',    searchType: 6, searchParam: '1'  },
          { label: 'Special School for CWSN', img: 'cwsn.png',      searchType: 6, searchParam: '2'  },
          { label: 'EMRS',                    img: 'emrs.png',      searchType: 6, searchParam: '3'  },
        ].map(p => (
          <div key={p.label} className={styles.partnerItem}
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(`/advancesearch?searchType=${p.searchType}&searchParam=${p.searchParam}&label=${encodeURIComponent(p.label)}`)}>
            <div className={styles.partnerCircle}>
              <img src={`/assets/images/${p.img}`} alt={p.label} />
            </div>
            <span className={styles.partnerLabel}>{p.label}</span>
          </div>
        ))}
      </section>

      {/* ── App Download ──────────────────────────────────────────── */}
      <section className={styles.appSection}>
        <div className={styles.appContainer}>
          <div className={styles.appText}>
            <h2 className={styles.appTitle}>Scan QR Code to Download APP</h2>
            <p className={styles.appDesc}>
              Scan the given QR Code to download KYS App on your device. The app can be used
              to directly search for a school and get details.
            </p>
            <div className={styles.storeButtons}>
              <a href="https://play.google.com/store/apps/details?id=in.gov.udiseplus.kys" target="_blank" rel="noopener noreferrer" aria-label="Google Play">
                <img src="/assets/images/play.svg" alt="Google Play" className={styles.storeBadge} />
              </a>
              <a href="https://apps.apple.com/in/app/udise-plus-know-your-school/id6754629476" target="_blank" rel="noopener noreferrer" aria-label="App Store">
                <img src="/assets/images/appStore.svg" alt="App Store" className={styles.storeBadge} />
              </a>
            </div>
          </div>
          <div className={styles.qrContainer}>
            <div className={styles.qrItem}>
              <div className={styles.qrBox}>
                <img src="/assets/images/qrcodeGooglePlay.svg" alt="Android QR" width={120} height={120} />
              </div>
              <span className={styles.qrLabel}>
                Scan QR Code to Download <span className={styles.qrHighlight}>Android App</span>
              </span>
            </div>
            <div className={styles.qrItem}>
              <div className={styles.qrBox}>
                <img src="/assets/images/qrcodeiOSApp.svg" alt="iOS QR" width={120} height={120} />
              </div>
              <span className={styles.qrLabel}>
                Scan QR Code to Download <span className={styles.qrHighlight}>iOS App</span>
              </span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
