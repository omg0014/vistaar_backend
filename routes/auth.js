'use strict';
const { Router }       = require('express');
const { OAuth2Client } = require('google-auth-library');
const jwt              = require('jsonwebtoken');
const getDb            = require('../config/db');

const router  = Router();
const client  = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const ALLOWED = (process.env.ALLOWED_EMAILS || '').split(',').map(e => e.trim()).filter(Boolean);

router.post('/google', async (req, res, next) => {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ error: 'credential is required' });

    const ticket = await client.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID });
    const { email, name, picture } = ticket.getPayload();

    // Check users collection first (brokers + DB-registered admins)
    const db = await getDb();
    const dbUser = await db.collection('users').findOne({ email });
    let role = dbUser?.role || null;

    // Fallback: ALLOWED_EMAILS treated as admin (backward compat for existing team)
    if (!role && ALLOWED.includes(email)) role = 'admin';

    if (!role) {
      return res.status(403).json({ error: 'Access denied. Your account is not authorised for Vistaar.' });
    }

    const token = jwt.sign({ email, name, picture, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { email, name, picture, role } });
  } catch (err) { next(err); }
});

module.exports = router;
