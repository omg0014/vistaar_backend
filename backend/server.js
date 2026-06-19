require('dotenv').config();
const express      = require('express');
const cors         = require('cors');
const errorHandler = require('./middlewares/errorHandler');

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim())
  : ['http://localhost:5173', 'http://localhost:4173'];

const app = express();
app.use(cors({ origin: ALLOWED_ORIGINS }));
app.use(express.json());

app.get('/api/status', (_req, res) => res.json({ status: true, message: 'Vistaar backend running' }));
app.use('/api/search', require('./routes/search'));

app.use(errorHandler);

if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`Vistaar backend → http://localhost:${PORT}`));
}

module.exports = app;
