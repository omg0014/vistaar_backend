'use strict';
const { Router } = require('express');
const { getPublicSchool } = require('../controllers/schoolController');

const router = Router();
router.get('/school/:slug', getPublicSchool);

module.exports = router;
