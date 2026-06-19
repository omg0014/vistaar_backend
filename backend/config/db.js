'use strict';
const { MongoClient } = require('mongodb');

let _db = null;

async function getDb() {
  if (!_db) {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    _db = client.db('udise_db');
    console.log('MongoDB connected');
  }
  return _db;
}

module.exports = getDb;
