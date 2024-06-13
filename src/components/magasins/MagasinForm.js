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
        {name:'last_name',label:'Prenom',type:'text',placeholder:'Prenom',colSpan:1},
        { name: 'email', label: 'Email', type: 'email', placeholder: 'Email', colSpan: 1 },
        {name:'password' ,label:'Password',type:'password',placeholder:'Password',colSpan:1},
        {name:'address',label:'Address',type:'text',placeholder:'Address',colSpan:1},
        {name:'numberMa',label:'Nombre des commandes du matin',type:'number',placeholder:'Nombre des commandes du matin',colSpan:1},
        {name:'numberMi',label:'Nombre des commandes du midi',type:'number',placeholder:'Nombre des commandes du midi',colSpan:1},
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
export default MagasinForm;