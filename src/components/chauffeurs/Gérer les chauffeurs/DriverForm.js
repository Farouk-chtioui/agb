import React, { useEffect, useCallback } from 'react';

const DriverForm = ({ 
  newDriver, 
  handleChange, 
  handleAddDriver, 
  handleEditDriver, 
  setShowForm, 
  isEditMode, 
  currentDriver 
}) => {

  // This effect sets the form values when entering edit mode
  useEffect(() => {
    if (isEditMode && currentDriver) {
      handleChange({ target: { name: 'last_name', value: currentDriver.last_name } });
      handleChange({ target: { name: 'first_name', value: currentDriver.first_name } });
      handleChange({ target: { name: 'email', value: currentDriver.email } });
    }
  }, [isEditMode, currentDriver, handleChange]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      handleEditDriver(e);
    } else {
      handleAddDriver(e);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-1/3 h-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{isEditMode ? 'Modifier le Chauffeur' : 'Ajouter un Chauffeur'}</h2>
          <button className="text-gray-700 text-xl" onClick={() => setShowForm(false)}>&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Nom</label>
              <input
                className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                name="last_name"
                value={newDriver.last_name}
                onChange={handleChange}
                placeholder="Nom"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Prénom</label>
              <input
                className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                name="first_name"
                value={newDriver.first_name}
                onChange={handleChange}
                placeholder="Prénom"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Email Adresse</label>
            <input
              className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="email"
              name="email"
              value={newDriver.email}
              onChange={handleChange}
              placeholder="E-mail"
            />
          </div>
          {!isEditMode && (
            <div>
              <label className="block text-gray-700 mb-2">Mot de passe</label>
              <input
                className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="password"
                name="password"
                onChange={handleChange}
                placeholder="Mot de passe"
              />
            </div>
          )}
          <div className="flex justify-center">
            <button 
              className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
              type="submit">
              {isEditMode ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DriverForm;
