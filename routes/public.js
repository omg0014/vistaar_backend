'use strict';
const { Router } = require('express');
const { getSchoolById } = require('../controllers/schoolController');

const router = Router();
router.get('/school/:id', getSchoolById);

module.exports = router;
