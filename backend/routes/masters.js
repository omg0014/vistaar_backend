const router = require('express').Router();
const udise  = require('../services/udise');

// All academic years (yearId 0=Real Time, 11=2024-25 etc.)
router.get('/years', async (req, res) => {
  try {
    const data = await udise('getYears');
    res.json(data);
  } catch (e) {
    res.status(500).json({ status: false, error: e.message });
  }
});

// All states with udiseStateCode (use as regionCd for region stats)
router.get('/states', async (req, res) => {
  try {
    const data = await udise('states', req.query);
    res.json(data);
  } catch (e) {
    res.status(500).json({ status: false, error: e.message });
  }
});

// Districts for a state (?stateId=128&yearId=11)
router.get('/districts', async (req, res) => {
  try {
    const data = await udise('districts', req.query);
    res.json(data);
  } catch (e) {
    res.status(500).json({ status: false, error: e.message });
  }
});

// Blocks for a district (?districtId=100&yearId=11)
router.get('/blocks', async (req, res) => {
  try {
    const data = await udise('blocks', req.query);
    res.json(data);
  } catch (e) {
    res.status(500).json({ status: false, error: e.message });
  }
});

module.exports = router;
