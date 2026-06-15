import apiFetch from './api';

export const getSchool      = (id)               => apiFetch(`/api/schools/${id}`);
export const getEnrolment   = (id)               => apiFetch(`/api/schools/${id}/enrolment`);
export const getFacility    = (id, yearId)        => apiFetch(`/api/schools/${id}/facility${yearId ? `?yearId=${yearId}` : ''}`);
export const getProfile     = (id, yearId)        => apiFetch(`/api/schools/${id}/profile${yearId ? `?yearId=${yearId}` : ''}`);
export const getReportCard  = (id, yearId)        => apiFetch(`/api/schools/${id}/report-card${yearId ? `?yearId=${yearId}` : ''}`);
export const getSocialData  = (id, flag, yearId)  => apiFetch(`/api/schools/${id}/social?flag=${flag}&yearId=${yearId}`);
export const getSchoolYears = (id)               => apiFetch(`/api/schools/${id}/years`);
export const trackSchool    = (id)               => apiFetch(`/api/schools/${id}/track`);
