'use strict';
const { ObjectId } = require('mongodb');
const getDb = require('../config/db');

async function getBrokers(req, res, next) {
  try {
    const db = await getDb();
    const brokers = await db.collection('users').find({ role: 'broker' }).sort({ createdAt: -1 }).toArray();
    res.json(brokers);
  } catch (err) { next(err); }
}

async function createBroker(req, res, next) {
  try {
    const { email, name } = req.body;
    if (!email?.trim() || !name?.trim()) return res.status(400).json({ error: 'email and name are required' });
    const db = await getDb();
    const existing = await db.collection('users').findOne({ email: email.trim() });
    if (existing) return res.status(409).json({ error: 'A user with this email already exists' });
    const doc = {
      email: email.trim(),
      name: name.trim(),
      role: 'broker',
      createdBy: req.user.email,
      createdAt: new Date(),
    };
    const result = await db.collection('users').insertOne(doc);
    res.json({ ...doc, _id: result.insertedId });
  } catch (err) { next(err); }
}

async function deleteBroker(req, res, next) {
  try {
    const db = await getDb();
    const broker = await db.collection('users').findOne({ _id: new ObjectId(req.params.id), role: 'broker' });
    if (!broker) return res.status(404).json({ error: 'Broker not found' });
    // Remove this broker from all shared leads
    await db.collection(process.env.COLLECTION_NAME).updateMany(
      { sharedWith: broker.email },
      { $pull: { sharedWith: broker.email } }
    );
    await db.collection('users').deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ success: true });
  } catch (err) { next(err); }
}

async function getBrokerLeads(req, res, next) {
  try {
    const db = await getDb();
    const broker = await db.collection('users').findOne({ _id: new ObjectId(req.params.id), role: 'broker' });
    if (!broker) return res.status(404).json({ error: 'Broker not found' });
    const leads = await db.collection(process.env.COLLECTION_NAME)
      .find({ sharedWith: broker.email })
      .sort({ leadVisitedAt: -1 })
      .toArray();
    res.json({ broker, leads });
  } catch (err) { next(err); }
}

module.exports = { getBrokers, createBroker, deleteBroker, getBrokerLeads };
