import React, { useEffect } from 'react';
import Form from '../Form/Form';
import '../Form/Form.css';
import { fetchMagasins } from '../../api/marketService';
import { fetchSectures } from '../../api/sectureService';

const PlanForm = ({
  newPlan,
  handleChange,
  handleAddPlan,
  handleEditPlan,
  handleDeletePlan,
  setShowForm,
  isEditMode,
  markets,
  secteurs,
}) => {
  useEffect(() => {
    if (isEditMode && newPlan.Date) {
      handleChange({ target: { name: 'Date', value: new Date(newPlan.Date).toISOString().substr(0, 10) } });
    }
  }, [isEditMode, newPlan.Date, handleChange]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedPlan = {
      ...newPlan,
      Date: new Date(newPlan.Date),
    };

    if (isEditMode) {
      handleEditPlan(updatedPlan);
    } else {
      handleAddPlan(updatedPlan);
    }
    setShowForm(false);
  };

  const fields = [
    {
      name: 'Date',
      label: 'Date de la livraison',
      type: 'date',
      placeholder: 'Date de la livraison',
      colSpan: 1,
      value: newPlan.Date ? newPlan.Date : '',
    },
    {
      name: 'market',
      label: 'Magasin',
      type: 'dropdown',
      placeholder: 'Magasin',
      colSpan: 1,
      options: markets.map(market => ({ value: market._id, label: market.first_name })),
    },
    {
      name: 'secteurMatinal',
      label: 'Secteur Matinale',
      type: 'dropdown',
      placeholder: 'Sélectionnez Secteur Matinale',
      colSpan: 1,
      options: secteurs.map(sector => ({ value: sector._id, label: sector.name })),
    },
    {
      name: 'secteurApresMidi',
      label: 'Secteur Après Midi',
      type: 'dropdown',
      placeholder: 'Sélectionnez Secteur Après Midi',
      colSpan: 1,
      options: secteurs.map(sector => ({ value: sector._id, label: sector.name })),
    },
    { name: 'totalMidi', label: 'Total Matin', type: 'number', placeholder: 'Total Matin', colSpan: 1 },
    { name: 'totalMatin', label: 'Total Après Midi', type: 'number', placeholder: 'Total Après Midi', colSpan: 1 },
  ];

  return (
    <Form
      formData={newPlan}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      setShowForm={setShowForm}
      fields={fields}
      title={isEditMode ? 'Modifier le Plan' : 'Ajouter un Plan'}
    >
      {isEditMode && (
        <button type="button" onClick={handleDeletePlan} className="btn btn-danger">
          Supprimer
        </button>
      )}
    </Form>
  );
};

export default PlanForm;
