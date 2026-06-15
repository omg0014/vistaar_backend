const router = require('express').Router();
const udise  = require('../services/udise');

// School & Facilities tab — % stats for facilities at national/state/district/block level
router.get('/facilities', async (req, res) => {
  try {
    const data = await udise('region-statistics/facility-per', req.query);
    res.json(data);
  } catch (e) {
    res.status(500).json({ status: false, error: e.message });
  }
});

// Enrolment tab — % enrolment by gender, level (primary/secondary), category (SC/ST/OBC)
router.get('/enrolment', async (req, res) => {
  try {
    const data = await udise('region-statistics/enrolment-per', req.query);
    res.json(data);
  } catch (e) {
    res.status(500).json({ status: false, error: e.message });
  }
});

// Teachers tab — % teacher stats by gender, qualification, type (regular/contractual)
router.get('/teachers', async (req, res) => {
  try {
    const data = await udise('region-statistics/teacher-per', req.query);
    res.json(data);
  } catch (e) {
    res.status(500).json({ status: false, error: e.message });
  }
});

// Home page national stats — school count by broad management/category
router.get('/stats', async (req, res) => {
  try {
    const data = await udise('region-statistics/by-broad-cat-mgt', req.query);
    res.json(data);
  } catch (e) {
    res.status(500).json({ status: false, error: e.message });
  }
});

module.exports = router;
