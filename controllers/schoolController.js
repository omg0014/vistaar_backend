'use strict';

const getDb = require('../config/db');

async function searchSchools(req, res, next) {
  try {

    // Get type and q based on request method
    let type;
    let q;

    if (req.method === "POST") {
      type = req.body.type;
      q = req.body.q;
    } else {
      type = req.query.type;
      q = req.query.q;
    }

    // Check if both values are provided
    if (!type || !q || q.trim() === "") {
      return res.status(400).json({
        error: "type and q are required"
      });
    }

    // Create MongoDB filter
    let filter;

    if (type === "schoolName") {
      filter = {
        schoolName: {
          $regex: q.trim(),
          $options: "i"
        }
      };

    } else if (type === "address") {
      filter = {
        address: {
          $regex: q.trim(),
          $options: "i"
        }
      };

    } else if (type === "cityState") {
      filter = {
        $or: [
          {
            city: {
              $regex: q.trim(),
              $options: "i"
            }
          },
          {
            state: {
              $regex: q.trim(),
              $options: "i"
            }
          }
        ]
      };

    } else if (type === "pincode") {
      const num = Number(q.trim());
      filter = isNaN(num)
        ? { pincode: q.trim() }
        : { $or: [{ pincode: num }, { pincode: q.trim() }] };
    } else {
      return res.status(400).json({ error: "Invalid type" });
    }

    const db = await getDb();
    const results = await db
      .collection(process.env.COLLECTION_NAME)
      .find(filter)
      .toArray();

    res.json({ total: results.length, results });

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
    const q = req.query.q || '';
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

module.exports = { searchSchools, getSchoolById, patchLead, getLeads, removeLead, getSuggestions };

