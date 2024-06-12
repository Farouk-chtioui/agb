import React from 'react';
import { FaPen, FaTrash } from 'react-icons/fa';
import './Table.css';
const Table = ({ headers, data, renderRow, handleDelete, handleModify }) => {
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
                    <tr key={item._id} className="text-center ">
                        {renderRow(item)}
                        <td className="py-2 px-4 border-b border-gray-200">
                            <button
                                className="text-blue-500 hover:text-blue-700 transition mr-3"
                                onClick={() => handleModify(item)}
                            >
                                <FaPen />
                            </button>
                            <button
                                className="text-blue-500 hover:text-red-700 transition"
                                onClick={() => handleDelete(item._id)}
                            >
                                <FaTrash />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default Table;
