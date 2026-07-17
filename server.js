'use strict';
require('dotenv').config();
const express      = require('express');
const cors         = require('cors');
const errorHandler = require('./middlewares/errorHandler');
const requireAuth  = require('./middlewares/requireAuth');

const app = express();
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? (process.env.FRONTEND_URL || '').split(',').filter(Boolean)
  : true;
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth',    require('./routes/auth'));
app.use('/api/schools', requireAuth, require('./routes/school'));
app.use('/api/admin',   requireAuth, require('./routes/admin'));
app.use('/api/broker',  requireAuth, require('./routes/broker'));

app.use(errorHandler);

if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`Backend → http://localhost:${PORT}`));
}

module.exports = app;
