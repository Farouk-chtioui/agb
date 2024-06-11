// Pagination.js
import React from 'react';

const Pagination = ({ currentPage, setCurrentPage }) => {
  return (
    <div className="flex justify-between items-center mt-8">
      <button 
        className="bg-gray-300 text-gray-700 px-4 py-2 rounded shadow hover:bg-gray-400 transition"
        onClick={() => setCurrentPage(currentPage - 1)} 
        disabled={currentPage === 1}>
        &lt; Previous
      </button>
      <span>Page {currentPage}</span>
      <button 
        className="bg-gray-300 text-gray-700 px-4 py-2 rounded shadow hover:bg-gray-400 transition"
        onClick={() => setCurrentPage(currentPage + 1)}>
        Next &gt;
      </button>
    </div>
  );
};

export default Pagination;
