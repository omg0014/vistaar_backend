import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import styles from './AdvanceSearch.module.css';
import SchoolCard from '../components/SchoolCard';
import Accordion from '../components/Accordion';
import { getCategories, searchSchools } from '../services/searchService';
import { useCaptcha } from '../hooks/useCaptcha';
import { useKeywordSuggestions } from '../hooks/useKeywordSuggestions';
import { useStates } from '../hooks/useStates';

export default function AdvanceSearch() {
  const [searchParams] = useSearchParams();

  // Org search params (from KVS/NVS/PM SHRI clicks on home page)
  const orgSearchType  = searchParams.get('searchType');
  const orgSearchParam = searchParams.get('searchParam');
  const orgLabel       = searchParams.get('label') || '';

  // Direct search params (from Home page keyword/school/UDISE/PIN search)
  const urlType     = searchParams.get('type');
  const urlParam    = searchParams.get('param') || '';
  const urlCaptcha  = searchParams.get('captcha') || '';
  const urlStateId  = searchParams.get('stateId') || '';

  const urlTypeToTab = { '1': 'keyword', '2': 'schoolName', '3': 'udise', '4': 'pincode' };
  const [activeTab, setActiveTab] = useState(() => urlTypeToTab[urlType] || 'keyword');
  const [keyword, setKeyword]         = useState(() => (urlType === '1' || urlType === '2') ? urlParam : '');
  const [udiseInput, setUdiseInput]   = useState(() => urlType === '3' ? urlParam : '');
  const [pincodeInput, setPincodeInput] = useState(() => urlType === '4' ? urlParam : '');
  const { captchaImg, captchaInput, setCaptchaInput, refreshCaptcha } = useCaptcha();
  // Autocomplete only for keyword/Search tab — schoolName uses direct searchType=2
  const { suggestions, showSuggestions, setShowSuggestions } = useKeywordSuggestions(keyword, activeTab);
  const [schNameStateId, setSchNameStateId] = useState(() => urlType === '2' ? urlStateId : '');
  const statesList = useStates();

  const [urlSearchMsg, setUrlSearchMsg] = useState('');
  const [schools, setSchools]           = useState([]);
  const [loading, setLoading]           = useState(false);
  const [aggregateStats, setAggregateStats] = useState(null);

  // On mount: load states, then either auto-search (URL params) or fetch captcha
  const initDone = useRef(false);
  useEffect(() => {
    if (initDone.current) return;
    initDone.current = true;

    getCategories()
      .then(d => { if (d.status && d.data) setCategories(d.data); })
      .catch(() => {});

    const hasUrlSearch = urlType && urlCaptcha && ['1','2','3','4'].includes(urlType);
    if (hasUrlSearch) {
      setLoading(true);
      setUrlSearchMsg('');
      searchSchools(urlType, urlParam, 0, urlCaptcha, urlStateId || undefined)
        .then(d => {
          if (d.status && d.data?.content) {
            setSchools(d.data.content);
            setAggregateStats(d.data.allSchools || null);
          } else {
            const raw = d.error?.errorDetails?.details || '';
            const msg = raw.toLowerCase().includes('three')
              ? 'Please type a school name to search by School Name tab.'
              : raw || 'No results found. The captcha may have expired — try again.';
            setUrlSearchMsg(msg);
          }
        })
        .catch(() => setUrlSearchMsg('Network error. Please try again.'))
        .finally(() => { setLoading(false); refreshCaptcha(); });
    } else {
      refreshCaptcha();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-search for org types (KVS / NVS / PM SHRI / CWSN / EMRS) — uses fixed ewDVKv captcha
  const orgSearchDone = useRef(false);
  useEffect(() => {
    if (!orgSearchType || orgSearchDone.current) return;
    orgSearchDone.current = true;
    setLoading(true);
    searchSchools(orgSearchType, orgSearchParam, 0)
      .then(d => {
        if (d.status && d.data?.content) {
          setSchools(d.data.content);
          setAggregateStats(d.data.allSchools || null);
        } else {
          setUrlSearchMsg(d.error?.errorDetails?.details || 'Failed to load schools. Please try again.');
        }
      })
      .catch(() => setUrlSearchMsg('Network error. Please try again.'))
      .finally(() => setLoading(false));
  }, [orgSearchType, orgSearchParam]);

  const [statusFilter, setStatusFilter] = useState('all');
  const [categories, setCategories]     = useState([]);
  const [selCategories, setSelCategories]   = useState(new Set());
  const [selManagements, setSelManagements] = useState(new Set());
  const [selSchoolTypes, setSelSchoolTypes] = useState(new Set());
  const [openAccordions, setOpenAccordions] = useState({
    status: true, category: true, management: true, schoolType: true,
  });

  const toggleSet = (setter, val) =>
    setter(prev => { const s = new Set(prev); s.has(val) ? s.delete(val) : s.add(val); return s; });

  const sortedCategories = [...categories].sort((a, b) => {
    if (a.catId === '3') return 1;
    if (b.catId === '3') return -1;
    return Number(a.catId) - Number(b.catId);
  });

  const MGMT_BROAD = [
    { key: 'govMgmt',      label: 'Government' },
    { key: 'govAidedMgmt', label: 'Government Aided' },
    { key: 'pvtMgmt',      label: 'Private' },
    { key: 'othersMgmt',   label: 'Others' },
  ];

  const SCHOOL_TYPES = [
    { key: 'boysType',  label: 'Boys',          schType: '1' },
    { key: 'girlsType', label: 'Girls',          schType: '2' },
    { key: 'coEduType', label: 'Co-educational', schType: '3' },
  ];

  const [searchError, setSearchError] = useState('');

  const handleSearch = () => {
    const q = activeTab === 'udise' ? udiseInput : activeTab === 'pincode' ? pincodeInput : keyword;
    if (activeTab !== 'schoolName' && !q.trim()) { setSearchError('Please enter a search term.'); return; }
    if (!captchaInput.trim()) { setSearchError('Please enter the captcha.'); return; }
    if (activeTab === 'schoolName' && !schNameStateId) { setSearchError('Please select a state.'); return; }

    const typeMap = { keyword: '1', schoolName: '2', udise: '3', pincode: '4' };
    const searchType = typeMap[activeTab] || '1';

    setLoading(true);
    setSchools([]);
    setUrlSearchMsg('');
    setSearchError('');

    searchSchools(searchType, q, 0, captchaInput.trim(), activeTab === 'schoolName' ? schNameStateId : undefined)
      .then(d => {
        if (d.status && d.data?.content) {
          setSchools(d.data.content);
          setAggregateStats(d.data.allSchools || null);
          refreshCaptcha();
          setCaptchaInput('');
        } else {
          const raw = d.error?.errorDetails?.details || '';
          const msg = raw.toLowerCase().includes('three')
            ? 'Please type a school name (required by UDISE for School Name search).'
            : raw || 'No results found. Try again.';
          setSearchError(msg);
          if (!raw.toLowerCase().includes('captcha')) refreshCaptcha();
        }
      })
      .catch(() => { setSearchError('Network error. Please try again.'); refreshCaptcha(); })
      .finally(() => setLoading(false));
  };

  const clearFilters = () => {
    setStatusFilter('all');
    setSelCategories(new Set());
    setSelManagements(new Set());
    setSelSchoolTypes(new Set());
  };

  const toggleAccordion = (key) =>
    setOpenAccordions(prev => ({ ...prev, [key]: !prev[key] }));

  const filteredSchools = schools.filter(s => {
    if (statusFilter === 'operational' && s.schoolStatus !== 0) return false;
    if (statusFilter === 'closed' && s.schoolStatus === 0) return false;
    if (selCategories.size > 0 && !selCategories.has(String(s.schCategoryId))) return false;
    if (selManagements.size > 0 && !selManagements.has(String(s.schBroadMgmtId))) return false;
    if (selSchoolTypes.size > 0 && !selSchoolTypes.has(String(s.schType))) return false;
    return true;
  });

  const TAB_LABELS = {
    keyword: 'Search', schoolName: 'School Name', udise: 'UDISE Code', pincode: 'PIN Code',
  };

  return (
    <div className={styles.container}>
      {/* Banner */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroImage}>👩‍🎓</div>
          <div>
            <h1 className={styles.heroTitle}>Locate School</h1>
            <div className={styles.breadcrumb}>Home / Locate School</div>
          </div>
        </div>
      </section>

      {/* Search bar */}
      <section className={styles.searchSection}>
        <div className={styles.searchWrapper}>
          <div className={styles.searchTabs}>
            {(['keyword', 'schoolName', 'udise', 'pincode']).map(tab => (
              <label key={tab} className={styles.tabLabel}>
                <input type="radio" name="searchType" checked={activeTab === tab}
                  onChange={() => { setActiveTab(tab); setCaptchaInput(''); }} />
                {TAB_LABELS[tab]}
              </label>
            ))}
          </div>

          <div className={styles.searchControls}>
            {/* Main text input */}
            <div className={styles.inputGroup} style={{ flex: 1, position: 'relative' }}>
              <label className={styles.inputLabel}>
                {activeTab === 'udise' ? 'UDISE Code' : activeTab === 'pincode' ? 'PIN Code' : activeTab === 'schoolName' ? 'School Name' : 'Enter Keyword'}
              </label>
              <input type="text" className={styles.inputField}
                value={activeTab === 'udise' ? udiseInput : activeTab === 'pincode' ? pincodeInput : keyword}
                onChange={e => {
                  if (activeTab === 'udise') setUdiseInput(e.target.value);
                  else if (activeTab === 'pincode') setPincodeInput(e.target.value);
                  else { setKeyword(e.target.value); setShowSuggestions(true); }
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder={activeTab === 'udise' ? '11-digit UDISE code' : activeTab === 'pincode' ? '6-digit PIN code' : activeTab === 'schoolName' ? 'Enter school name' : 'School name or keyword'}
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className={styles.suggestionsDropdown}>
                  {suggestions.map((s, i) => (
                    <div key={i} className={styles.suggestionItem}
                      onMouseDown={() => { setKeyword(s.schoolName?.trim() || ''); setShowSuggestions(false); }}>
                      <span className={styles.suggestionText}>
                        {(s.keyword || s.schoolName || '').trim().toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* State dropdown — only for School Name tab */}
            {activeTab === 'schoolName' && (
              <div className={styles.inputGroup} style={{ flex: '0 0 160px' }}>
                <label className={styles.inputLabel}>State</label>
                <select className={styles.inputField} value={schNameStateId}
                  onChange={e => setSchNameStateId(e.target.value)}>
                  <option value="">Select State</option>
                  {statesList.map(s => (
                    <option key={s.stateId} value={s.stateId}>{s.stateName}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Captcha input */}
            <div className={styles.inputGroup} style={{ flex: '0 0 150px' }}>
              <label className={styles.inputLabel}>Captcha</label>
              <input type="text" placeholder="Enter captcha" className={styles.inputField}
                value={captchaInput} onChange={e => setCaptchaInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()} />
            </div>

            {/* Captcha image */}
            <div className={styles.captchaBox}>
              {captchaImg
                ? <img src={`data:image/png;base64,${captchaImg}`} alt="captcha" className={styles.captchaImg} />
                : <span style={{ fontSize: '0.7rem', color: '#888' }}>Loading…</span>
              }
              <span className={styles.refreshIcon}
                onClick={() => { fetchCaptcha(); setCaptchaInput(''); }}>
                &#8635;
              </span>
            </div>

            <button className={styles.searchBtn} onClick={handleSearch}>Search</button>
          </div>
          {searchError && <p style={{ color: '#dc2626', fontSize: '0.85rem', margin: '6px 0 0' }}>{searchError}</p>}
          <button className={styles.advanceSearchBtn} onClick={clearFilters}>+ Clear Filters</button>
        </div>
      </section>

      {/* URL search result message (error or empty state) */}
      {urlSearchMsg && (
        <section className={styles.orgResultHeader}>
          <span className={styles.orgError}>{urlSearchMsg}</span>
        </section>
      )}

      {/* Org search header (KVS / NVS / PM SHRI / CWSN / EMRS) */}
      {orgSearchType && (
        <section className={styles.orgResultHeader}>
          <span className={styles.orgResultLabel}>Showing schools for: <strong>{orgLabel}</strong></span>
        </section>
      )}

      {/* Content: sidebar + results */}
      <section className={styles.mainContent}>
        <aside className={styles.sidebar}>
          <button className={styles.clearFilter} onClick={clearFilters}>
            <span>&#8635;</span> Clear Filter
          </button>

          <Accordion title="School Status" open={openAccordions.status} onToggle={() => toggleAccordion('status')}>
            {(['all', 'operational', 'closed']).map(v => (
              <label key={v} className={styles.radioLabel}>
                <input type="radio" name="status" checked={statusFilter === v} onChange={() => setStatusFilter(v)} />
                {v === 'all' ? 'All Schools' : v === 'operational' ? 'Operational Schools' : 'Closed Schools'}
              </label>
            ))}
          </Accordion>

          <Accordion title="School Category" open={openAccordions.category} onToggle={() => toggleAccordion('category')}>
            {sortedCategories.map((c) => {
              const count = aggregateStats ? (aggregateStats[`schCat${c.catId}`] ?? 0) : null;
              const label = c.catValue.replace(/^\d+\s*-\s*/, '');
              return (
                <label key={c.catId} className={styles.checkLabel}>
                  <input type="checkbox" checked={selCategories.has(String(c.catId))}
                    onChange={() => toggleSet(setSelCategories, String(c.catId))} />
                  {label}{count !== null && <> ( <b>{count}</b> )</>}
                </label>
              );
            })}
          </Accordion>

          <Accordion title="Management" open={openAccordions.management} onToggle={() => toggleAccordion('management')}>
            {MGMT_BROAD.map(m => {
              const count = aggregateStats ? (aggregateStats[m.key] ?? 0) : null;
              return (
                <label key={m.key} className={styles.checkLabel}>
                  <input type="checkbox" checked={selManagements.has(m.key)}
                    onChange={() => toggleSet(setSelManagements, m.key)} />
                  {m.label}{count !== null && <> ( <b>{count}</b> )</>}
                </label>
              );
            })}
          </Accordion>

          <Accordion title="School Type" open={openAccordions.schoolType} onToggle={() => toggleAccordion('schoolType')}>
            {SCHOOL_TYPES.map(t => {
              const count = aggregateStats ? (aggregateStats[t.key] ?? 0) : null;
              return (
                <label key={t.key} className={styles.checkLabel}>
                  <input type="checkbox" checked={selSchoolTypes.has(t.schType)}
                    onChange={() => toggleSet(setSelSchoolTypes, t.schType)} />
                  {t.label}{count !== null && <> ( <b>{count}</b> )</>}
                </label>
              );
            })}
          </Accordion>
        </aside>

        <div className={styles.resultsArea}>
          <div className={styles.resultsHeader}>
            {orgLabel && schools.length > 0 && (
              <div className={styles.orgResultLabel}>
                Showing Result For : <strong>{orgLabel}</strong>
              </div>
            )}
            <div className={styles.resultsCountRow}>
              <span>Showing <b>{filteredSchools.length}</b> Result{filteredSchools.length !== 1 ? 's' : ''}{statusFilter !== 'all' ? ` (${statusFilter === 'operational' ? 'Operational' : 'Closed'} Schools)` : ' (All Schools)'}</span>
              <div className={styles.searchInline}>
                <input type="text" className={styles.inlineSearch} placeholder="Search" />
                <select className={styles.perPageSelect}>
                  <option>10</option><option>20</option><option>50</option>
                </select>
              </div>
            </div>
          </div>

          <div className={styles.schoolsList}>
            {loading && (
              <div className={styles.loadingMsg}>
                <div className={styles.spinner} />
                <p>Fetching school details from UDISE+…</p>
              </div>
            )}
            {!loading && filteredSchools.length === 0 && (
              <div className={styles.emptyMsg}>
                <p>Use the search form above to find schools.</p>
              </div>
            )}
            {!loading && filteredSchools.map((school, i) => (
              <SchoolCard key={school.udiseschCode || i} school={school} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

