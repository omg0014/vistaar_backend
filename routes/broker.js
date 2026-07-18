'use strict';
const { Router }              = require('express');
const { getSharedCollections } = require('../controllers/brokerController');

const router = Router();
router.post('/collections', getSharedCollections);

module.exports = router;
