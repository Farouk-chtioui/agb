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

  // Normalize data only once and memoize it
  const normalizedUtilisateurs = useMemo(() => {
    return utilisateurs.map(utilisateur => ({
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
      </>
    );
  };

  return (
    <Table
      headers={headers}
      data={normalizedUtilisateurs}
      renderRow={renderRow}
      handleDelete={handleDelete}
      handleModify={handleModify}
      ModifyIcon={FaRegEdit}
      DeleteIcon={FaRegTrashCan}
      showModify={true}
      showDelete={true}
    />
  );
});

export default Utilisateurstable;
