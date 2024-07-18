import React from 'react';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import logo from '../../images/logo1.png';

const Sidebar = ({ items, openIndexes, toggleDropdown }) => {

  const handleClick = (item, index) => {
    if (item.onClick) {
      item.onClick();
    } else {
      toggleDropdown(index);
    }
  };

  return (
    <div className="w-64 h-screen bg-gray-100 p-4 shadow-lg flex flex-col">
      <div className="flex items-center justify-center mb-6">
        <img src={logo} alt="Logo" className="h-20 w-30" />
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul>
          {items.map((item, index) => (
            <li key={index} className="mb-4">
              <div
                className="flex items-center justify-between cursor-pointer p-2 rounded hover:bg-blue-200 transition-colors duration-200"
                onClick={() => handleClick(item, index)}
              >
                <div className="flex items-center w-full">
                  {item.icon && <item.icon className="mr-3 h-5 w-5 text-blue-500" />}
                  {item.path ? (
                    <Link to={item.path} className="text-gray-700 hover:text-blue-500">
                      {item.title}
                    </Link>
                  ) : (
                    <span className="text-gray-700 hover:text-blue-500">{item.title}</span>
                  )}
                </div>
                {item.subItems && (
                  <div className="ml-3">
                    {openIndexes[index] ? (
                      <FaChevronDown className="h-4 w-4 text-gray-500" />
                    ) : (
                      <FaChevronRight className="h-4 w-4 text-gray-500" />
                    )}
                  </div>
                )}
              </div>
              {item.subItems && openIndexes[index] && (
                <ul className={`ml-6 mt-2 transition-all duration-300 ${openIndexes[index] ? 'block' : 'hidden'}`}>
                  {item.subItems.map((subItem, subIndex) => (
                    <li key={subIndex} className="mb-2 flex justify-between items-center">
                      <Link to={subItem.path} className="flex items-center p-2 rounded hover:bg-blue-200 transition-colors duration-200">
                        {subItem.icon && <subItem.icon className="mr-3 h-4 w-4 text-blue-400" />}
                        <span className="text-gray-500 hover:text-blue-500">{subItem.title}</span>
                      </Link>
                      {subItem.counter !== undefined && (
                        <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                          {subItem.counter}
                        </span>
                      )}
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
