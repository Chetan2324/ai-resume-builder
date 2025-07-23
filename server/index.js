const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully!");
});
mongoose.connection.on('error', (err) => {
  console.error("MongoDB connection error:", err);
  process.exit();
});

// --- Tell the server to use our new routes ---
const resumeRouter = require('./routes/resumes');
app.use('/resumes', resumeRouter);
// ------------------------------------------

app.get('/', (req, res) => {
  res.send('Hello from the Smart Resume Builder server!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});