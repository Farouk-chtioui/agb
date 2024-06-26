import React from 'react';
import Table from '../../Table/Table';
import './SectureTable.css'; // Import the CSS file

const SectureTable = ({ sectures, handleDelete, handleModify }) => {
    const header = ["Nom de Secture", "Codes Postaux", "Action"];
    const renderRow = (secture) => (
        <>
            <td className="py-8 px-4 border-b border-gray-200">{secture.name}</td>
            <td className="py-6 px-4 border-b border-gray-200">
                <ul className="postal-codes-list">
                    {secture.codesPostaux.map((code, index) => (
                        <li key={index} className="postal-code-item">{code}</li>
                    ))}
                </ul>
            </td>
        </>
    );
    return (
        <Table headers={header} data={sectures} renderRow={renderRow} handleDelete={handleDelete} handleModify={handleModify} />
    );
}

export default SectureTable;
