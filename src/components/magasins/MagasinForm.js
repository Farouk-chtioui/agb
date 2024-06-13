import React, { useState } from 'react';
import Form from '../Form/Form';
import '../Form/Form.css';
const MagasinForm = ({
    newMagasin,
    handleChange,
    handleAddMagasin,
    handleEditMagasin,
    setShowForm,
    isEditMode,
})=>{
    const fields = [
        { name: 'first_name', label: 'Nom', type: 'text', placeholder: 'Nom', colSpan: 1 },
        {name:'last_name',label:'Last Name',type:'text',placeholder:'Last Name',colSpan:1},
        { name: 'email', label: 'Email', type: 'email', placeholder: 'Email', colSpan: 1 },
        {name:'password' ,label:'Password',type:'password',placeholder:'Password',colSpan:1},
        { name: 'description', label: 'Description', type: 'text', placeholder: 'Description', colSpan: 2 },
    ].filter(Boolean);
    const handleSubmit = (e) => {
        e.preventDefault();
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
        />
    );
}