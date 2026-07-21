'use strict';
const getDb = require('../config/db');
const { ObjectId } = require('mongodb');

const COLL = 'bookmarks';

async function getCollections(req, res, next) {
  try {
    const db = await getDb();
    // Manual drag order wins; collections never reordered (no `order` field)
    // fall back to most-recently-updated first, preserving the old behaviour.
    const cols = await db.collection(COLL).find({}).sort({ order: 1, lastUpdatedAt: -1 }).limit(500).toArray();
    res.json(cols);
  } catch (err) { next(err); }
}

const HEX24 = /^[0-9a-f]{24}$/i;

// Persist a drag-reordered collection list. The client sends the full ordered
// list of ids; each gets its array index written to `order` in one bulkWrite.
async function reorderCollections(req, res, next) {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ error: 'ids array is required' });
    if (ids.length > 500) return res.status(400).json({ error: 'too many ids' });
    if (!ids.every(id => typeof id === 'string' && HEX24.test(id))) return res.status(400).json({ error: 'ids must be valid collection ids' });
    const db = await getDb();
    const ops = ids.map((id, index) => ({
      updateOne: { filter: { _id: new ObjectId(id) }, update: { $set: { order: index } } },
    }));
    await db.collection(COLL).bulkWrite(ops);
    res.json({ success: true });
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

// Reorder the schools inside one collection. Client sends the full ordered list
// of school ids; the stored `schools` array is rebuilt in that order. Any school
// not named in the list (stale client / concurrent add) is kept at the end.
async function reorderSchools(req, res, next) {
  try {
    const { schoolIds } = req.body;
    if (!Array.isArray(schoolIds) || schoolIds.length === 0) return res.status(400).json({ error: 'schoolIds array is required' });
    if (schoolIds.length > 5000) return res.status(400).json({ error: 'too many schoolIds' });
    if (!schoolIds.every(id => typeof id === 'string')) return res.status(400).json({ error: 'schoolIds must be strings' });
    const db = await getDb();
    const col = await db.collection(COLL).findOne({ _id: new ObjectId(req.params.id) });
    if (!col) return res.status(404).json({ error: 'Collection not found' });
    const byId = new Map((col.schools || []).map(s => [String(s._id), s]));
    const ordered = schoolIds.map(id => byId.get(String(id))).filter(Boolean);
    const seen = new Set(schoolIds.map(String));
    const remaining = (col.schools || []).filter(s => !seen.has(String(s._id)));
    await db.collection(COLL).updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { schools: [...ordered, ...remaining] } }
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

module.exports = { getCollections, reorderCollections, createCollection, deleteCollection, addSchool, removeSchool, reorderSchools, shareCollection, unshareCollection };
