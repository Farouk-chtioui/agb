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
            <td className="py-6 px-4 border-b border-gray-200 flex items-center justify-center gap-2">
                <span className={`h-3 w-3 rounded-full ${livraison.status ? 'bg-green-500' : 'bg-yellow-500'}`} style={{ border: '2px solid white' }}></span>
                {livraison.status ? "Livrée" : "En cours"}
            </td>
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
