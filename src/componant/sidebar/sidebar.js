// Sidebar.js
import React, { useState } from 'react';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import logo from '../../images/logo1.png';

const Sidebar = ({ items }) => {
  const [openIndexes, setOpenIndexes] = useState({});

  const toggleDropdown = (index) => {
    setOpenIndexes((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const handleClick = (item, index) => {
    if (item.onClick) {
      item.onClick();
    } else {
      toggleDropdown(index);
    }
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
              <div className="flex items-center justify-between cursor-pointer" onClick={() => handleClick(item, index)}>
                <div className="flex items-center">
                  {item.icon && <item.icon className="mr-3 h-5 w-5 text-blue-500" />}
                  {item.path ? <Link to={item.path} className="text-gray-700">{item.title}</Link> : <span className="text-gray-700">{item.title}</span>}
                </div>
                {item.subItems && (
                  <div className="ml-3">
                    {openIndexes[index] ? <FaChevronDown className="h-4 w-4 text-gray-500" /> : <FaChevronRight className="h-4 w-4 text-gray-500" />}
                  </div>
                )}
              </div>
              {item.subItems && openIndexes[index] && (
                <ul>
                  {item.subItems.map((subItem, subIndex) => (
                    <li key={subIndex}>
                      <Link to={subItem.path} className="block mt-2 text-gray-700">{subItem.title}</Link>
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