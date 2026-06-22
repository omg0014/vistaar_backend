'use strict';
const { ObjectId } = require('mongodb');
const getDb = require('../config/db');

const COLLECTIONS = ['Eastern Marwadi Stronghold school', 'TWC', 'TRN'];
const MAX_PER_COLL = 200;
const PAGE_SIZE = 20;

function buildFilter(type, q) {
  switch (type) {
    case 'schoolName': return { schoolName: { $regex: q, $options: 'i' } };
    case 'address':    return { address:    { $regex: q, $options: 'i' } };
    case 'cityState':  return { $or: [{ city: { $regex: q, $options: 'i' } }, { state: { $regex: q, $options: 'i' } }] };
    case 'pincode': {
      const num = Number(q);
      return isNaN(num) ? { pincode: q } : { $or: [{ pincode: num }, { pincode: q }] };
    }
    default: return null;
  }
}

async function searchSchools(req, res, next) {
  try {
    const { type, q, page = 1 } = req.query;
    if (!type || !q || !q.trim()) {
      return res.status(400).json({ error: 'type and q are required' });
    }
    const filter = buildFilter(type, q.trim());
    if (!filter) return res.status(400).json({ error: 'Invalid search type' });

    const db = await getDb();
    const pageNum = Math.max(1, parseInt(page) || 1);

    const perColl = await Promise.all(
      COLLECTIONS.map(async (name) => {
        const coll = db.collection(name);
        const [total, docs] = await Promise.all([
          coll.countDocuments(filter),
          coll.find(filter, {
            projection: { schoolName: 1, city: 1, pincode: 1, district: 1, state: 1, address: 1 }
          }).limit(MAX_PER_COLL).toArray()
        ]);
        return { total, docs: docs.map(d => ({ ...d, _col: name })) };
      })
    );

    const total      = perColl.reduce((s, r) => s + r.total, 0);
    const allDocs    = perColl
      .flatMap(r => r.docs)
      .sort((a, b) => (a.schoolName || '').localeCompare(b.schoolName || ''));
    const totalPages = Math.ceil(allDocs.length / PAGE_SIZE);
    const skip       = (pageNum - 1) * PAGE_SIZE;
    const results    = allDocs.slice(skip, skip + PAGE_SIZE);

    res.json({ total, fetched: allDocs.length, page: pageNum, totalPages, results });
  } catch (err) {
    next(err);
  }
}

async function getSchoolById(req, res, next) {
  try {
    const { id }  = req.params;
    const { col } = req.query;
    if (!col) return res.status(400).json({ error: 'col query param is required' });

    const db  = await getDb();
    const doc = await db.collection(col).findOne({ _id: new ObjectId(id) });
    if (!doc) return res.status(404).json({ error: 'School not found' });

    res.json(doc);
  } catch (err) {
    next(err);
  }
}

module.exports = { searchSchools, getSchoolById };
