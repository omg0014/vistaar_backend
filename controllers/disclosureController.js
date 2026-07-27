'use strict';

const { ObjectId } = require('mongodb');
const getDb = require('../config/db');

// Mandatory-disclosure request workflow (admin-only). A request is created when
// a school has a website but no disclosure page; it lives in its own
// `disclosure_requests` collection, keyed by schoolId, and its status stays in
// sync with the school doc: saving `_mandatoryDisclosureUrl` on the school
// resolves any pending request, and resolving/creating here reads/writes the
// same record the school page reads.
const REQUESTS = 'disclosure_requests';

function normalizeUrl(u) {
  const s = String(u || '').trim();
  if (!s) return '';
  return /^https?:\/\//i.test(s) ? s : `https://${s}`;
}

// Save (add/update) the Mandatory Disclosure link on the school. Any pending
// request for the school is marked resolved so the lead + notifications agree.
async function patchDisclosureUrl(req, res, next) {
  try {
    const { id } = req.params;
    const url = normalizeUrl(req.body.disclosureUrl);
    const db = await getDb();
    const _id = new ObjectId(id);

    await db.collection(process.env.COLLECTION_NAME)
      .updateOne({ _id }, { $set: { _mandatoryDisclosureUrl: url } });

    if (url) {
      await db.collection(REQUESTS).updateOne(
        { schoolId: id, status: 'pending' },
        { $set: { status: 'resolved', disclosureUrl: url, resolvedAt: new Date() } }
      );
    }

    res.json({ success: true, disclosureUrl: url });
  } catch (err) {
    next(err);
  }
}

// Create a pending disclosure-link request. Upsert by schoolId so repeated
// clicks don't pile up duplicates; a snapshot of the lead (name/location/site)
// is stored so the notifications panel can render without a second lookup.
async function createDisclosureRequest(req, res, next) {
  try {
    const { id } = req.params;
    const db = await getDb();
    const _id = new ObjectId(id);

    const school = await db.collection(process.env.COLLECTION_NAME).findOne(
      { _id },
      { projection: { schoolName: 1, district: 1, state: 1, website: 1 } }
    );
    if (!school) return res.status(404).json({ error: 'School not found' });

    const now = new Date();
    await db.collection(REQUESTS).updateOne(
      { schoolId: id },
      {
        $set: {
          schoolId: id,
          schoolName: school.schoolName || '',
          district: school.district || '',
          state: school.state || '',
          website: school.website || '',
          status: 'pending',
          requestedAt: now,
        },
        $unset: { resolvedAt: '', disclosureUrl: '' },
      },
      { upsert: true }
    );

    const request = await db.collection(REQUESTS).findOne({ schoolId: id });
    res.json({ success: true, request });
  } catch (err) {
    next(err);
  }
}

// All requests, newest first — powers the Notifications dropdown.
async function listDisclosureRequests(req, res, next) {
  try {
    const db = await getDb();
    const requests = await db.collection(REQUESTS)
      .find({})
      .sort({ requestedAt: -1 })
      .limit(200)
      .toArray();
    res.json({ requests });
  } catch (err) {
    next(err);
  }
}

// Mark a request resolved (the "Done" action → green). Idempotent.
async function resolveDisclosureRequest(req, res, next) {
  try {
    const { id } = req.params;
    const db = await getDb();
    await db.collection(REQUESTS).updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: 'resolved', resolvedAt: new Date() } }
    );
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  patchDisclosureUrl,
  createDisclosureRequest,
  listDisclosureRequests,
  resolveDisclosureRequest,
};
