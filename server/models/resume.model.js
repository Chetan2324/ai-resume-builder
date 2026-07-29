const mongoose = require('mongoose');

const { Schema } = mongoose;

const experienceSchema = new Schema(
  {
    company: { type: String, trim: true, default: '' },
    role: { type: String, trim: true, default: '' },
    startDate: { type: String, trim: true, default: '' },
    endDate: { type: String, trim: true, default: '' },
    description: { type: String, default: '' },
  },
  { _id: false }
);

const educationSchema = new Schema(
  {
    institution: { type: String, trim: true, default: '' },
    degree: { type: String, trim: true, default: '' },
    graduationDate: { type: String, trim: true, default: '' },
    gpa: { type: String, trim: true, default: '' },
  },
  { _id: false }
);

const customSectionSchema = new Schema(
  {
    title: { type: String, trim: true, default: 'New Section' },
    content: { type: String, default: '• Add your content here...' },
  },
  { _id: false }
);

const resumeSchema = new Schema(
  {
    personalInfo: {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true },
      phone: { type: String, trim: true, default: '' },
      linkedin: { type: String, trim: true, default: '' },
      github: { type: String, trim: true, default: '' },
    },
    experience: { type: [experienceSchema], default: [] },
    education: { type: [educationSchema], default: [] },
    skills: { type: String, default: '' },
    customSections: { type: [customSectionSchema], default: [] },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Resume', resumeSchema);
