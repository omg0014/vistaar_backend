'use strict';
const { Router } = require('express');
const { searchSchools, getSchoolById, patchLead, patchGoogleMapLoc, getLeads, removeLead, getSuggestions } = require('../controllers/schoolController');
const { getCollections, createCollection, deleteCollection, addSchool, removeSchool } = require('../controllers/bookmarkController');
const { list: listSavedSearches, create: createSavedSearch, remove: removeSavedSearch } = require('../controllers/savedSearchController');

const router = Router();

router.get('/suggestions', getSuggestions);
router.post('/search', searchSchools);
router.get('/search', searchSchools);
router.get('/school/:id', getSchoolById);

router.get('/leads',       getLeads);
router.patch('/:id/lead',          patchLead);
router.patch('/school/:id/googlemaploc', patchGoogleMapLoc);
router.delete('/:id/lead', removeLead);

router.get('/saved-searches',                     listSavedSearches);
router.post('/saved-searches',                    createSavedSearch);
router.delete('/saved-searches/:id',              removeSavedSearch);

router.get('/bookmarks',                          getCollections);
router.post('/bookmarks',                         createCollection);
router.delete('/bookmarks/:id',                   deleteCollection);
router.post('/bookmarks/:id/schools',             addSchool);
router.delete('/bookmarks/:id/schools/:schoolId', removeSchool);

module.exports = router;
