import React from 'react';

const SavedResumes = ({ ids, onLoad, onDelete }) => {
  if (ids.length === 0) {
    return null;
  }

  return (
    <section className="mb-6 rounded-lg bg-gray-50 p-4 shadow-inner" aria-label="Recently saved resumes">
      <h3 className="mb-2 text-lg font-bold text-gray-700">Recently Saved Resumes</h3>
      <ul className="list-none space-y-1 pl-0">
        {ids.map((id) => (
          <li
            key={id}
            className="flex items-center justify-between rounded-md p-2 text-sm hover:bg-gray-200"
          >
            <button
              type="button"
              className="font-mono text-xs text-blue-600 hover:underline"
              onClick={() => onLoad(id)}
              title="Click to load this resume"
              aria-label={`Load resume ${id}`}
            >
              {id}
            </button>
            <button
              type="button"
              onClick={() => onDelete(id)}
              className="ml-4 rounded-full px-2 py-1 font-bold leading-none text-red-500 hover:bg-red-100 hover:text-red-700"
              title="Remove from this list"
              aria-label={`Remove resume ${id} from local list`}
            >
              &times;
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default SavedResumes;
