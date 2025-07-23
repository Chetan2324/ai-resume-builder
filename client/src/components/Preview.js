import React from 'react';

const Preview = ({ resumeData }) => {
  const { personalInfo, experience, education, skills, customSections } = resumeData;

  return (
    <div className="p-8">
      <div className="text-center mb-8 border-b-2 pb-4"><h1 className="text-4xl font-bold mb-1">{personalInfo.name}</h1><p className="text-sm text-gray-600">{personalInfo.email} | {personalInfo.phone}</p><p className="text-sm text-gray-500">{personalInfo.linkedin} | {personalInfo.github}</p></div>
      <div className="mb-6"><h2 className="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-3 text-gray-800">EXPERIENCE</h2>{experience.map((exp, index) => (<div key={index} className="mb-4"><h3 className="font-bold text-lg">{exp.role}</h3><p className="italic text-sm text-gray-700">{exp.company} | {exp.startDate} - {exp.endDate}</p><p className="whitespace-pre-wrap text-sm mt-2 text-gray-600">{exp.description}</p></div>))}</div>
      <div className="mb-6"><h2 className="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-3 text-gray-800">EDUCATION</h2>{education.map((edu, index) => (<div key={index} className="mb-4"><h3 className="font-bold text-lg">{edu.degree}</h3><p className="italic text-sm text-gray-700">{edu.institution} | Graduated: {edu.graduationDate}</p>{edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}</div>))}</div>

      {/* NEW: Render custom sections */}
      {customSections && customSections.map((section, index) => (
        <div key={index} className="mb-6">
            <h2 className="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-3 text-gray-800 uppercase">{section.title}</h2>
            <p className="whitespace-pre-wrap text-sm mt-2 text-gray-600">{section.content}</p>
        </div>
      ))}

      <div><h2 className="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-3 text-gray-800">SKILLS</h2><p className="text-sm text-gray-600">{skills}</p></div>
    </div>
  );
};

export default Preview;