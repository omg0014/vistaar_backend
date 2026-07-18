'use strict';
const { Router }     = require('express');
const requireAdmin   = require('../middlewares/requireAdmin');
const { getBrokers, createBroker, deleteBroker, getBrokerCollections } = require('../controllers/adminController');

const router = Router();
router.use(requireAdmin);

router.post('/brokers/list',             getBrokers);
router.post('/brokers',                  createBroker);
router.post('/brokers/:id/collections',  getBrokerCollections);
router.delete('/brokers/:id',            deleteBroker);

module.exports = router;
