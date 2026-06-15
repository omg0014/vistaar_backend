require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/status', (_req, res) => {
  res.json({ status: true, message: 'Server is running', timestamp: new Date() });
});

// Routes
app.use('/api/search',  require('./routes/search'));
app.use('/api/schools', require('./routes/schools'));
app.use('/api/region',  require('./routes/region'));
app.use('/api/masters', require('./routes/masters'));

// Catch-all error handler — must have 4 params for Express to treat it as error middleware
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ status: false, error: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
