export const DEFAULT_YEAR_ID = 11; // 2024-25 — used as the default yearId across API calls

// For report card / school year selectors (no Real Time option)
export const YEAR_OPTIONS = [
  { yearId: 13, yearDesc: '2026-27' },
  { yearId: 12, yearDesc: '2025-26' },
  { yearId: 11, yearDesc: '2024-25' },
  { yearId: 10, yearDesc: '2023-24' },
  { yearId: 9,  yearDesc: '2022-23' },
  { yearId: 8,  yearDesc: '2021-22' },
];

// For Home page "Explore State" stats (includes Real Time / live data option)
export const STATS_YEAR_OPTIONS = [
  { yearId: 0,  yearDesc: 'Real Time' },
  { yearId: 11, yearDesc: '2024-25' },
  { yearId: 10, yearDesc: '2023-24' },
  { yearId: 9,  yearDesc: '2022-23' },
  { yearId: 8,  yearDesc: '2021-22' },
];

export const NATIONAL_REGION_CD = '50';
