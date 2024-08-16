import React from 'react';
import Form from '../Form/Form';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

const UtilisateursForm = ({
  newUtilisateur,
  handleChange,
  handleAddUtilisateur,
  handleEditUtilisateur,
  setShowForm,
  isEditMode,
}) => {
  const fields = [
    { name: 'first_name', label: 'Nom', type: 'text', placeholder: 'Nom', colSpan: 1 },
    { name: 'last_name', label: 'Prenom', type: 'text', placeholder: 'Prenom', colSpan: 1 },
    { name: 'address', label: 'Adresse', type: 'text', placeholder: 'Adresse', colSpan: 2 },
    { name: 'role', label: 'Rôle', type: 'select', options: ['Admin', 'Market', 'Driver'], colSpan: 1 },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      handleEditUtilisateur(e);
    } else {
      handleAddUtilisateur(e);
    }
  };

  return (
    <Form
      formData={newUtilisateur}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      setShowForm={setShowForm}
      fields={fields}
      title={isEditMode ? 'Modifier l\'Utilisateur' : 'Ajouter un Utilisateur'}
      renderField={(field, index) => {
        if (field.type === 'select') {
          return (
            <div className={`form-group col-span-${field.colSpan}`} key={index}>
              <label htmlFor={field.name} className="block text-blue-700 mb-2">{field.label}</label>
              <select
                name={field.name}
                value={newUtilisateur[field.name]}
                onChange={handleChange}
                className="border rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 border-blue-600"
              >
                <option value="">Sélectionner un rôle</option>
                {field.options.map((option, idx) => (
                  <option key={idx} value={option}>{option}</option>
                ))}
              </select>
            </div>
          );
        }
        return (
          <div className={`form-group col-span-${field.colSpan}`} key={index}>
            <label htmlFor={field.name} className="block text-blue-700 mb-2">{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              value={newUtilisateur[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              className="border rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 border-blue-600"
            />
          </div>
        );
      }}
    />
  );
};

export default UtilisateursForm;