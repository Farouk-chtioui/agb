import React from 'react';
import Table from '../Table/Table';
import { FaUserPlus } from 'react-icons/fa';

const FicheDeRouteTable = ({ livraisons, handleAssignDriver }) => {
  const headers = ['Numero Commande', 'Référence', 'Client', 'Market', 'Driver', 'Action'];
  const role = localStorage.getItem('role');

  const renderRow = (livraison) => (
    <>
      <td className="py-2 px-4 border-b border-gray-200">{livraison.NumeroCommande}</td>
      <td className="py-2 px-4 border-b border-gray-200">{livraison.Référence}</td>
      <td className="py-2 px-4 border-b border-gray-200">{livraison.client.first_name}</td>
      <td className="py-2 px-4 border-b border-gray-200">{livraison.market.first_name}</td>
      <td className="py-2 px-4 border-b border-gray-200">
        {livraison.driver ? livraison.driver.first_name : 'No driver assigned'}
      </td>
      <td className="py-2 px-4 border-b border-gray-200 text-center">
        <button onClick={() => handleAssignDriver(livraison)}>
          <FaUserPlus className="text-blue-500 hover:text-blue-700" />
        </button>
      </td>
    </>
  );

  return (
    <Table
      headers={headers}
      data={livraisons}
      renderRow={renderRow}
      handleThirdAction={handleAssignDriver}
      role={role}
      ThirdIcon={FaUserPlus}
      showModify={false}
      showDelete={false}
    />
  );
};

export default FicheDeRouteTable;
