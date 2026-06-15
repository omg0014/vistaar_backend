import apiFetch from './api';

export const getStates    = (yearId)             => apiFetch(`/api/masters/states?yearId=${yearId}`);
export const getDistricts = (stateId, yearId)    => apiFetch(`/api/masters/districts?stateId=${stateId}&yearId=${yearId}`);
export const getBlocks    = (districtId, yearId) => apiFetch(`/api/masters/blocks?districtId=${districtId}&yearId=${yearId}`);
export const getYears     = ()                   => apiFetch('/api/masters/years');
