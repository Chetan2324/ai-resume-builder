import React, { useState, useRef, useEffect } from 'react';
import { initialResumeData, blankResumeData } from './data/initialData';
import Preview from './components/Preview';
import ResumeForm from './components/ResumeForm';
import SavedResumes from './components/SavedResumes';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [resumeData, setResumeData] = useState(blankResumeData);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const previewRef = useRef(null);
  const [currentResumeId, setCurrentResumeId] = useState(null);
  const [loadId, setLoadId] = useState('');
  const [savedIds, setSavedIds] = useState([]);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => { const idsFromStorage = JSON.parse(localStorage.getItem('savedResumeIds')) || []; setSavedIds(idsFromStorage); }, []);
  const addIdToStorage = (newId) => { if (savedIds.includes(newId)) return; const updatedIds = [...savedIds, newId]; setSavedIds(updatedIds); localStorage.setItem('savedResumeIds', JSON.stringify(updatedIds)); };
  const handleDeleteId = (idToDelete) => { const updatedIds = savedIds.filter(id => id !== idToDelete); setSavedIds(updatedIds); localStorage.setItem('savedResumeIds', JSON.stringify(updatedIds)); toast.info('Removed ID from your list.'); };
  const handleChange = (section, field, value, index = null) => {setResumeData(prevData => {const newData = { ...prevData }; if (index !== null) { const newSection = [...newData[section]]; newSection[index] = { ...newSection[index], [field]: value }; newData[section] = newSection; } else if (typeof newData[section] === 'object' && newData[section] !== null) { newData[section] = { ...newData[section], [field]: value }; } else { newData[section] = value; } return newData;});};
  const handleAddExperience = () => {setResumeData(prevData => ({...prevData, experience: [...prevData.experience, { id: Date.now(), company: '', role: '', startDate: '', endDate: '', description: '' }]}));};
  const handleDeleteExperience = (index) => {setResumeData(prevData => {const newExperience = [...prevData.experience]; newExperience.splice(index, 1); return { ...prevData, experience: newExperience };});};
  const handleAddEducation = () => {setResumeData(prevData => ({...prevData, education: [...prevData.education, { id: Date.now(), institution: '', degree: '', graduationDate: '', gpa: '' }]}));};
  const handleDeleteEducation = (index) => {setResumeData(prevData => {const newEducation = [...prevData.education]; newEducation.splice(index, 1); return { ...prevData, education: newEducation };});};
  const handleAddCustomSection = () => {setResumeData(prevData => ({...prevData, customSections: [...(prevData.customSections || []), { title: 'New Section', content: '• Add your content here...' }]}));};
  const handleDeleteCustomSection = (index) => {setResumeData(prevData => {const newCustomSections = [...prevData.customSections]; newCustomSections.splice(index, 1); return { ...prevData, customSections: newCustomSections };});};
  const handlePdfExport = () => {const input = previewRef.current; html2canvas(input, { scale: 2 }).then((canvas) => {const imgData = canvas.toDataURL('image/png'); const pdf = new jsPDF('p', 'mm', 'a4'); const pdfWidth = pdf.internal.pageSize.getWidth(); const pdfHeight = (canvas.height * pdfWidth) / canvas.width; pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight); pdf.save("resume.pdf");});};
  const handleAiSuggest = (description, index) => {setIsAiLoading(true);axios.post(`${API_URL}/resumes/suggest`, { description }).then(res => {const { suggestion } = res.data;handleChange('experience', 'description', suggestion, index);}).catch(err => {console.error(err);toast.error("Sorry, an error occurred with the AI suggestion.");}).finally(() => {setIsAiLoading(false);});};
  const handleLoad = (idToLoad) => {const id = idToLoad || loadId; if (!id) return toast.warn('Please enter or select a Resume ID to load.'); axios.get(`${API_URL}/resumes/${id}`).then(res => {if (res.data) {setResumeData(res.data); setCurrentResumeId(res.data._id); setLoadId(res.data._id); toast.success('Resume loaded successfully!');} else {toast.error('No resume found with that ID.');}}).catch(err => { console.error(err); toast.error('Error loading resume.'); });};
  const handleSave = () => {if (currentResumeId) {axios.put(`${API_URL}/resumes/update/${currentResumeId}`, resumeData).then(res => toast.success('Resume updated successfully!')).catch(err => { console.error(err); toast.error('Error updating resume.'); });} else {axios.post(`${API_URL}/resumes/add`, resumeData).then(res => {const newId = res.data.id; toast.success(`Resume saved! New ID: ${newId}`); setCurrentResumeId(newId); setLoadId(newId); addIdToStorage(newId);}).catch(err => { console.error(err); toast.error('Error saving resume.'); });}};
  const handleClearForm = () => { setResumeData(blankResumeData); setCurrentResumeId(null); setLoadId(''); toast.info('Form cleared.'); };
  const handleLoadTemplate = () => { setResumeData(initialResumeData); setCurrentResumeId(null); setLoadId(''); toast.success('Template loaded!'); };

  return (
    <div className="min-h-screen bg-gray-200 font-sans py-8">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick theme="colored" />
      <div className="container mx-auto px-4">
        <header className="flex flex-wrap justify-between items-center mb-8 gap-4"><h1 className="text-3xl lg:text-4xl font-bold text-gray-800">Smart Resume Builder</h1><div className="flex flex-wrap gap-2"><button onClick={handleLoadTemplate} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg" title="Load example data">Load Template</button><button onClick={handleClearForm} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg" title="Clear all fields">Clear Form</button><button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg">{currentResumeId ? 'Update Resume' : 'Save as New'}</button><button onClick={handlePdfExport} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg">Download PDF</button></div></header>
        <SavedResumes ids={savedIds} onLoad={handleLoad} onDelete={handleDeleteId} />
        <div className="mb-6 p-4 bg-white rounded-lg shadow-md"><h3 className="text-lg font-bold mb-2 text-gray-700">Load Resume by ID</h3><div className="flex gap-2"><input type="text" value={loadId} onChange={(e) => setLoadId(e.target.value)} placeholder="Or paste an ID here..." className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"/><button onClick={() => handleLoad(null)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">Load</button></div></div>

        {/* THE ONLY CHANGE IS HERE: lg:grid-cols-2 is changed to xl:grid-cols-2 */}
        <main className="grid grid-cols-1 xl:grid-cols-2 gap-8">

          <div className="bg-white p-6 rounded-lg shadow-lg"><h2 className="text-2xl font-bold mb-6 text-gray-700">Edit Your Resume</h2><ResumeForm resumeData={resumeData} onChange={handleChange} onExperienceAdd={handleAddExperience} onExperienceDelete={handleDeleteExperience} onEducationAdd={handleAddEducation} onEducationDelete={handleDeleteEducation} onAiSuggest={handleAiSuggest} isAiLoading={isAiLoading} onCustomSectionAdd={handleAddCustomSection} onCustomSectionDelete={handleDeleteCustomSection}/></div>
          <div ref={previewRef} className="bg-white rounded-lg shadow-lg"><Preview resumeData={resumeData} /></div>
        </main>
      </div>
    </div>
  );
}

export default App;