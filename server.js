'use strict';
require('dotenv').config();
const express = require('express');
const schoolRouter = require('./routes/school');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

app.use('/api/schools', schoolRouter);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend → http://localhost:${PORT}`));