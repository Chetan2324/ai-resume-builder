const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();

const resumeRouter = require('./routes/resumes');

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Not allowed by CORS'));
    },
  })
);
app.use(express.json({ limit: '1mb' }));

app.get('/', (req, res) => {
  res.send('Hello from the Smart Resume Builder server!');
});

app.use('/resumes', resumeRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  return res.status(500).json({ error: 'Internal server error' });
});

const startServer = async () => {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI is not configured.');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB database connection established successfully!');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

startServer();
