'use strict';

const getDb = require('../config/db');
const { escapeRegex } = require('../utils/regex');

// Notional students-per-classroom used to derive the efficiency %. Kept in one
// place so the aggregation, the frontend badge, and the detail page can't drift.
const STUDENTS_PER_CLASSROOM = 35;
const EFF_ADD_FIELDS = {
  $addFields: {
    _eff: {
      $cond: {
        if: { $gt: [{ $ifNull: ['$totalClassrooms', 0] }, 0] },
        then: { $multiply: [{ $divide: [{ $ifNull: ['$totalStudents', 0] }, { $multiply: [{ $ifNull: ['$totalClassrooms', 0] }, STUDENTS_PER_CLASSROOM] }] }, 100] },
        else: null,
      },
    },
  },
};

async function searchSchools(req, res, next) {
  try {
    const { type, q, page = 1, limit = 10, min1, max1, min2, max2, min3, max3, sortBy, sortOrder, fCity, fDistrict, fState, fPin, fArea, fName } = req.body;

    if (!type || !q || q.trim() === '') {
      return res.status(400).json({ error: 'type and q are required' });
    }

    let filter;
    const qSafe = escapeRegex(q.trim());
    if (type === 'schoolName') {
      filter = { schoolName: { $regex: qSafe, $options: 'i' } };
    } else if (type === 'address') {
      filter = { address: { $regex: qSafe, $options: 'i' } };
    } else if (type === 'cityState') {
      filter = { $or: [{ city: { $regex: qSafe, $options: 'i' } }, { state: { $regex: qSafe, $options: 'i' } }] };
    } else if (type === 'pincode') {
      const num = Number(q.trim());
      filter = isNaN(num) ? { pincode: q.trim() } : { $or: [{ pincode: num }, { pincode: q.trim() }] };
    } else {
      return res.status(400).json({ error: 'Invalid type' });
    }

    const pageNum  = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip     = (pageNum - 1) * limitNum;

    const extraMatch = {};
    if (min1 !== undefined && min1 !== '') extraMatch.totalTeachers = { ...extraMatch.totalTeachers, $gte: Number(min1) };
    if (max1 !== undefined && max1 !== '') extraMatch.totalTeachers = { ...extraMatch.totalTeachers, $lte: Number(max1) };
    if (min2 !== undefined && min2 !== '') extraMatch.totalStudents = { ...extraMatch.totalStudents, $gte: Number(min2) };
    if (max2 !== undefined && max2 !== '') extraMatch.totalStudents = { ...extraMatch.totalStudents, $lte: Number(max2) };
    if (min3 !== undefined && min3 !== '') extraMatch._eff = { ...extraMatch._eff, $gte: Number(min3) };
    if (max3 !== undefined && max3 !== '') extraMatch._eff = { ...extraMatch._eff, $lte: Number(max3) };
    if (fCity)     extraMatch.city       = { $regex: escapeRegex(fCity.trim()),     $options: 'i' };
    if (fDistrict) extraMatch.district   = { $regex: escapeRegex(fDistrict.trim()), $options: 'i' };
    if (fState)    extraMatch.state      = { $regex: escapeRegex(fState.trim()),    $options: 'i' };
    if (fPin)      { const pNum = Number(fPin.trim()); extraMatch.pincode = isNaN(pNum) ? fPin.trim() : { $in: [pNum, fPin.trim()] }; }
    if (fArea)     extraMatch.address    = { $regex: escapeRegex(fArea.trim()),     $options: 'i' };
    if (fName)     extraMatch.schoolName = { $regex: escapeRegex(fName.trim()),     $options: 'i' };

    // The computed _eff field is only needed when we filter or sort on it.
    // Filtering needs it in BOTH the results and the count pipeline; sorting
    // needs it only in the results pipeline. Omitting it lets the count query
    // (and unsorted searches) skip a per-document computation over the match.
    const effFilterActive = '_eff' in extraMatch;
    const dir = sortOrder === 'asc' ? 1 : -1;
    let sortStage = { _id: 1 };
    if (sortBy === 'teachers')   sortStage = { totalTeachers: dir };
    if (sortBy === 'students')   sortStage = { totalStudents: dir };
    if (sortBy === 'efficiency') sortStage = { _eff: dir };

    // Base pipeline shared by both queries. When an efficiency filter is active
    // the computed field must precede the extra $match that references it.
    const basePipeline = [{ $match: filter }];
    if (effFilterActive) basePipeline.push(EFF_ADD_FIELDS);
    if (Object.keys(extraMatch).length > 0) basePipeline.push({ $match: extraMatch });

    const resultsPipeline = [...basePipeline];
    // Add _eff for an efficiency sort if the filter didn't already introduce it.
    if (sortBy === 'efficiency' && !effFilterActive) resultsPipeline.push(EFF_ADD_FIELDS);
    resultsPipeline.push({ $sort: sortStage }, { $skip: skip }, { $limit: limitNum });

    const db = await getDb();
    const [results, countResult] = await Promise.all([
      db.collection(process.env.COLLECTION_NAME).aggregate(resultsPipeline).toArray(),
      db.collection(process.env.COLLECTION_NAME).aggregate([...basePipeline, { $count: 'total' }]).toArray(),
    ]);

    const total = countResult[0]?.total || 0;
    res.json({ total, results, page: pageNum, hasMore: skip + results.length < total });

  } catch (err) {
    next(err);
  }
}

const { ObjectId } = require('mongodb');

async function getSchoolById(req, res, next) {
  try {
    const { id } = req.params;
    const db = await getDb();
    const school = await db
      .collection(process.env.COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) });

    if (!school) return res.status(404).json({ error: 'School not found' });

    res.json(school);
  } catch (err) {
    next(err);
  }
}

const PUBLIC_PROJECTION = { isLead: 0, leadVisitedAt: 0 };

async function getPublicSchool(req, res, next) {
  try {
    const { slug } = req.params;
    const db = await getDb();
    const col = db.collection(process.env.COLLECTION_NAME);
    let school;

    if (/^[0-9a-f]{24}$/i.test(slug)) {
      school = await col.findOne({ _id: new ObjectId(slug) }, { projection: PUBLIC_PROJECTION });
    } else {
      const pattern = escapeRegex(slug).replace(/-+/g, '[^a-z0-9]+');
      school = await col.findOne(
        { schoolName: { $regex: new RegExp('^' + pattern + '$', 'i') } },
        { projection: PUBLIC_PROJECTION }
      );
    }

    if (!school) return res.status(404).json({ error: 'School not found' });
    res.json(school);
  } catch (err) {
    next(err);
  }
}

async function patchGoogleMapLoc(req, res, next) {
  try {
    const { id } = req.params;
    const { googleMapLoc } = req.body;
    const db = await getDb();
    await db.collection(process.env.COLLECTION_NAME)
      .updateOne({ _id: new ObjectId(id) }, { $set: { googleMapLoc: googleMapLoc || '' } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

async function patchLead(req, res, next) {
  try {
    const { id } = req.params;
    const db = await getDb();
    await db.collection(process.env.COLLECTION_NAME)
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { isLead: true, leadVisitedAt: new Date() } }
      );
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

async function getLeads(req, res, next) {
  try {
    const db = await getDb();
    const leads = await db.collection(process.env.COLLECTION_NAME)
      .find({ isLead: true })
      .sort({ leadVisitedAt: -1 })
      .limit(100)
      .toArray();
    res.json({ leads });
  } catch (err) {
    next(err);
  }
}

async function removeLead(req, res, next) {
  try {
    const { id } = req.params;
    const db = await getDb();
    await db.collection(process.env.COLLECTION_NAME)
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { isLead: false }, $unset: { leadVisitedAt: '' } }
      );
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

async function getSuggestions(req, res, next) {
  try {
    const q = req.body.q || '';
    if (q.trim().length < 2) return res.json([]);
    const db = await getDb();
    const results = await db.collection(process.env.COLLECTION_NAME)
      .find({ schoolName: { $regex: escapeRegex(q.trim()), $options: 'i' } })
      .project({ schoolName: 1 })
      .limit(20)
      .toArray();
    res.json(results);
  } catch (err) {
    next(err);
  }
}

module.exports = { searchSchools, getSchoolById, getPublicSchool, patchLead, patchGoogleMapLoc, getLeads, removeLead, getSuggestions };

