import React from 'react';

const inputStyles =
  'w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500';

const ResumeForm = ({
  resumeData,
  onChange,
  onExperienceAdd,
  onExperienceDelete,
  onEducationAdd,
  onEducationDelete,
  onAiSuggest,
  isAiLoading,
  onCustomSectionAdd,
  onCustomSectionDelete,
}) => {
  const { personalInfo, experience, education, skills, customSections } = resumeData;

  return (
    <div>
      <section className="mb-8">
        <h3 className="mb-4 border-b pb-2 text-lg font-semibold text-gray-800">Personal Information</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label>
            <span className="sr-only">Full Name</span>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={personalInfo.name}
              onChange={(event) => onChange('personalInfo', 'name', event.target.value)}
              className={inputStyles}
              autoComplete="name"
            />
          </label>
          <label>
            <span className="sr-only">Email</span>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={personalInfo.email}
              onChange={(event) => onChange('personalInfo', 'email', event.target.value)}
              className={inputStyles}
              autoComplete="email"
            />
          </label>
          <label>
            <span className="sr-only">Phone Number</span>
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={personalInfo.phone}
              onChange={(event) => onChange('personalInfo', 'phone', event.target.value)}
              className={inputStyles}
              autoComplete="tel"
            />
          </label>
          <label>
            <span className="sr-only">LinkedIn Profile URL</span>
            <input
              type="text"
              name="linkedin"
              placeholder="LinkedIn Profile URL"
              value={personalInfo.linkedin}
              onChange={(event) => onChange('personalInfo', 'linkedin', event.target.value)}
              className={inputStyles}
              autoComplete="url"
            />
          </label>
          <label className="md:col-span-2">
            <span className="sr-only">GitHub Profile URL</span>
            <input
              type="text"
              name="github"
              placeholder="GitHub Profile URL"
              value={personalInfo.github}
              onChange={(event) => onChange('personalInfo', 'github', event.target.value)}
              className={inputStyles}
              autoComplete="url"
            />
          </label>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="mb-4 border-b pb-2 text-lg font-semibold text-gray-800">Experience</h3>
        {experience.length === 0 && (
          <p className="mb-4 text-sm text-gray-500">No experience entries yet. Add your first role.</p>
        )}

        {experience.map((exp, index) => (
          <div key={index} className="relative mb-4 rounded-lg border border-gray-200 p-4">
            <button
              type="button"
              onClick={() => onExperienceDelete(index)}
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 font-bold text-white hover:bg-red-700"
              aria-label={`Delete experience ${index + 1}`}
            >
              &times;
            </button>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                type="text"
                placeholder="Role / Title"
                value={exp.role}
                onChange={(event) => onChange('experience', 'role', event.target.value, index)}
                className={inputStyles}
              />
              <input
                type="text"
                placeholder="Company"
                value={exp.company}
                onChange={(event) => onChange('experience', 'company', event.target.value, index)}
                className={inputStyles}
              />
              <input
                type="text"
                placeholder="Start Date (e.g., 2023-01)"
                value={exp.startDate}
                onChange={(event) => onChange('experience', 'startDate', event.target.value, index)}
                className={inputStyles}
              />
              <input
                type="text"
                placeholder="End Date (e.g., Present)"
                value={exp.endDate}
                onChange={(event) => onChange('experience', 'endDate', event.target.value, index)}
                className={inputStyles}
              />
              <div className="relative md:col-span-2">
                <textarea
                  placeholder="Job Description"
                  value={exp.description}
                  onChange={(event) => onChange('experience', 'description', event.target.value, index)}
                  className={`${inputStyles} pr-24`}
                  rows="5"
                />
                <button
                  type="button"
                  onClick={() => onAiSuggest(exp.description, index)}
                  disabled={isAiLoading}
                  className="absolute bottom-2 right-2 rounded-md bg-gradient-to-r from-purple-500 to-indigo-600 px-2 py-1 text-xs font-bold text-white hover:from-purple-600 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label={`Generate AI suggestion for experience ${index + 1}`}
                >
                  {isAiLoading ? 'Thinking...' : '✨ AI Suggest'}
                </button>
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={onExperienceAdd}
          className="mt-2 w-full rounded-md bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
        >
          Add Experience
        </button>
      </section>

      <section className="mb-8">
        <h3 className="mb-4 border-b pb-2 text-lg font-semibold text-gray-800">Education</h3>
        {education.length === 0 && (
          <p className="mb-4 text-sm text-gray-500">No education entries yet. Add your first education item.</p>
        )}

        {education.map((edu, index) => (
          <div key={index} className="relative mb-4 rounded-lg border border-gray-200 p-4">
            <button
              type="button"
              onClick={() => onEducationDelete(index)}
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 font-bold text-white hover:bg-red-700"
              aria-label={`Delete education ${index + 1}`}
            >
              &times;
            </button>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                type="text"
                placeholder="Institution"
                value={edu.institution}
                onChange={(event) => onChange('education', 'institution', event.target.value, index)}
                className={`${inputStyles} md:col-span-2`}
              />
              <input
                type="text"
                placeholder="Degree (e.g., B.S. in Computer Science)"
                value={edu.degree}
                onChange={(event) => onChange('education', 'degree', event.target.value, index)}
                className={inputStyles}
              />
              <input
                type="text"
                placeholder="Graduation Date (e.g., 2022-12)"
                value={edu.graduationDate}
                onChange={(event) => onChange('education', 'graduationDate', event.target.value, index)}
                className={inputStyles}
              />
              <input
                type="text"
                placeholder="GPA (optional)"
                value={edu.gpa}
                onChange={(event) => onChange('education', 'gpa', event.target.value, index)}
                className={inputStyles}
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={onEducationAdd}
          className="mt-2 w-full rounded-md bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-600"
        >
          Add Education
        </button>
      </section>

      <section>
        <h3 className="mb-4 border-b pb-2 text-lg font-semibold text-gray-800">Skills</h3>
        <textarea
          placeholder="Your skills, separated by commas"
          value={skills}
          onChange={(event) => onChange('skills', null, event.target.value)}
          className={inputStyles}
          rows="4"
        />
      </section>

      <section className="mt-8">
        <h3 className="mb-4 border-b pb-2 text-lg font-semibold text-gray-800">Custom Sections</h3>

        {customSections.length === 0 && (
          <p className="mb-4 text-sm text-gray-500">No custom sections yet. Add one to include extra content.</p>
        )}

        {customSections.map((section, index) => (
          <div key={index} className="relative mb-4 rounded-lg border border-gray-200 p-4">
            <button
              type="button"
              onClick={() => onCustomSectionDelete(index)}
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 font-bold text-white hover:bg-red-700"
              aria-label={`Delete custom section ${index + 1}`}
            >
              &times;
            </button>

            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                placeholder="Section Title (e.g., Projects)"
                value={section.title}
                onChange={(event) => onChange('customSections', 'title', event.target.value, index)}
                className={`${inputStyles} font-bold`}
              />
              <textarea
                placeholder="Section Content"
                value={section.content}
                onChange={(event) => onChange('customSections', 'content', event.target.value, index)}
                className={inputStyles}
                rows="5"
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={onCustomSectionAdd}
          className="mt-2 w-full rounded-md bg-gray-600 px-4 py-2 font-bold text-white hover:bg-gray-700"
        >
          Add Custom Section
        </button>
      </section>
    </div>
  );
};

export default ResumeForm;
