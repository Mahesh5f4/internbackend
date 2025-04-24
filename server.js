// feedback-collector-backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection with success/failure log
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

const feedbackSchema = new mongoose.Schema({
  name: String,
  email: String,
  feedback: String,
  timestamp: { type: Date, default: Date.now },
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

// POST /submit-feedback
app.post('/submit-feedback', async (req, res) => {
  const { name, email, feedback } = req.body;
  const newFeedback = new Feedback({ name, email, feedback });
  await newFeedback.save();
  res.status(201).send('Feedback submitted successfully');
});

// GET /feedbacks
app.get('/feedbacks', async (req, res) => {
  const feedbacks = await Feedback.find();
  res.json(feedbacks);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
