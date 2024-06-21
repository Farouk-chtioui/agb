import React from 'react';
import Table from '../../Table/Table';
const SectureTable = ({ sectures, handleDelete, handleModify }) => {
    const header = ["Nom de Secture", "Codes Postaux", "Action"];
    const renderRow = (secture) => (
        <>
            <td className="py-8 px-4 border-b border-gray-200">{secture.name}</td>
            <td className="py-6 px-4 border-b border-gray-200">
                <ul>
                    {secture.codesPostaux.map((code, index) => (
                        <li key={index}>{code}</li>
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