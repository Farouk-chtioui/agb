import React from 'react';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import logo from '../../images/logo1.png';

const Sidebar = ({ items, openIndexes, toggleDropdown, isOpen, onMouseEnter, onMouseLeave }) => {
  return (
    <div 
      className={`flex flex-col bg-gray-100 p-4 shadow-lg transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'} h-screen fixed sm:relative z-10`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={`flex items-center justify-center mb-6 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
        <img src={logo} alt="Logo" className="h-20 w-30" />
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul>
          {items.map((item, index) => (
            <li key={index} className="mb-4">
              {item.path ? (
                <Link to={item.path} className="block">
                  <div
                    className={`flex items-center justify-between cursor-pointer p-2 rounded ${!isOpen && 'justify-center'}`}
                  >
                    <div className="flex items-center">
                      {item.icon && <item.icon className="mr-3 h-5 w-5 text-blue-500" />}
                      {isOpen && <span className="text-gray-700">{item.title}</span>}
                    </div>
                    {item.subItems && isOpen && (
                      <div className="ml-3">
                        {openIndexes[index] ? (
                          <FaChevronDown className="h-4 w-4 text-gray-500" />
                        ) : (
                          <FaChevronRight className="h-4 w-4 text-gray-500" />
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              ) : (
                <div
                  className={`flex items-center justify-between cursor-pointer p-2 rounded ${!isOpen && 'justify-center'}`}
                  onClick={() => toggleDropdown(index)}
                >
                  <div className="flex items-center">
                    {item.icon && <item.icon className="mr-3 h-5 w-5 text-blue-500" />}
                    {isOpen && <span className="text-gray-700">{item.title}</span>}
                  </div>
                  {item.subItems && isOpen && (
                    <div className="ml-3">
                      {openIndexes[index] ? (
                        <FaChevronDown className="h-4 w-4 text-gray-500" />
                      ) : (
                          <FaChevronRight className="h-4 w-4 text-gray-500" />
                      )}
                    </div>
                  )}
                </div>
              )}
              {item.subItems && openIndexes[index] && isOpen && (
                <ul className="ml-6 mt-2">
                  {item.subItems.map((subItem, subIndex) => (
                    <li key={subIndex} className="mb-2">
                      <Link to={subItem.path} className="block">
                        <div className="flex items-center p-2 rounded">
                          {subItem.icon && <subItem.icon className="mr-3 h-4 w-4 text-blue-400" />}
                          <span className="text-gray-500">{subItem.title}</span>
                        </div>
                      </Link>
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
