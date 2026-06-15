import apiFetch from './api';

export const getCaptcha = () =>
  apiFetch('/api/search/captcha');

export const verifyCaptcha = (captcha) =>
  apiFetch(`/api/search/verify-captcha?captcha=${encodeURIComponent(captcha)}`);

export const searchByKeyword = (q) =>
  apiFetch(`/api/search/keyword?q=${encodeURIComponent(q)}`);

export const searchSchools = (type, param, yearId = 0, captcha = 'ewDVKv', stateId) => {
  const params = new URLSearchParams({ type, param, yearId, captcha });
  if (stateId) params.set('stateId', stateId);
  return apiFetch(`/api/search?${params.toString()}`);
};

export const getCategories = () =>
  apiFetch('/api/search/categories');
