// DriverTable.js
import React from 'react';
import { FaPen, FaTrash } from 'react-icons/fa';

const DriverTable = ({ drivers, handleDelete,handleModify}) => {
    return (
        <table className="min-w-full bg-white mt-8 ">
            <thead>
                <tr className="custom-color">
                    <th className="py-3 px-4 border-b border-gray-200">ID</th>
                    <th className="py-3 px-4 border-b border-gray-200">Nom de chauffeur</th>
                    <th className="py-3 px-4 border-b border-gray-200">E-mail</th>
                    <th className="py-3 px-4 border-b border-gray-200">Créé le</th>
                    <th className="py-3 px-4 border-b border-gray-200">Action</th>
                </tr>
            </thead>
            <tbody>
                {drivers.map(driver => (
                    <tr key={driver._id} className="text-center even:bg-gray-50">
                        <td className="py-6 px-4 border-b border-gray-200">{driver._id}</td>
                        <td className="py-6 px-4 border-b border-gray-200">{driver.first_name + " " + driver.last_name}</td>
                        <td className="py-6 px-4 border-b border-gray-200">{driver.email}</td>
                        <td className="py-6 px-4 border-b border-gray-200">
                            {`${new Date(driver.created_at).getDate()} ${new Date(driver.created_at).toLocaleString('default', { month: 'short' })} ${new Date(driver.created_at).getFullYear()}`}</td>           
                            <td className="py-2 px-4 border-b border-gray-200">
                            <button 
                                className="text-blue-500 hover:text-blue-700 transition mr-3"
                                onClick={() => handleModify(driver)}>
                                <FaPen/>
                            </button>
                            <button
                                className="text-blue-500 hover:text-red-700 transition "
                                onClick={() => handleDelete(driver._id)}>
                                <FaTrash />
                            </button>
                           
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default DriverTable;