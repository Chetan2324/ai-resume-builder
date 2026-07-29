const express = require('express');
const mongoose = require('mongoose');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const Resume = require('../models/resume.model');

const router = express.Router();
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

const aiClient = GOOGLE_API_KEY ? new GoogleGenerativeAI(GOOGLE_API_KEY) : null;

const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 120;
const requestWindowByIp = new Map();

const getTrimmedString = (value) => (typeof value === 'string' ? value.trim() : '');

const createRateLimiter = () => (req, res, next) => {
  const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();

  const previousWindow = requestWindowByIp.get(ipAddress);

  if (!previousWindow || now - previousWindow.windowStart > WINDOW_MS) {
    requestWindowByIp.set(ipAddress, { count: 1, windowStart: now });
    return next();
  }

  if (previousWindow.count >= MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  previousWindow.count += 1;
  requestWindowByIp.set(ipAddress, previousWindow);
  return next();
};

const normalizePersonalInfo = (personalInfo = {}) => ({
  name: getTrimmedString(personalInfo.name),
  email: getTrimmedString(personalInfo.email),
  phone: getTrimmedString(personalInfo.phone),
  linkedin: getTrimmedString(personalInfo.linkedin),
  github: getTrimmedString(personalInfo.github),
});

const normalizeResumePayload = (payload = {}) => ({
  personalInfo: normalizePersonalInfo(payload.personalInfo),
  experience: Array.isArray(payload.experience)
    ? payload.experience.map((item = {}) => ({
        company: getTrimmedString(item.company),
        role: getTrimmedString(item.role),
        startDate: getTrimmedString(item.startDate),
        endDate: getTrimmedString(item.endDate),
        description: typeof item.description === 'string' ? item.description : '',
      }))
    : [],
  education: Array.isArray(payload.education)
    ? payload.education.map((item = {}) => ({
        institution: getTrimmedString(item.institution),
        degree: getTrimmedString(item.degree),
        graduationDate: getTrimmedString(item.graduationDate),
        gpa: getTrimmedString(item.gpa),
      }))
    : [],
  skills: typeof payload.skills === 'string' ? payload.skills : '',
  customSections: Array.isArray(payload.customSections)
    ? payload.customSections.map((section = {}) => ({
        title: getTrimmedString(section.title) || 'New Section',
        content:
          typeof section.content === 'string' ? section.content : '• Add your content here...',
      }))
    : [],
});

const validateResumePayload = (payload = {}) => {
  const { personalInfo } = payload;

  if (!personalInfo || typeof personalInfo !== 'object') {
    return 'personalInfo is required.';
  }

  if (!getTrimmedString(personalInfo.name)) {
    return 'personalInfo.name is required.';
  }

  if (!getTrimmedString(personalInfo.email)) {
    return 'personalInfo.email is required.';
  }

  return null;
};

router.use(createRateLimiter());

router.post('/add', async (req, res) => {
  const validationError = validateResumePayload(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const sanitizedPayload = normalizeResumePayload(req.body);

  try {
    const savedResume = await Resume.create(sanitizedPayload);

    return res.json({ message: 'Resume added!', id: savedResume._id });
  } catch (error) {
    console.error('Error while creating resume:', error);
    return res.status(400).json({ error: 'Failed to save resume.' });
  }
});

router.post('/suggest', async (req, res) => {
  const description = getTrimmedString(req.body?.description);

  if (!description) {
    return res.status(400).json({ error: 'Description is required.' });
  }

  if (!aiClient) {
    return res.status(503).json({ error: 'AI suggestion service is not configured.' });
  }

  try {
    const model = aiClient.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `You are an expert resume writing assistant. Rewrite the following job description points to be more impactful, professional, and action-oriented. Use strong action verbs and focus on achievements and results. Return only the improved text. Here is the text to improve: "${description}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const suggestion = response.text();

    return res.json({ suggestion });
  } catch (error) {
    console.error('Google Gemini API error:', error);
    return res.status(500).json({ error: 'Failed to get suggestion from AI.' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: 'Invalid resume ID.' });
  }

  try {
    const resume = await Resume.findById(new mongoose.Types.ObjectId(id));

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found.' });
    }

    return res.json(resume);
  } catch (error) {
    console.error('Error while loading resume:', error);
    return res.status(400).json({ error: 'Failed to load resume.' });
  }
});

router.put('/update/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: 'Invalid resume ID.' });
  }

  const validationError = validateResumePayload(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const sanitizedPayload = normalizeResumePayload(req.body);

  try {
    const updatedResume = await Resume.findByIdAndUpdate(
      new mongoose.Types.ObjectId(id),
      { $set: sanitizedPayload },
      {
        runValidators: true,
        new: true,
      }
    );

    if (!updatedResume) {
      return res.status(404).json({ error: 'Resume not found.' });
    }

    return res.json({ message: 'Resume updated successfully!' });
  } catch (error) {
    console.error('Error while updating resume:', error);
    return res.status(400).json({ error: 'Failed to update resume.' });
  }
});

module.exports = router;
