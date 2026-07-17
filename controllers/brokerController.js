'use strict';
const getDb = require('../config/db');

async function getSharedLeads(req, res, next) {
  try {
    const db = await getDb();
    const leads = await db.collection(process.env.COLLECTION_NAME)
      .find({ sharedWith: req.user.email })
      .sort({ leadVisitedAt: -1 })
      .toArray();
    res.json({ leads });
  } catch (err) { next(err); }
}

module.exports = { getSharedLeads };
