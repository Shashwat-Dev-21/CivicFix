require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const issueRoutes = require('./routes/issueRoutes');
const helmet = require('helmet');

const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
  ? process.env.CLIENT_URL
  : ['http://localhost:5173', 'http://localhost:4173'],
  credentials: true,
};

connectDB();



const app = express();
const PORT = process.env.PORT || 5001;


app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('CivicFix API is running');
});

app.use('/api/auth', authRoutes);
app.use('/api/issues', issueRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});