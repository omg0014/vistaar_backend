'use strict';
const { MongoClient } = require('mongodb');
let client;
let dbPromise;

async function ensureIndexes(database) {
  const schools = database.collection(process.env.COLLECTION_NAME);
  await Promise.all([
    schools.createIndex({ isLead: 1, leadVisitedAt: -1 }),
    schools.createIndex({ schoolName: 1 }),
    schools.createIndex({ city: 1 }),
    schools.createIndex({ state: 1 }),
    schools.createIndex({ district: 1 }),
    schools.createIndex({ pincode: 1 }),
    database.collection('users').createIndex({ email: 1 }, { unique: true }),
    database.collection('bookmarks').createIndex({ sharedWith: 1 }),
    database.collection('bookmarks').createIndex({ lastUpdatedAt: -1 }),
    database.collection('search_collections').createIndex({ lastUpdatedAt: -1 }),
  ]);
}

// Cache the connect PROMISE (not just the resolved db). Two requests arriving
// during cold start both await the same in-flight connect instead of each
// opening — and leaking — their own MongoClient.
function getDb() {
  if (!dbPromise) {
    dbPromise = MongoClient.connect(process.env.MONGODB_URI).then(async c => {
      client = c;
      const database = c.db(process.env.DB_NAME);
      await ensureIndexes(database).catch(err => console.error('Index creation failed:', err));
      return database;
    }).catch(err => {
      dbPromise = undefined; // allow a retry on the next request instead of caching the failure
      throw err;
    });
  }
  return dbPromise;
}

getDb.close = async () => { if (client) await client.close(); };

module.exports = getDb;
