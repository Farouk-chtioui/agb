import React from 'react';
import Table from '../Table/Table';
import { Link } from 'react-router-dom';

const LivraisonTable = ({ livraisons, handleDelete, handleModify }) => {
    const headers = ["Numéro", "Client", "Chauffeur", "Magasin", "Date de livraison", "Statut", "Action"];

    const renderRow = (livraison) => (
        <>
             <td className="py-6 px-4 border-b border-gray-200">
                <Link to={`/invoice/${livraison.NumeroCommande}`}>{livraison.NumeroCommande}</Link>
            </td>
            <td className="py-6 px-4 border-b border-gray-200">{livraison.client?.first_name}</td>
            <td className="py-6 px-4 border-b border-gray-200">{livraison.driver?.first_name}</td>
            <td className="py-6 px-4 border-b border-gray-200">{livraison.market.first_name}</td>
            <td className="py-6 px-4 border-b border-gray-200">{livraison.Date}</td>
            <td className="py-6 px-4 border-b border-gray-200">{livraison.status}</td>
            {/* Add other fields as needed */}
        </>
    );
    


    return (
        <Table
            headers={headers}
            data={livraisons}
            renderRow={renderRow}
            handleDelete={handleDelete}
            handleModify={handleModify}
        />
    );
}

export default LivraisonTable;
