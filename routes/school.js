'use strict';
const { Router } = require('express');
const { searchSchools, getSchoolById, patchLead, patchGoogleMapLoc, getLeads, removeLead, getSuggestions } = require('../controllers/schoolController');
const { getCollections, createCollection, deleteCollection, addSchool, removeSchool } = require('../controllers/bookmarkController');
const { getCollections: getSearchCols, createCollection: createSearchCol, deleteCollection: deleteSearchCol, addSearch, removeSearch } = require('../controllers/savedSearchController');

const router = Router();

router.post('/suggestions', getSuggestions);
router.post('/search', searchSchools);
router.post('/school/:id', getSchoolById);

router.post('/leads',       getLeads);
router.patch('/:id/lead',          patchLead);
router.patch('/school/:id/googlemaploc', patchGoogleMapLoc);
router.delete('/:id/lead', removeLead);

router.post('/search-collections/list',                     getSearchCols);
router.post('/search-collections',                          createSearchCol);
router.delete('/search-collections/:id',                    deleteSearchCol);
router.post('/search-collections/:id/searches',             addSearch);
router.delete('/search-collections/:id/searches/:searchId', removeSearch);

router.post('/bookmarks/list',                    getCollections);
router.post('/bookmarks',                         createCollection);
router.delete('/bookmarks/:id',                   deleteCollection);
router.post('/bookmarks/:id/schools',             addSchool);
router.delete('/bookmarks/:id/schools/:schoolId', removeSchool);

module.exports = router;
