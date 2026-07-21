'use strict';
const { Router } = require('express');
const { searchSchools, getSchoolById, patchLead, patchGoogleMapLoc, getLeads, removeLead, getSuggestions } = require('../controllers/schoolController');
const { getCollections, reorderCollections, createCollection, deleteCollection, addSchool, removeSchool, reorderSchools, shareCollection, unshareCollection } = require('../controllers/bookmarkController');
const { getCollections: getSearchCols, createCollection: createSearchCol, deleteCollection: deleteSearchCol, addSearch, removeSearch } = require('../controllers/savedSearchController');
const requireAdmin = require('../middlewares/requireAdmin');
const validateObjectId = require('../middlewares/validateObjectId');

const router = Router();

// The parent mount (server.js) applies requireAuth to this whole router, which
// admits any authenticated user — INCLUDING brokers. Brokers must only ever see
// individual report cards for schools inside collections shared with them, so
// only POST /school/:id is left open to any authenticated user. Every other
// route here is admin-only and must carry requireAdmin explicitly; a missing
// guard here is a privilege-escalation bug, not a style nit.
router.post('/school/:id', validateObjectId('id'), getSchoolById);

router.post('/suggestions', requireAdmin, getSuggestions);
router.post('/search',      requireAdmin, searchSchools);

router.post('/leads',                    requireAdmin, getLeads);
router.patch('/:id/lead',                requireAdmin, validateObjectId('id'), patchLead);
router.patch('/school/:id/googlemaploc', requireAdmin, validateObjectId('id'), patchGoogleMapLoc);
router.delete('/:id/lead',               requireAdmin, validateObjectId('id'), removeLead);

router.post('/search-collections/list',                     requireAdmin, getSearchCols);
router.post('/search-collections',                          requireAdmin, createSearchCol);
router.delete('/search-collections/:id',                    requireAdmin, validateObjectId('id'), deleteSearchCol);
router.post('/search-collections/:id/searches',             requireAdmin, validateObjectId('id'), addSearch);
router.delete('/search-collections/:id/searches/:searchId', requireAdmin, validateObjectId('id'), removeSearch);

router.post('/bookmarks/list',                    requireAdmin, getCollections);
router.post('/bookmarks/reorder',                 requireAdmin, reorderCollections);
router.post('/bookmarks',                         requireAdmin, createCollection);
router.delete('/bookmarks/:id',                   requireAdmin, validateObjectId('id'), deleteCollection);
router.post('/bookmarks/:id/schools/reorder',     requireAdmin, validateObjectId('id'), reorderSchools);
router.post('/bookmarks/:id/schools',             requireAdmin, validateObjectId('id'), addSchool);
router.delete('/bookmarks/:id/schools/:schoolId', requireAdmin, validateObjectId('id'), removeSchool);
router.post('/bookmarks/:id/share',               requireAdmin, validateObjectId('id'), shareCollection);
router.post('/bookmarks/:id/unshare',             requireAdmin, validateObjectId('id'), unshareCollection);

module.exports = router;
