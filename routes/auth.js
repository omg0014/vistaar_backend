'use strict';
const { Router }       = require('express');
const { OAuth2Client } = require('google-auth-library');
const jwt              = require('jsonwebtoken');

const router  = Router();
const client  = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const ALLOWED = (process.env.ALLOWED_EMAILS || '').split(',').map(e => e.trim()).filter(Boolean);

router.post('/google', async (req, res, next) => {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ error: 'credential is required' });

    const ticket = await client.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID });
    const { email, name, picture } = ticket.getPayload();

    if (!ALLOWED.includes(email)) {
      return res.status(403).json({ error: 'Access denied. Your account is not authorised for Vistaar.' });
    }
    const token = jwt.sign({ email, name, picture }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { email, name, picture } });
  } catch (err) { next(err); }
});

module.exports = router;
