import React from 'react';
import Table from '../Table/Table';
import { Link } from 'react-router-dom';

const LivraisonTable = ({ livraisons, handleDelete, handleModify }) => {
    const headers = ["Numéro", "Client", "Chauffeur", "Magasin", "Date de livraison", "Statut", "Action"];
    const role = localStorage.getItem('role');

    const getStatusLabel = (status) => {
        switch (status) {
            case 'En attente':
                return { label: 'En attente', color: 'text-blue-600' };
            case 'À la livraison':
                return { label: 'À la livraison', color: 'text-yellow-600' };
            case 'Livré':
                return { label: 'Livré', color: 'text-green-600' };
            case 'Annulé':
                return { label: 'Annulé', color: 'text-red-600' };
            case 'Retardé':
                return { label: 'Retardé', color: 'text-orange-600' };
            default:
                return { label: 'Inconnu', color: 'text-gray-600' };
        }
    };

    const renderRow = (livraison) => {
        const statusInfo = getStatusLabel(livraison.status);
        return (
            <>
                <td className="py-6 px-4 border-b border-gray-200">
                    <Link to={`/invoice/${livraison.NumeroCommande}`}>{"#" + livraison.NumeroCommande}</Link>
                </td>
                <td className="py-6 px-4 border-b border-gray-200">{livraison.client?.first_name ?? 'N/A'}</td>
                <td className="py-6 px-4 border-b border-gray-200">{livraison.driver?.first_name ?? 'N/A'}</td>
                <td className="py-6 px-4 border-b border-gray-200">{livraison.market?.first_name ?? 'N/A'}</td>
                <td className="py-6 px-4 border-b border-gray-200">{livraison.Date}</td>
                <td className={`py-6 px-4 border-b border-gray-200 flex items-center justify-center gap-2 ${statusInfo.color}`}>
                    <span className="font-poppins font-normal text-base leading-6">
                        {statusInfo.label}
                    </span>
                </td>
            </>
        );
    };

    return (
        <Table
            headers={headers}
            data={livraisons}
            renderRow={renderRow}
            handleDelete={handleDelete}
            handleModify={handleModify}
            role={role}
        />
    );
}

export default LivraisonTable;
