// Strip numeric prefixes from API values: "2-Urban" → "Urban", "1-CBSE" → "CBSE"
export function clean(val) {
  if (val == null) return val;
  const s = String(val).replace(/^\d+-/, '').trim();
  return s === 'null' ? null : s;
}

// Returns 'NA' for null/undefined/empty values
export function v(val) {
  return val !== undefined && val !== null && val !== '' ? String(val) : 'NA';
}

// Format a number with Indian locale commas
export function formatNum(val) {
  if (val == null) return '—';
  return Number(val).toLocaleString('en-IN');
}
