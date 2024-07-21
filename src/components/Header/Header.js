import React from 'react';
import { FaTh, FaSearch, FaUser } from 'react-icons/fa';

const Header = () => {
  return (
    <div className="flex items-center justify-between p-4 bg-white shadow-md">
      <div className="flex items-center space-x-4">
        <FaTh className="text-gray-500" />
        <FaSearch className="text-gray-500" />
      </div>
      <div className="flex items-center space-x-2">
        <FaUser className="text-gray-500" />
        <span className="text-gray-500">admin</span>
        <span className="text-gray-500">&#9660;</span>
      </div>
    </div>
  );
};

export default Header;
