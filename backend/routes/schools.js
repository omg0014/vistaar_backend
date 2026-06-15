const router = require('express').Router();
const udise  = require('../services/udise');

// School basic info — name, location, classes, management, year
router.get('/:id', async (req, res) => {
  try {
    const data = await udise('school/by-year', { schoolId: req.params.id, action: 1 });
    res.json(data);
  } catch (e) {
    res.status(500).json({ status: false, error: e.message });
  }
});

// Student enrolment + teacher count split by gender/type
router.get('/:id/enrolment', async (req, res) => {
  try {
    const data = await udise('school-statistics/enrolment-teacher', { schoolId: req.params.id });
    res.json(data);
  } catch (e) {
    res.status(500).json({ status: false, error: e.message });
  }
});

// Infrastructure & facilities (toilet, library, internet, ramp etc.)
router.get('/:id/facility', async (req, res) => {
  try {
    const params = { schoolId: req.params.id };
    if (req.query.yearId) params.yearId = req.query.yearId;
    const data = await udise('school/facility', params);
    res.json(data);
  } catch (e) {
    res.status(500).json({ status: false, error: e.message });
  }
});

// School profile — estd year, board, medium, principal, website
router.get('/:id/profile', async (req, res) => {
  try {
    const params = { schoolId: req.params.id };
    if (req.query.yearId) params.yearId = req.query.yearId;
    const data = await udise('school/profile', params);
    res.json(data);
  } catch (e) {
    res.status(500).json({ status: false, error: e.message });
  }
});

// Report card headline stats — teachers, enrolment, grants, MDM
router.get('/:id/report-card', async (req, res) => {
  try {
    const params = { schoolId: req.params.id };
    if (req.query.yearId) params.yearId = req.query.yearId;
    const data = await udise('school/report-card', params);
    res.json(data);
  } catch (e) {
    res.status(500).json({ status: false, error: e.message });
  }
});

// Enrolment breakdown by social category / religion / grade / EWS / RTE
// flag: 1=SC/ST/OBC, 2=religion, 3=grade, 4=EWS, 5=RTE
router.get('/:id/social', async (req, res) => {
  try {
    const { flag, yearId } = req.query;
    const data = await udise('getSocialData', { flag, schoolId: req.params.id, yearId });
    res.json(data);
  } catch (e) {
    res.status(500).json({ status: false, error: e.message });
  }
});

// Available academic years for this school's report card dropdown
router.get('/:id/years', async (req, res) => {
  try {
    const data = await udise('getYearData', { udise: req.params.id, action: 1 });
    res.json(data);
  } catch (e) {
    res.status(500).json({ status: false, error: e.message });
  }
});

// School history across all academic years — name, state, district, block, category, type, status
router.get('/:id/track', async (req, res) => {
  try {
    const data = await udise('school/track', { schoolId: req.params.id });
    res.json(data);
  } catch (e) {
    res.status(500).json({ status: false, error: e.message });
  }
});

module.exports = router;
