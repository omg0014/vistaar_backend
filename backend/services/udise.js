const axios = require('axios');

const BASE = process.env.UDISE_BASE;
const SIG  = process.env.X_APP_SIGNATURE;

// X-APP-SIGNATURE is a secret — kept server-side only, never sent to the browser
const HEADERS = {
  'X-APP-SIGNATURE': SIG,
  'Origin':  'https://kys.udiseplus.gov.in',
  'Referer': 'https://kys.udiseplus.gov.in/',
};

async function udise(path, params = {}) {
  const { data } = await axios.get(`${BASE}/${path}`, { headers: HEADERS, params });
  return data;
}

module.exports = udise;
