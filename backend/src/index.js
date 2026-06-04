require('dotenv').config({ path: '.env' });
const express   = require('express');
const cors      = require('cors');
const connectDB = require('./config/db');
const jobRoutes = require('./routes/jobs');
const tnpRoutes = require('./routes/tnp');   // ← NEW

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/jobs', jobRoutes);
app.use('/api/tnp',  tnpRoutes);             // ← NEW

app.get('/', (_req, res) => res.json({ status: 'AI Job Tracker API running' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
