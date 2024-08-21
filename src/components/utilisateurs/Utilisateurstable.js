import React, { useMemo } from 'react';
import Table from '../Table/Table';
import { FaRegEdit } from 'react-icons/fa';
import { FaRegTrashCan } from 'react-icons/fa6';

const Utilisateurstable = React.memo(({
  utilisateurs,
  handleDelete,
  handleModify,
}) => {
  const headers = ['First Name', 'Last Name', 'Email', 'Role', 'Actions'];
  const role = localStorage.getItem('role');

  const normalizedUtilisateurs = useMemo(() => {
    return utilisateurs.map(utilisateur => ({
      _id: utilisateur._id,  
      first_name: utilisateur.first_name || utilisateur.name || 'N/A',
      last_name: utilisateur.last_name || 'N/A',
      email: utilisateur.email || 'N/A',
      role: utilisateur.role || 'N/A',
    }));
  }, [utilisateurs]);

  const renderRow = (utilisateur) => {
    return (
      <>
        <td className="py-2 px-4 border-b border-gray-200">{utilisateur.first_name}</td>
        <td className="py-2 px-4 border-b border-gray-200">{utilisateur.last_name}</td>
        <td className="py-2 px-4 border-b border-gray-200">{utilisateur.email}</td>
        <td className="py-2 px-4 border-b border-gray-200">{utilisateur.role}</td>
        <td className="py-2 px-4 border-b border-gray-200">
          <button
            className="text-blue-500 hover:text-blue-700 transition mx-1"
            onClick={() => handleModify(utilisateur)}
          >
            <FaRegEdit size={20} />
          </button>
          <button
            className="text-blue-500 hover:text-red-700 transition mx-1"
            onClick={() => handleDelete(utilisateur)}
          >
            <FaRegTrashCan size={20} />
          </button>
        </td>
      </>
    );
  };

  return (
    <Table
      headers={headers}
      data={normalizedUtilisateurs}
      renderRow={renderRow}
      showModify={false}
      showDelete={false}  
      role={role}
    />
  );
});

export default Utilisateurstable;
