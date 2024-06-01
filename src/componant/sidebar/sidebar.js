// Sidebar.js
import React, { useState } from 'react';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';
import logo from '../../images/logo1.png';
const Sidebar = ({ items }) => {
  const [openIndexes, setOpenIndexes] = useState({});

  const toggleDropdown = (index) => {
    setOpenIndexes((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  return (
    <div className="w-64 h-screen bg-gray-100 p-4 shadow-lg  ">
      <div className="flex items-center justify-center mb-6">
        <img src={logo}  alt="Logo" className="h-16 w-30"/>
      </div>
      <nav>
        <ul>
          {items.map((item, index) => (
            <li key={index} className="mb-4">
              <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleDropdown(index)}>
                <div className="flex items-center">
                  {item.icon && <item.icon className="mr-3 h-5 w-5 text-blue-500" />}
                  <span className="text-gray-700">{item.title}</span>
                </div>
                {item.subItems && (
                  <div className="ml-3">
                    {openIndexes[index] ? <FaChevronDown className="h-4 w-4 text-gray-500" /> : <FaChevronRight className="h-4 w-4 text-gray-500" />}
                  </div>
                )}
              </div>
              {item.subItems && (
                <ul className={`ml-6 mt-2 transition-all duration-300 ${openIndexes[index] ? 'block' : 'hidden'}`}>
                  {item.subItems.map((subItem, subIndex) => (
                    <li key={subIndex} className="mb-2">
                      <div className="flex items-center">
                        {subItem.icon && <subItem.icon className="mr-3 h-4 w-4 text-blue-400" />}
                        <span className="text-gray-500">{subItem.title}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
