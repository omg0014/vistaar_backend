'use strict';

const getDb = require('../config/db');

async function searchSchools(req, res, next) {
  try {
    const { type, q, page = 1, limit = 10, min1, max1, min2, max2, min3, max3, sortBy, sortOrder, fCity, fDistrict, fState, fPin, fArea, fName } = req.body;

    if (!type || !q || q.trim() === '') {
      return res.status(400).json({ error: 'type and q are required' });
    }

    let filter;
    if (type === 'schoolName') {
      filter = { schoolName: { $regex: q.trim(), $options: 'i' } };
    } else if (type === 'address') {
      filter = { address: { $regex: q.trim(), $options: 'i' } };
    } else if (type === 'cityState') {
      filter = { $or: [{ city: { $regex: q.trim(), $options: 'i' } }, { state: { $regex: q.trim(), $options: 'i' } }] };
    } else if (type === 'pincode') {
      const num = Number(q.trim());
      filter = isNaN(num) ? { pincode: q.trim() } : { $or: [{ pincode: num }, { pincode: q.trim() }] };
    } else {
      return res.status(400).json({ error: 'Invalid type' });
    }

    const pageNum  = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip     = (pageNum - 1) * limitNum;

    const pipeline = [
      { $match: filter },
      { $addFields: { _eff: { $cond: { if: { $gt: [{ $ifNull: ['$totalClassrooms', 0] }, 0] }, then: { $multiply: [{ $divide: [{ $ifNull: ['$totalStudents', 0] }, { $multiply: [{ $ifNull: ['$totalClassrooms', 0] }, 35] }] }, 100] }, else: null } } } },
    ];

    const extraMatch = {};
    if (min1 !== undefined && min1 !== '') extraMatch.totalTeachers = { ...extraMatch.totalTeachers, $gte: Number(min1) };
    if (max1 !== undefined && max1 !== '') extraMatch.totalTeachers = { ...extraMatch.totalTeachers, $lte: Number(max1) };
    if (min2 !== undefined && min2 !== '') extraMatch.totalStudents = { ...extraMatch.totalStudents, $gte: Number(min2) };
    if (max2 !== undefined && max2 !== '') extraMatch.totalStudents = { ...extraMatch.totalStudents, $lte: Number(max2) };
    if (min3 !== undefined && min3 !== '') extraMatch._eff = { ...extraMatch._eff, $gte: Number(min3) };
    if (max3 !== undefined && max3 !== '') extraMatch._eff = { ...extraMatch._eff, $lte: Number(max3) };
    if (fCity)     extraMatch.city       = { $regex: fCity.trim(),     $options: 'i' };
    if (fDistrict) extraMatch.district   = { $regex: fDistrict.trim(), $options: 'i' };
    if (fState)    extraMatch.state      = { $regex: fState.trim(),    $options: 'i' };
    if (fPin)      { const pNum = Number(fPin.trim()); extraMatch.pincode = isNaN(pNum) ? fPin.trim() : { $in: [pNum, fPin.trim()] }; }
    if (fArea)     extraMatch.address    = { $regex: fArea.trim(),     $options: 'i' };
    if (fName)     extraMatch.schoolName = { $regex: fName.trim(),     $options: 'i' };
    if (Object.keys(extraMatch).length > 0) pipeline.push({ $match: extraMatch });

    const dir = sortOrder === 'asc' ? 1 : -1;
    let sortStage = { _id: 1 };
    if (sortBy === 'teachers')   sortStage = { totalTeachers: dir };
    if (sortBy === 'students')   sortStage = { totalStudents: dir };
    if (sortBy === 'efficiency') sortStage = { _eff: dir };

    const db = await getDb();
    const [results, countResult] = await Promise.all([
      db.collection(process.env.COLLECTION_NAME).aggregate([...pipeline, { $sort: sortStage }, { $skip: skip }, { $limit: limitNum }]).toArray(),
      db.collection(process.env.COLLECTION_NAME).aggregate([...pipeline, { $count: 'total' }]).toArray(),
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

async function getPublicSchool(req, res, next) {
  try {
    const { slug } = req.params;
    const db = await getDb();
    const col = db.collection(process.env.COLLECTION_NAME);
    let school;

    if (/^[0-9a-f]{24}$/i.test(slug)) {
      school = await col.findOne({ _id: new ObjectId(slug) });
    } else {
      const pattern = slug.replace(/-+/g, '[^a-z0-9]+');
      school = await col.findOne({ schoolName: { $regex: new RegExp('^' + pattern + '$', 'i') } });
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

// async function cnt(req, res, next) {
//   const db = await getDb();
//   const count = await db.collection(process.env.COLLECTION_NAME).countDocuments();
//   res.json({ count });
// }



async function getSuggestions(req, res, next) {
  try {
    const q = req.body.q || '';
    if (q.trim().length < 2) return res.json([]);
    const db = await getDb();
    const results = await db.collection(process.env.COLLECTION_NAME)
      .find({ schoolName: { $regex: q.trim(), $options: 'i' } })
      .project({ schoolName: 1 })
      .limit(20)
      .toArray();
    res.json(results);
  } catch (err) {
    next(err);
  }
}

module.exports = { searchSchools, getSchoolById, getPublicSchool, patchLead, patchGoogleMapLoc, getLeads, removeLead, getSuggestions };

