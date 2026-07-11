import { useState, useEffect } from 'react';
import { getSchool, getEnrolment, getFacility, getProfile, getReportCard } from '../services/schoolService';

export default function useSchoolDetail(schoolId) {
  const [school,   setSchool]   = useState(null);
  const [enrol,    setEnrol]    = useState(null);
  const [facility, setFacility] = useState(null);
  const [profile,  setProfile]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

  useEffect(() => {
    if (!schoolId) return;
    setLoading(true);
    setError('');
    Promise.all([
      getSchool(schoolId),
      getEnrolment(schoolId),
      getFacility(schoolId),
      getProfile(schoolId),
      getReportCard(schoolId),
    ])
      .then(([byYear, enrolTch, fac, prof]) => {
        if (byYear.status && byYear.data) setSchool(byYear.data);
        else { setError('School not found.'); return; }
        if (enrolTch.status && enrolTch.data) setEnrol(enrolTch.data);
        if (fac.status      && fac.data)      setFacility(fac.data);
        if (prof.status     && prof.data)     setProfile(prof.data);
      })
      .catch(() => setError('Failed to load school details.'))
      .finally(() => setLoading(false));
  }, [schoolId]);

  return { school, enrol, facility, profile, loading, error };
}
