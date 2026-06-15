import { useState, useEffect } from 'react';
import { getReportCard, getFacility, getProfile, getSocialData } from '../services/schoolService';

export default function useReportCard(id, selectedYear) {
  const [school,       setSchool]      = useState(null);
  const [profileData,  setProfile]     = useState(null);
  const [facility,     setFacility]    = useState(null);
  const [socialRows,   setSocial]      = useState([]);
  const [socialTotal,  setSocialTotal] = useState(null);
  const [minorityRows, setMinority]    = useState([]);
  const [gradeRows,    setGrade]       = useState([]);
  const [gradeTotal,   setGradeTotal]  = useState(null);
  const [ewsRows,      setEwsRows]     = useState([]);
  const [ewsTotal,     setEwsTotal]    = useState(null);
  const [rteRows,      setRteRows]     = useState([]);
  const [rteTotal,     setRteTotal]    = useState(null);
  const [loading,      setLoading]     = useState(true);
  const [error,        setError]       = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError('');
    Promise.all([
      getReportCard(id, selectedYear),
      getFacility(id, selectedYear),
      getProfile(id, selectedYear),
      getSocialData(id, 1, selectedYear),
      getSocialData(id, 2, selectedYear),
      getSocialData(id, 3, selectedYear),
      getSocialData(id, 4, selectedYear),
      getSocialData(id, 5, selectedYear),
    ])
      .then(([rc, fac, prof, s1, s2, s3, s4, s5]) => {
        if (rc.status && rc.data) setSchool(rc.data);
        else { setError(rc.error?.errorDetails?.details || 'School not found.'); return; }
        if (fac.status  && fac.data)  setFacility(fac.data);
        if (prof.status && prof.data) setProfile(prof.data);
        setSocial(s1?.data?.schEnrollmentYearDataDTOS      || []);
        setSocialTotal(s1?.data?.schEnrollmentYearDataTotal || null);
        setMinority(s2?.data?.schEnrollmentYearDataDTOS    || []);
        setGrade(s3?.data?.schEnrollmentYearDataDTOS       || []);
        setGradeTotal(s3?.data?.schEnrollmentYearDataTotal  || null);
        setEwsRows(s4?.data?.schEnrollmentYearDataDTOS     || []);
        setEwsTotal(s4?.data?.schEnrollmentYearDataTotal   || null);
        setRteRows(s5?.data?.schEnrollmentYearDataDTOS     || []);
        setRteTotal(s5?.data?.schEnrollmentYearDataTotal   || null);
      })
      .catch(() => setError('Failed to load report card. Please try again.'))
      .finally(() => setLoading(false));
  }, [id, selectedYear]);

  return {
    school, profileData, facility,
    socialRows, socialTotal, minorityRows,
    gradeRows, gradeTotal, ewsRows, ewsTotal, rteRows, rteTotal,
    loading, error,
  };
}
