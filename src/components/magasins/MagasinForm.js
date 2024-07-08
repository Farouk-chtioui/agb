import React, { useState } from 'react';
import Form from '../Form/Form';
import AddressAutocomplete from '../googleAutoComplete/AddressAutocomplete';
import '../Form/Form.css';

const MagasinForm = ({
    newMagasin,
    handleChange,
    handleAddMagasin,
    handleEditMagasin,
    setShowForm,
    isEditMode,
}) => {
    const [addressData, setAddressData] = useState({ address: newMagasin.address || '', postalCode: '' });

    const fields = [
        { name: 'first_name', label: 'Nom', type: 'text', placeholder: 'Nom', colSpan: 1 },
        { name: 'last_name', label: 'Prenom', type: 'text', placeholder: 'Prenom', colSpan: 1 },
        { name: 'email', label: 'Email', type: 'email', placeholder: 'Email', colSpan: 2 },
        !isEditMode && { name: 'password', label: 'Mot de passe', type: 'password', placeholder: 'Mot de passe', colSpan: 2 },
        { name: 'address', label: 'Address', type: 'autocomplete', placeholder: 'Address', colSpan: 2 },
        { name: 'numberMa', label: 'Nombre des commandes du matin', type: 'number', placeholder: 'Nombre des commandes du matin', colSpan: 2 },
        { name: 'numberMi', label: 'Nombre des commandes du midi', type: 'number', placeholder: 'Nombre des commandes du midi', colSpan: 2 },
    ].filter(Boolean);

    const handleAddressChange = (e) => {
        handleChange(e); 
        if (e.postalCode) {
            setAddressData((prev) => ({ ...prev, address: e.target.value, postalCode: e.postalCode }));
            console.log('Postal Code:', e.postalCode);
        } else {
            setAddressData((prev) => ({ ...prev, address: e.target.value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!addressData.postalCode) {
            alert('Please provide an address with a postal code.');
            return;
        }
        if (isEditMode) {
            handleEditMagasin(e);
        } else {
            handleAddMagasin(e);
        }
    };

    return (
        <Form
            formData={newMagasin}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            setShowForm={setShowForm}
            fields={fields}
            title={isEditMode ? 'Modifier le Magasin' : 'Ajouter un Magasin'}
            renderField={(field) => {
                if (field.type === 'autocomplete') {
                    return (
                        <div className={`form-group col-span-${field.colSpan}`} key={field.name}>
                            <label htmlFor={field.name}>{field.label}</label>
                            <AddressAutocomplete
                                value={addressData.address} 
                                onChange={handleAddressChange}
                            />
                        </div>
                    );
                }
                return (
                    <div className={`form-group col-span-${field.colSpan}`} key={field.name}>
                        <label htmlFor={field.name}>{field.label}</label>
                        <input
                            type={field.type}
                            name={field.name}
                            value={newMagasin[field.name]}
                            onChange={handleChange}
                            placeholder={field.placeholder}
                            autoComplete='off'
                            className="border rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 border-blue-600"
                        />
                    </div>
                );
            }}
        />
    );
};

export default MagasinForm;
