import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Preview from './components/Preview';
import ResumeForm from './components/ResumeForm';
import SavedResumes from './components/SavedResumes';
import { blankResumeData, initialResumeData } from './data/initialData';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [resumeData, setResumeData] = useState(blankResumeData);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [currentResumeId, setCurrentResumeId] = useState(null);
  const [loadId, setLoadId] = useState('');
  const [savedIds, setSavedIds] = useState([]);
  const previewRef = useRef(null);

  useEffect(() => {
    const idsFromStorage = JSON.parse(localStorage.getItem('savedResumeIds')) || [];
    setSavedIds(idsFromStorage);
  }, []);

  const addIdToStorage = (newId) => {
    if (savedIds.includes(newId)) {
      return;
    }

    const updatedIds = [...savedIds, newId];
    setSavedIds(updatedIds);
    localStorage.setItem('savedResumeIds', JSON.stringify(updatedIds));
  };

  const handleDeleteId = (idToDelete) => {
    const updatedIds = savedIds.filter((id) => id !== idToDelete);
    setSavedIds(updatedIds);
    localStorage.setItem('savedResumeIds', JSON.stringify(updatedIds));
    toast.info('Removed ID from your list.');
  };

  const handleChange = (section, field, value, index = null) => {
    setResumeData((previousData) => {
      const nextData = { ...previousData };

      if (index !== null) {
        const clonedSection = [...nextData[section]];
        clonedSection[index] = { ...clonedSection[index], [field]: value };
        nextData[section] = clonedSection;
      } else if (typeof nextData[section] === 'object' && nextData[section] !== null) {
        nextData[section] = { ...nextData[section], [field]: value };
      } else {
        nextData[section] = value;
      }

      return nextData;
    });
  };

  const handleAddExperience = () => {
    setResumeData((previousData) => ({
      ...previousData,
      experience: [
        ...previousData.experience,
        { id: Date.now(), company: '', role: '', startDate: '', endDate: '', description: '' },
      ],
    }));
  };

  const handleDeleteExperience = (index) => {
    setResumeData((previousData) => {
      const nextExperience = [...previousData.experience];
      nextExperience.splice(index, 1);

      return { ...previousData, experience: nextExperience };
    });
  };

  const handleAddEducation = () => {
    setResumeData((previousData) => ({
      ...previousData,
      education: [
        ...previousData.education,
        { id: Date.now(), institution: '', degree: '', graduationDate: '', gpa: '' },
      ],
    }));
  };

  const handleDeleteEducation = (index) => {
    setResumeData((previousData) => {
      const nextEducation = [...previousData.education];
      nextEducation.splice(index, 1);

      return { ...previousData, education: nextEducation };
    });
  };

  const handleAddCustomSection = () => {
    setResumeData((previousData) => ({
      ...previousData,
      customSections: [
        ...(previousData.customSections || []),
        { title: 'New Section', content: '• Add your content here...' },
      ],
    }));
  };

  const handleDeleteCustomSection = (index) => {
    setResumeData((previousData) => {
      const nextCustomSections = [...previousData.customSections];
      nextCustomSections.splice(index, 1);

      return { ...previousData, customSections: nextCustomSections };
    });
  };

  const handlePdfExport = () => {
    const previewNode = previewRef.current;

    html2canvas(previewNode, { scale: 2 }).then((canvas) => {
      const imageData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imageData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('resume.pdf');
    });
  };

  const handleAiSuggest = (description, index) => {
    setIsAiLoading(true);

    axios
      .post(`${API_URL}/resumes/suggest`, { description })
      .then((response) => {
        const { suggestion } = response.data;
        handleChange('experience', 'description', suggestion, index);
      })
      .catch((error) => {
        console.error(error);
        toast.error('Sorry, an error occurred with the AI suggestion.');
      })
      .finally(() => {
        setIsAiLoading(false);
      });
  };

  const handleLoad = (idToLoad) => {
    const id = idToLoad || loadId;

    if (!id) {
      toast.warn('Please enter or select a Resume ID to load.');
      return;
    }

    axios
      .get(`${API_URL}/resumes/${id}`)
      .then((response) => {
        if (response.data) {
          setResumeData(response.data);
          setCurrentResumeId(response.data._id);
          setLoadId(response.data._id);
          toast.success('Resume loaded successfully!');
          return;
        }

        toast.error('No resume found with that ID.');
      })
      .catch((error) => {
        console.error(error);
        toast.error('Error loading resume.');
      });
  };

  const handleSave = () => {
    if (currentResumeId) {
      axios
        .put(`${API_URL}/resumes/update/${currentResumeId}`, resumeData)
        .then(() => toast.success('Resume updated successfully!'))
        .catch((error) => {
          console.error(error);
          toast.error('Error updating resume.');
        });

      return;
    }

    axios
      .post(`${API_URL}/resumes/add`, resumeData)
      .then((response) => {
        const newId = response.data.id;
        toast.success(`Resume saved! New ID: ${newId}`);
        setCurrentResumeId(newId);
        setLoadId(newId);
        addIdToStorage(newId);
      })
      .catch((error) => {
        console.error(error);
        toast.error('Error saving resume.');
      });
  };

  const handleClearForm = () => {
    setResumeData(blankResumeData);
    setCurrentResumeId(null);
    setLoadId('');
    toast.info('Form cleared.');
  };

  const handleLoadTemplate = () => {
    setResumeData(initialResumeData);
    setCurrentResumeId(null);
    setLoadId('');
    toast.success('Template loaded!');
  };

  return (
    <div className="min-h-screen bg-gray-200 py-8 font-sans">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        theme="colored"
      />

      <div className="container mx-auto px-4">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-gray-800 lg:text-4xl">Smart Resume Builder</h1>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleLoadTemplate}
              className="rounded-lg bg-gray-500 px-4 py-2 font-bold text-white shadow-lg hover:bg-gray-600"
              title="Load example data"
            >
              Load Template
            </button>
            <button
              type="button"
              onClick={handleClearForm}
              className="rounded-lg bg-red-500 px-4 py-2 font-bold text-white shadow-lg hover:bg-red-600"
              title="Clear all fields"
            >
              Clear Form
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="rounded-lg bg-purple-600 px-4 py-2 font-bold text-white shadow-lg hover:bg-purple-700"
            >
              {currentResumeId ? 'Update Resume' : 'Save as New'}
            </button>
            <button
              type="button"
              onClick={handlePdfExport}
              className="rounded-lg bg-green-600 px-4 py-2 font-bold text-white shadow-lg hover:bg-green-700"
            >
              Download PDF
            </button>
          </div>
        </header>

        <SavedResumes ids={savedIds} onLoad={handleLoad} onDelete={handleDeleteId} />

        <section className="mb-6 rounded-lg bg-white p-4 shadow-md">
          <h3 className="mb-2 text-lg font-bold text-gray-700">Load Resume by ID</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={loadId}
              onChange={(event) => setLoadId(event.target.value)}
              placeholder="Or paste an ID here..."
              className="flex-grow rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Resume ID"
            />
            <button
              type="button"
              onClick={() => handleLoad(null)}
              className="rounded-md bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700"
            >
              Load
            </button>
          </div>
        </section>

        <main className="grid grid-cols-1 gap-8 xl:grid-cols-2">
          <section className="rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-6 text-2xl font-bold text-gray-700">Edit Your Resume</h2>
            <ResumeForm
              resumeData={resumeData}
              onChange={handleChange}
              onExperienceAdd={handleAddExperience}
              onExperienceDelete={handleDeleteExperience}
              onEducationAdd={handleAddEducation}
              onEducationDelete={handleDeleteEducation}
              onAiSuggest={handleAiSuggest}
              isAiLoading={isAiLoading}
              onCustomSectionAdd={handleAddCustomSection}
              onCustomSectionDelete={handleDeleteCustomSection}
            />
          </section>

          <section ref={previewRef} className="rounded-lg bg-white shadow-lg">
            <Preview resumeData={resumeData} />
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
