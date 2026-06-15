const router = require('express').Router();
const udise  = require('../services/udise');

// Fetch captcha image from UDISE (IP-based, no session — backend must make both captcha + search calls)
router.get('/captcha', async (req, res) => {
  try {
    const data = await udise('getCaptcha');
    res.json(data);
  } catch (e) {
    res.status(500).json({ status: false, error: e.message });
  }
});

// Verify captcha without consuming it — returns { data: true } if correct, { data: false } if wrong
router.get('/verify-captcha', async (req, res) => {
  try {
    const { captcha = '' } = req.query;
    const data = await udise('verifyCaptcha', { captcha });
    res.json(data);
  } catch (e) {
    res.status(500).json({ status: false, error: e.message });
  }
});

// Search schools by type (1=keyword, 2=school name+stateId, 3=UDISE code, 4=PIN, 5/6=org)
router.get('/', async (req, res) => {
  try {
    const { type, param = '', yearId = 0, captcha = 'ewDVKv', stateId } = req.query;
    const body = { searchType: type, searchParam: param, captcha, yearId };
    if (stateId) body.stateId = stateId;
    const data = await udise('search-schools', body);
    res.json(data);
  } catch (e) {
    res.status(500).json({ status: false, error: e.message });
  }
});

// Keyword autocomplete (Home page search bar, no captcha required)
router.get('/keyword', async (req, res) => {
  try {
    const { q = '' } = req.query;
    const data = await udise('search-school/by-keyword', { schoolName: q });
    res.json(data);
  } catch (e) {
    res.status(500).json({ status: false, error: e.message });
  }
});

// School category dropdown list
router.get('/categories', async (req, res) => {
  try {
    const data = await udise('fetchCategoryList');
    res.json(data);
  } catch (e) {
    res.status(500).json({ status: false, error: e.message });
  }
});

module.exports = router;
