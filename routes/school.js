'use strict';
const { Router } = require('express');
const { searchSchools, getSchoolById, patchLead, getLeads, removeLead } = require('../controllers/schoolController');


const router = Router();

router.get('/leads',       getLeads);
router.patch('/:id/lead',  patchLead);

router.post('/search', searchSchools);
router.get('/search', searchSchools);
router.get('/school/:id', getSchoolById);

router.get('/leads',       getLeads);
router.patch('/:id/lead',  patchLead)
router.delete('/:id/lead', removeLead);

module.exports = router;
