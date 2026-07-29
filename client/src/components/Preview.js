import React from 'react';

const sectionTitleClass =
  'mb-3 border-b-2 border-gray-300 pb-1 text-xl font-bold text-gray-800';

const Preview = ({ resumeData }) => {
  const { personalInfo, experience, education, skills, customSections } = resumeData;

  return (
    <div className="p-8">
      <header className="mb-8 border-b-2 pb-4 text-center">
        <h1 className="mb-1 text-4xl font-bold">{personalInfo.name || 'Your Name'}</h1>
        <p className="text-sm text-gray-600">
          {personalInfo.email || 'you@example.com'}
          {personalInfo.phone ? ` | ${personalInfo.phone}` : ''}
        </p>
        <p className="text-sm text-gray-500">
          {personalInfo.linkedin || 'linkedin.com/in/yourprofile'}
          {personalInfo.github ? ` | ${personalInfo.github}` : ''}
        </p>
      </header>

      <section className="mb-6">
        <h2 className={sectionTitleClass}>EXPERIENCE</h2>
        {experience.length === 0 ? (
          <p className="text-sm text-gray-500">Add experience details to populate this section.</p>
        ) : (
          experience.map((exp, index) => (
            <article key={index} className="mb-4">
              <h3 className="text-lg font-bold">{exp.role}</h3>
              <p className="text-sm italic text-gray-700">
                {exp.company} | {exp.startDate} - {exp.endDate}
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-gray-600">{exp.description}</p>
            </article>
          ))
        )}
      </section>

      <section className="mb-6">
        <h2 className={sectionTitleClass}>EDUCATION</h2>
        {education.length === 0 ? (
          <p className="text-sm text-gray-500">Add education details to populate this section.</p>
        ) : (
          education.map((edu, index) => (
            <article key={index} className="mb-4">
              <h3 className="text-lg font-bold">{edu.degree}</h3>
              <p className="text-sm italic text-gray-700">
                {edu.institution} | Graduated: {edu.graduationDate}
              </p>
              {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
            </article>
          ))
        )}
      </section>

      {customSections.map((section, index) => (
        <section key={index} className="mb-6">
          <h2 className={`${sectionTitleClass} uppercase`}>{section.title}</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm text-gray-600">{section.content}</p>
        </section>
      ))}

      <section>
        <h2 className={sectionTitleClass}>SKILLS</h2>
        <p className="text-sm text-gray-600">
          {skills || 'Add your technical and professional skills to display them here.'}
        </p>
      </section>
    </div>
  );
};

export default Preview;
