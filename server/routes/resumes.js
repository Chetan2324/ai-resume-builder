const router = require('express').Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
let Resume = require('../models/resume.model');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// This route should come before the dynamic '/:id' route
router.route('/add').post((req, res) => {
    const { personalInfo, experience, education, skills } = req.body;
    const newResume = new Resume({ personalInfo, experience, education, skills });
    newResume.save()
        .then(savedResume => res.json({ message: 'Resume added!', id: savedResume._id }))
        .catch(err => res.status(400).json('Error: ' + err));
});

// This route should also come before the dynamic '/:id' route
router.route('/suggest').post(async (req, res) => {
    const { description } = req.body;
    if (!description) { return res.status(400).json('Error: Description is required.'); }
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `You are an expert resume writing assistant. Rewrite the following job description points to be more impactful, professional, and action-oriented. Use strong action verbs and focus on achievements and results. Return only the improved text. Here is the text to improve: "${description}"`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const suggestion = response.text();
        res.json({ suggestion });
    } catch (error) {
        console.error("Google Gemini API error:", error);
        res.status(500).json('Error: Failed to get suggestion from AI.');
    }
});

// NEW: Route to GET a specific resume by its ID
router.route('/:id').get((req, res) => {
    Resume.findById(req.params.id)
        .then(resume => res.json(resume))
        .catch(err => res.status(400).json('Error: ' + err));
});

// NEW: Route to UPDATE an existing resume by its ID
router.route('/update/:id').put((req, res) => {
    Resume.findByIdAndUpdate(req.params.id, req.body)
        .then(() => res.json('Resume updated successfully!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;