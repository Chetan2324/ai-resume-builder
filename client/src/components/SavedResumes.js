import React from 'react';

const SavedResumes = ({ ids, onLoad, onDelete }) => {
  if (ids.length === 0) {
    return null; // Don't show anything if there are no saved IDs
  }

  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow-inner">
      <h3 className="text-lg font-bold mb-2 text-gray-700">Recently Saved Resumes</h3>
      <ul className="list-none pl-0">
        {ids.map(id => (
          <li key={id} className="mb-1 text-sm flex justify-between items-center p-2 rounded-md hover:bg-gray-200">
            <span 
              className="text-blue-600 hover:underline cursor-pointer font-mono text-xs"
              onClick={() => onLoad(id)}
              title="Click to load this resume"
            >
              {id}
            </span>
            <button 
              onClick={() => onDelete(id)}
              className="text-red-500 hover:text-red-700 font-bold ml-4 px-2 py-1 leading-none rounded-full hover:bg-red-100"
              title="Remove from this list"
            >
              &times;
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SavedResumes;