const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const experienceSchema = new Schema({
    company: String,
    role: String,
    startDate: String,
    endDate: String,
    description: String,
});

const educationSchema = new Schema({
    institution: String,
    degree: String,
    graduationDate: String,
    gpa: String,
});

// NEW: A schema for our dynamic, user-defined sections
const customSectionSchema = new Schema({
    title: { type: String, default: 'New Section' },
    content: { type: String, default: '• Add your content here...' },
});

const resumeSchema = new Schema({
    personalInfo: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: String,
        linkedin: String,
        github: String,
    },
    experience: [experienceSchema],
    education: [educationSchema],
    skills: String,
    customSections: [customSectionSchema], // NEW: Add the array of custom sections to our main blueprint
}, {
    timestamps: true,
});

const Resume = mongoose.model('Resume', resumeSchema);

module.exports = Resume;