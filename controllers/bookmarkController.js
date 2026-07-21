'use strict';
const getDb = require('../config/db');
const { ObjectId } = require('mongodb');

const COLL = 'bookmarks';

async function getCollections(req, res, next) {
  try {
    const db = await getDb();
    const cols = await db.collection(COLL).find({}).sort({ lastUpdatedAt: -1 }).limit(500).toArray();
    res.json(cols);
  } catch (err) { next(err); }
}

async function createCollection(req, res, next) {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'name required' });
    const db = await getDb();
    const result = await db.collection(COLL).insertOne({ name, schools: [], createdAt: new Date(), lastUpdatedAt: new Date() });
    res.json({ _id: result.insertedId, name, schools: [] });
  } catch (err) { next(err); }
}

async function deleteCollection(req, res, next) {
  try {
    const db = await getDb();
    await db.collection(COLL).deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ success: true });
  } catch (err) { next(err); }
}

async function addSchool(req, res, next) {
  try {
    const { school } = req.body;
    if (!school || !school._id) return res.status(400).json({ error: 'school with an _id is required' });
    const db = await getDb();
    // Single atomic op: push only if this school isn't already present. The old
    // find-then-update had a TOCTOU race where two concurrent adds both saw the
    // school as absent and pushed duplicates.
    await db.collection(COLL).updateOne(
      { _id: new ObjectId(req.params.id), 'schools._id': { $ne: school._id } },
      { $push: { schools: school }, $set: { lastUpdatedAt: new Date() } }
    );
    res.json({ success: true });
  } catch (err) { next(err); }
}

async function removeSchool(req, res, next) {
  try {
    const db = await getDb();
    await db.collection(COLL).updateOne(
      { _id: new ObjectId(req.params.id) },
      { $pull: { schools: { _id: req.params.schoolId } } }
    );
    res.json({ success: true });
  } catch (err) { next(err); }
}

async function shareCollection(req, res, next) {
  try {
    const brokerEmail = req.body.brokerEmail?.trim().toLowerCase();
    if (!brokerEmail) return res.status(400).json({ error: 'brokerEmail is required' });
    const db = await getDb();
    await db.collection(COLL).updateOne(
      { _id: new ObjectId(req.params.id) },
      { $addToSet: { sharedWith: brokerEmail } }
    );
    res.json({ success: true });
  } catch (err) { next(err); }
}

async function unshareCollection(req, res, next) {
  try {
    const brokerEmail = req.body.brokerEmail?.trim().toLowerCase();
    if (!brokerEmail) return res.status(400).json({ error: 'brokerEmail is required' });
    const db = await getDb();
    await db.collection(COLL).updateOne(
      { _id: new ObjectId(req.params.id) },
      { $pull: { sharedWith: brokerEmail } }
    );
    res.json({ success: true });
  } catch (err) { next(err); }
}

module.exports = { getCollections, createCollection, deleteCollection, addSchool, removeSchool, shareCollection, unshareCollection };
