import React, { useState } from 'react';
import Form from '../Form/Form';
import '../Form/Form.css';

const ProduitsForm = ({
    newProduit,
    handleChange,
    handleAddProduit,
    handleEditProduit,
    setShowForm,
    isEditMode,
}) => {
    const [keyForFileInput, setKeyForFileInput] = useState(Date.now());

    const fields = [
        { name: 'name', label: 'Nom', type: 'text', placeholder: 'Nom', colSpan: 1 },
        { name: 'price', label: 'Prix', type: 'text', placeholder: 'Prix', colSpan: 1 },
        { name: 'description', label: 'Description', type: 'text', placeholder: 'Description', colSpan: 2 },
        { name: 'image', label: 'Image', type: 'file', placeholder: 'Upload Image', colSpan: 1, key: keyForFileInput },
    ].filter(Boolean);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditMode) {
            handleEditProduit(e);
        } else {
            handleAddProduit(e);
        }
        setKeyForFileInput(Date.now());
    };

    return (
        <Form
            formData={newProduit}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            setShowForm={setShowForm}
            fields={fields} // Assuming your Form component can render fields based on this prop
        />
    );
};

export default ProduitsForm;