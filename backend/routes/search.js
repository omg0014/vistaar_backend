'use strict';
const { Router } = require('express');
const { searchSchools, getSchoolById } = require('../controllers/searchController');

const router = Router();

router.get('/',           searchSchools);
router.get('/school/:id', getSchoolById);

module.exports = router;
