import React, { useState } from 'react';
import UtilisateursForm from './UtilisateursForm';
import UtilisateursTable from './Utilisateurstable';

const Utilisateurs = () => {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [newUtilisateur, setNewUtilisateur] = useState({
    first_name: '',
    last_name: '',
    address: '',
    role: '',
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUtilisateur({ ...newUtilisateur, [name]: value });
  };

  const handleAddUtilisateur = (e) => {
    e.preventDefault();
    setUtilisateurs([...utilisateurs, { ...newUtilisateur, _id: Date.now().toString() }]);
    setNewUtilisateur({ first_name: '', last_name: '', address: '', role: '' });
    setShowForm(false);
  };

  const handleEditUtilisateur = (e) => {
    e.preventDefault();
    setUtilisateurs(utilisateurs.map((utilisateur) =>
      utilisateur._id === newUtilisateur._id ? newUtilisateur : utilisateur
    ));
    setNewUtilisateur({ first_name: '', last_name: '', address: '', role: '' });
    setIsEditMode(false);
    setShowForm(false);
  };

  const handleEdit = (utilisateur) => {
    setNewUtilisateur(utilisateur);
    setIsEditMode(true);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setUtilisateurs(utilisateurs.filter((utilisateur) => utilisateur._id !== id));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestion des Utilisateurs</h1>
      <button
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-200 mb-4"
        onClick={() => setShowForm(true)}
      >
        Ajouter un Utilisateur
      </button>
      {showForm && (
        <UtilisateursForm
          newUtilisateur={newUtilisateur}
          handleChange={handleChange}
          handleAddUtilisateur={handleAddUtilisateur}
          handleEditUtilisateur={handleEditUtilisateur}
          setShowForm={setShowForm}
          isEditMode={isEditMode}
        />
      )}
      <UtilisateursTable
        utilisateurs={utilisateurs}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default Utilisateurs;