import React, { useMemo } from 'react';
import Table from '../Table/Table';
import { FaRegEdit } from 'react-icons/fa';
import { FaRegTrashCan } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const Utilisateurstable = React.memo(({
  utilisateurs,
  handleDelete,
  handleModify,
}) => {
  const headers = ['Display Name', 'Email', 'Role', 'Actions'];
  const role = localStorage.getItem('role');

  const normalizedUtilisateurs = useMemo(() => {
    return utilisateurs.map(utilisateur => ({
      _id: utilisateur._doc._id,
      displayName: utilisateur.displayName || 'N/A',
      email: utilisateur._doc.email || 'N/A',
      role: utilisateur.role || 'N/A',
    }));
  }, [utilisateurs]);

  const renderRow = (utilisateur) => {
    return (
      <>
        <td className="py-6 px-4 border-b border-gray-200">{utilisateur.displayName}</td>
        <td className="py-6 px-4 border-b border-gray-200">{utilisateur.email}</td>
        <td className="py-6 px-4 border-b border-gray-200">{utilisateur.role}</td>
        <td className="py-6 px-4 border-b border-gray-200 text-center">
          <button
            className="text-blue-500 hover:text-blue-700 transition mx-2"
            onClick={() => handleModify(utilisateur)}
          >
            <FaRegEdit size={18} />
          </button>
          <button
            className="text-red-500 hover:text-red-700 transition mx-2"
            onClick={() => handleDelete(utilisateur)}
          >
            <FaRegTrashCan size={18} />
          </button>
        </td>
      </>
    );
  };

  return (
    <div className="overflow-x-auto">
      <Table
        headers={headers}
        data={normalizedUtilisateurs}
        renderRow={renderRow}
        showModify={false}
        role={role}
      />
    </div>
  );
});

export default Utilisateurstable;
