// client/src/data/initialData.js

// This is our template with placeholder text
export const initialResumeData = {
  personalInfo: {
    name: 'Your Name',
    email: 'your.email@example.com',
    phone: '123-456-7890',
    linkedin: 'linkedin.com/in/yourprofile',
    github: 'github.com/yourusername',
  },
  experience: [
    { id: 1, company: 'Example Corp', role: 'Software Developer', startDate: '2023-01', endDate: 'Present', description: '• Developed and maintained web applications using React and Node.js.\n• Collaborated with cross-functional teams to deliver high-quality software.' },
  ],
  education: [
    { id: 1, institution: 'University of Technology', degree: 'B.S. in Computer Science', graduationDate: '2022-12', gpa: '3.8' },
  ],
  skills: 'JavaScript, React, Node.js, Tailwind CSS, MongoDB',
  customSections: [],
};

// This is our completely blank template
export const blankResumeData = {
  personalInfo: {
    name: '',
    email: '',
    phone: '',
    linkedin: '',
    github: '',
  },
  experience: [],
  education: [],
  skills: '',
  customSections: [],
};