import React from 'react';
import Table from '../../Table/Table';
const DemandeTable = ({ demandes, handleDelete, handleModify }) => {
    const headers=["Référence","Client","Chauffeur","Magasin","Date de la Livraison","Statut","Action"];
    const role=localStorage.getItem('role');
    const getStatusLabel=(status)=>{
        switch(status){
            case 'En attente':
                return {label:'En attente',color:'text-blue-600'};
            case 'À la livraison':
                return {label:'À la livraison',color:'text-yellow-600'};

        }
    };
    const renderRow=(demande)=>{
        const statusInfo=getStatusLabel(demande.status);
        return (
            <>
            <td className="py-6 px-4 border-b border-gray-200">{demande.Référence}</td>
            <td className="py-6 px-4 border-b border-gray-200">{demande.client?.first_name??'N/A'}</td>
            <td className="py-6 px-4 border-b border-gray-200">{demande.driver?.first_name??'N/A'}</td>
            <td className="py-6 px-4 border-b border-gray-200">{demande.market?.first_name??'N/A'}</td>
            <td className="py-6 px-4 border-b border-gray-200">{demande.Date}</td>
            <td className={`py-6 px-4 border-b border-gray-200 flex items-center justify-center gap-2 ${statusInfo.color}`}>
                <span className="font-poppins font-normal text-base leading-6">
                    {statusInfo.label}
                </span>
            </td>
            </>
        )
    };
    return (
        <Table headers={headers} data={demandes} renderRow={renderRow} handleDelete={handleDelete} handleModify={handleModify} role={role}/>

    );
}
export default DemandeTable;