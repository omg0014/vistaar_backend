'use strict';
require('dotenv').config({ quiet: true });
const express      = require('express');
const helmet       = require('helmet');
const cors         = require('cors');
const morgan       = require('morgan');
const rateLimit    = require('express-rate-limit');
const errorHandler = require('./middlewares/errorHandler');
const requireAuth  = require('./middlewares/requireAuth');
const getDb        = require('./config/db');

// Fail fast on missing secrets/config rather than booting a broken server that
// only errors at request time (e.g. an absent JWT_SECRET silently breaks auth).
// Tests set these in tests/setup.js.
if (process.env.NODE_ENV !== 'test') {
  const REQUIRED = ['JWT_SECRET', 'GOOGLE_CLIENT_ID', 'MONGODB_URI'];
  const missing = REQUIRED.filter(k => !process.env[k]);
  if (missing.length) {
    console.error(`Fatal: missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }
}

const app = express();
app.disable('x-powered-by');
app.use(helmet());
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? (process.env.FRONTEND_URL || '').split(',').filter(Boolean)
  : true;
app.use(cors({ origin: allowedOrigins, credentials: true }));
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}
app.use(express.json());

app.get('/health', async (req, res) => {
  try {
    await (await getDb()).command({ ping: 1 });
    res.json({ status: 'ok' });
  } catch (err) {
    res.status(503).json({ status: 'degraded' });
  }
});

const skipInTest = () => process.env.NODE_ENV === 'test';
const authLimiter   = rateLimit({ windowMs: 60_000, max: 10, standardHeaders: true, legacyHeaders: false, skip: skipInTest });
const publicLimiter = rateLimit({ windowMs: 60_000, max: 30, standardHeaders: true, legacyHeaders: false, skip: skipInTest });

app.use('/api/auth',    authLimiter, require('./routes/auth'));
app.use('/api/public',  publicLimiter, require('./routes/public'));
app.use('/api/schools', requireAuth, require('./routes/school'));
app.use('/api/admin',   requireAuth, require('./routes/admin'));
app.use('/api/broker',  requireAuth, require('./routes/broker'));

app.use(errorHandler);

if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  const server = app.listen(PORT, () => console.log(`Backend → http://localhost:${PORT}`));

  const shutdown = (signal) => {
    console.log(`${signal} received, draining connections...`);
    server.close(async () => {
      try { await getDb.close(); } catch (err) { console.error('Error closing DB:', err); }
      process.exit(0);
    });
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT',  () => shutdown('SIGINT'));
}

module.exports = app;
