const express = require('express');
const cors = require('cors');
const analyzeRoutes = require('./routes/analyzeRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/analyze', analyzeRoutes);

module.exports = app;
