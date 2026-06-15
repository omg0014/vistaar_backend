import apiFetch from './api';

export const getRegionFacilities = (regionCd, yearId) =>
  apiFetch(`/api/region/facilities?regionCd=${regionCd}&yearId=${yearId}`);

export const getRegionEnrolment = (regionCd, yearId) =>
  apiFetch(`/api/region/enrolment?regionCd=${regionCd}&yearId=${yearId}`);

export const getRegionTeachers = (regionCd, yearId) =>
  apiFetch(`/api/region/teachers?regionCd=${regionCd}&yearId=${yearId}`);

export const getRegionStats = (regionCd, yearId) =>
  apiFetch(`/api/region/stats?regionCd=${regionCd}&yearId=${yearId}`);
