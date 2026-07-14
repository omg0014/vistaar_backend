'use strict';
const getDb = require('../config/db');
const { ObjectId } = require('mongodb');

const COLL = 'search_collections';

async function getCollections(req, res, next) {
  try {
    const db = await getDb();
    const cols = await db.collection(COLL).find({}).sort({ lastUpdatedAt: -1 }).toArray();
    res.json(cols);
  } catch (err) { next(err); }
}

async function createCollection(req, res, next) {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'name required' });
    const db = await getDb();
    const result = await db.collection(COLL).insertOne({ name, searches: [], createdAt: new Date(), lastUpdatedAt: new Date() });
    res.json({ _id: result.insertedId, name, searches: [] });
  } catch (err) { next(err); }
}

async function deleteCollection(req, res, next) {
  try {
    const db = await getDb();
    await db.collection(COLL).deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ success: true });
  } catch (err) { next(err); }
}

async function addSearch(req, res, next) {
  try {
    const { type, q, filters } = req.body;
    if (!type || q == null) return res.status(400).json({ error: 'type and q are required' });
    const db = await getDb();
    const search = { _id: new ObjectId().toHexString(), type, q, filters: filters || {}, savedAt: new Date() };
    await db.collection(COLL).updateOne(
      { _id: new ObjectId(req.params.id) },
      { $push: { searches: search }, $set: { lastUpdatedAt: new Date() } }
    );
    res.json({ success: true, search });
  } catch (err) { next(err); }
}

async function removeSearch(req, res, next) {
  try {
    const db = await getDb();
    await db.collection(COLL).updateOne(
      { _id: new ObjectId(req.params.id) },
      { $pull: { searches: { _id: req.params.searchId } } }
    );
    res.json({ success: true });
  } catch (err) { next(err); }
}

module.exports = { getCollections, createCollection, deleteCollection, addSearch, removeSearch };
