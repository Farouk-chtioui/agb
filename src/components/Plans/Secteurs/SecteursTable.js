import React from 'react';
import Table from '../../Table/Table';

const SectureTable = ({ sectures, handleDelete, handleModify }) => {
    const header = ["Nom de Secture", "Codes Postaux", "Action"];
    const renderRow = (secture) => (
        <>
            <td className="py-2 px-4 border-b border-gray-200">{secture.name}</td>
            <td className="py-2 px-4 border-b border-gray-200">
                <ul className="list-none p-0 m-0">
                    {secture.codesPostaux.map((code, index) => (
                        <li key={index} className="relative pl-4 before:content-['•'] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:text-black">
                            {code}
                        </li>
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