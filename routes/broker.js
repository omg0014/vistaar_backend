'use strict';
const { Router }      = require('express');
const { getSharedLeads } = require('../controllers/brokerController');

const router = Router();
router.post('/leads', getSharedLeads);

module.exports = router;
