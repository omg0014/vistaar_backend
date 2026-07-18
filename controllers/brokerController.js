'use strict';
const getDb = require('../config/db');

async function getSharedCollections(req, res, next) {
  try {
    const db = await getDb();
    const collections = await db.collection('bookmarks')
      .find({ sharedWith: req.user.email })
      .sort({ lastUpdatedAt: -1 })
      .toArray();
    res.json({ collections });
  } catch (err) { next(err); }
}

module.exports = { getSharedCollections };
