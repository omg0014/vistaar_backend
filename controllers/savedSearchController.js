'use strict';
const getDb = require('../config/db');
const { ObjectId } = require('mongodb');

const COLL = 'saved_searches';

async function list(req, res, next) {
  try {
    const db = await getDb();
    const searches = await db.collection(COLL).find({}).sort({ createdAt: -1 }).toArray();
    res.json(searches);
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const { name, type, q, filters } = req.body;
    if (!name || !type || q == null) return res.status(400).json({ error: 'name, type and q are required' });
    const db = await getDb();
    const doc = { name, type, q, filters: filters || {}, createdAt: new Date() };
    const result = await db.collection(COLL).insertOne(doc);
    res.json({ ...doc, _id: result.insertedId });
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const db = await getDb();
    await db.collection(COLL).deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ success: true });
  } catch (err) { next(err); }
}

module.exports = { list, create, remove };
