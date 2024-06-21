import React from 'react';
import { FaEdit, FaPen, FaRegEdit, FaTrash } from 'react-icons/fa';
import './Table.css';
import trash from '../../images/Vector.png'
import { FaRegTrashCan, FaTrashCan } from 'react-icons/fa6';
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
                                className="text-blue-500 hover:text-blue-700 transition "
                                onClick={() => handleModify(item)}
                            >
                                <FaRegEdit size={20} />
                            </button>
                            <button
                                className="text-blue-500 hover:text-red-700 transition"
                                onClick={() => handleDelete(item._id)}
                            >
                                <FaRegTrashCan size={20}/>
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default Table;
