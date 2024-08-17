import React, { useState, useEffect } from 'react';
import Form from '../Form/Form';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import AddressAutocomplete from '../googleAutoComplete/AddressAutocomplete';

const UtilisateursForm = ({
  newUtilisateur,
  handleChange,
  handleAddUtilisateur,
  handleEditUtilisateur,
  setShowForm,
  isEditMode,
}) => {
  const [fields, setFields] = useState([]);
  const [addressData, setAddressData] = useState({ address: '', codePostal: '' });

  useEffect(() => {
    const getFieldsByRole = (role) => {
      switch (role) {
        case 'Admin':
          return [
            { name: 'name', label: 'Name', type: 'text', placeholder: 'Name', colSpan: 1 },
            { name: 'email', label: 'Email', type: 'email', placeholder: 'Email', colSpan: 1 },
            { name: 'password', label: 'Password', type: 'password', placeholder: 'Password', colSpan: 1 },
          ];
        case 'Market':
          return [
            { name: 'first_name', label: 'First Name', type: 'text', placeholder: 'First Name', colSpan: 1 },
            { name: 'last_name', label: 'Last Name', type: 'text', placeholder: 'Last Name', colSpan: 1 },
            { name: 'email', label: 'Email', type: 'email', placeholder: 'Email', colSpan: 1 },
            { name: 'password', label: 'Password', type: 'password', placeholder: 'Password', colSpan: 1 },
            { name: 'address', label: 'Address', type: 'autocomplete', placeholder: 'Address', colSpan: 2 },
            { name: 'numberMa', label: 'Number MA', type: 'text', placeholder: 'Number MA', colSpan: 1 },
            { name: 'numberMi', label: 'Number MI', type: 'text', placeholder: 'Number MI', colSpan: 1 },
          ];
        case 'Driver':
          return [
            { name: 'first_name', label: 'First Name', type: 'text', placeholder: 'First Name', colSpan: 1 },
            { name: 'last_name', label: 'Last Name', type: 'text', placeholder: 'Last Name', colSpan: 1 },
            { name: 'email', label: 'Email', type: 'email', placeholder: 'Email', colSpan: 1 },
            { name: 'password', label: 'Password', type: 'password', placeholder: 'Password', colSpan: 1 },
          ];
        default:
          return [];
      }
    };

    setFields([
      { name: 'role', label: 'Rôle', type: 'select', options: ['Admin', 'Market', 'Driver'], colSpan: 1 },
      ...getFieldsByRole(newUtilisateur.role || 'Market')
    ]);
  }, [newUtilisateur.role]);

  const handleAddressChange = ({ address, codePostal }) => {
    setAddressData({ address, codePostal });
    handleChange({
      target: {
        name: 'address',
        value: address,
      }
    });
    handleChange({
      target: {
        name: 'codePostal',
        value: codePostal,
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedUtilisateur = {
      ...newUtilisateur,
      address: addressData.address,
      codePostal: addressData.codePostal,
    };

    try {
      if (isEditMode) {
        await handleEditUtilisateur(updatedUtilisateur);
      } else {
        await handleAddUtilisateur(updatedUtilisateur);
      }
      toast.success(isEditMode ? 'Utilisateur modifié avec succès' : 'Utilisateur ajouté avec succès');
      setShowForm(false);
    } catch (error) {
      toast.error('Une erreur est survenue');
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
        if (field.type === 'autocomplete' && newUtilisateur.role === 'Market') {
          return (
            <div className={`form-group col-span-${field.colSpan}`} key={index}>
              <label htmlFor={field.name} className="block text-blue-700 mb-2">{field.label}</label>
              <AddressAutocomplete
                value={newUtilisateur.address}
                onChange={handleAddressChange}
              />
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
