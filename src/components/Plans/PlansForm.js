import React, { useEffect } from 'react';
import Form from '../Form/Form';
import '../Form/Form.css';

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
      const formattedDate = new Date(newPlan.Date).toISOString().substr(0, 10);
      if (newPlan.Date !== formattedDate) {
        handleChange({ target: { name: 'Date', value: formattedDate } });
      }
    }
  }, [isEditMode, newPlan, handleChange]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedPlan = {
      ...newPlan,
      Date: new Date(newPlan.Date),
      market: newPlan.market?._id || newPlan.market,
      secteurMatinal: newPlan.secteurMatinal === '' ? null : newPlan.secteurMatinal?._id || newPlan.secteurMatinal,
      secteurApresMidi: newPlan.secteurApresMidi === '' ? null : newPlan.secteurApresMidi?._id || newPlan.secteurApresMidi,
      totalMatin: parseInt(newPlan.totalMatin, 10),
      totalMidi: parseInt(newPlan.totalMidi, 10),
    };

    if (isEditMode) {
      await handleEditPlan(newPlan._id.toString(), updatedPlan); // Ensure planId is a string
    } else {
      await handleAddPlan(updatedPlan);
    }
    setShowForm(false);
  };

  const handleDelete = async () => {
    await handleDeletePlan(newPlan._id.toString());
    setShowForm(false);
  };

  const handleClearField = (fieldName) => {
    handleChange({ target: { name: fieldName, value: '' } });
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
      placeholder: 'Search Magasin',
      colSpan: 1,
      options: markets.map(market => ({ value: market._id, label: market.first_name })),
      value: newPlan.market?._id || newPlan.market || '',
    },
    {
      name: 'secteurMatinal',
      label: 'Secteur Matinale',
      type: 'dropdown',
      placeholder: 'Search Secteur Matinale',
      colSpan: 1,
      options: secteurs.map(sector => ({ value: sector._id, label: sector.name })),
      value: newPlan.secteurMatinal?._id || newPlan.secteurMatinal || '',
    },
    {
      name: 'secteurApresMidi',
      label: 'Secteur Après Midi',
      type: 'dropdown',
      placeholder: 'Search Secteur Après Midi',
      colSpan: 1,
      options: secteurs.map(sector => ({ value: sector._id, label: sector.name })),
      value: newPlan.secteurApresMidi?._id || newPlan.secteurApresMidi || '',
    },
    { name: 'totalMatin', label: 'Total Matin', type: 'number', placeholder: 'Total Matin', colSpan: 1, value: newPlan.totalMatin || 0 },
    { name: 'totalMidi', label: 'Total Après Midi', type: 'number', placeholder: 'Total Après Midi', colSpan: 1, value: newPlan.totalMidi || 0 },
  ];

  const renderField = (field, index) => {
    return (
      <div className={`form-group col-span-${field.colSpan || 2}`} key={index}>
        <label className="block text-blue-700 mb-2" htmlFor={field.name}>{field.label}</label>
        {field.type === 'dropdown' ? (
          <div className="flex items-center">
            <select
              className="border rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 border-blue-600"
              name={field.name}
              value={newPlan[field.name] || ''}
              onChange={handleChange}
            >
              <option value="" disabled>{field.placeholder}</option>
              {field.options.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            {newPlan[field.name] && (
              <button
                type="button"
                className="ml-2 text-red-500"
                onClick={() => handleClearField(field.name)}
              >
                &times;
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center">
            <input
              className="border rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 border-blue-600"
              type={field.type}
              name={field.name}
              value={newPlan[field.name] || ''}
              onChange={handleChange}
              placeholder={field.placeholder}
            />
            {newPlan[field.name] && (
              <button
                type="button"
                className="ml-2 text-red-500"
                onClick={() => handleClearField(field.name)}
              >
                &times;
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Form
      formData={newPlan}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      handleDelete={handleDelete}
      setShowForm={setShowForm}
      isEditMode={isEditMode}
      markets={markets}
      secteurs={secteurs}
      fields={fields}
      title={isEditMode ? 'Modifier le Plan' : 'Ajouter un Plan'}
      renderField={renderField} // Pass the custom field renderer
    />
  );
};

export default PlanForm;
