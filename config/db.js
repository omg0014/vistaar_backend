'use strict';
const { MongoClient } = require('mongodb');

let db;

async function getDb() {
  if (db) return db;
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  db = client.db(process.env.DB_NAME);
  return db;
}

module.exports = getDb;
