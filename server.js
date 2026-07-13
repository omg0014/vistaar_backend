'use strict';
require('dotenv').config();
const express      = require('express');
const cors         = require('cors');
const errorHandler = require('./middlewares/errorHandler');
const requireAuth  = require('./middlewares/requireAuth');

const app = express();
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
  process.env.ALLOWED_ORIGINS,
].filter(Boolean);

const corsOptions = { origin: ALLOWED_ORIGINS, credentials: true };
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/auth',    require('./routes/auth'));
app.use('/api/schools', requireAuth, require('./routes/school'));

app.use(errorHandler);

if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`Backend → http://localhost:${PORT}`));
}

module.exports = app;
