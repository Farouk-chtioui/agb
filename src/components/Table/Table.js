// Table.js
import React from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { FaRegTrashCan } from 'react-icons/fa6';
import './Table.css';

const Table = ({
  headers,
  data,
  renderRow,
  handleDelete,
  handleModify,
  handleThirdAction,
  role,
  ModifyIcon = FaRegEdit,
  DeleteIcon = FaRegTrashCan,
  ThirdIcon,
  showModify = true,
  showDelete = true
}) => {
  return (
    <table className="min-w-full bg-white mt-8">
      <thead>
        <tr className="custom-color">
          {headers.map((header, index) => (
            <th key={index} className="py-3 px-4">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map(item => (
          <tr key={item._id} className="text-center">
            {renderRow(item)}
            <td className="py-2 px-4 border-b border-gray-200">
              {role === 'admin' && (
                <>
                    {ThirdIcon && handleThirdAction && (
                    <button
                      className="text-blue-500 hover:text-green-700 transition"
                      onClick={() => handleThirdAction(item)}
                    >
                      <ThirdIcon size={20} />
                    </button>
                  )}
                  {showModify && (
                    <button
                      className="text-blue-500 hover:text-blue-700 transition"
                      onClick={() => handleModify(item)}
                    >
                      <ModifyIcon size={20} />
                    </button>
                  )}
                  {showDelete && (
                    <button
                      className="text-blue-500 hover:text-red-700 transition"
                      onClick={() => handleDelete(item._id)}
                    >
                      <DeleteIcon size={20} />
                    </button>
                  )}
              
                </>
              )}
              {role === 'market' && showModify && (
                <button
                  className="text-blue-500 hover:text-blue-700 transition"
                  onClick={() => handleModify(item)}
                >
                  <ModifyIcon size={20} />
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
