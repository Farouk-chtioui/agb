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
      secteursMatinal: newPlan.secteursMatinal?.map(item => item._id || item) || [],
      secteursApresMidi: newPlan.secteursApresMidi?.map(item => item._id || item) || [],
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

  const handleClearField = (fieldName, index) => {
    const newArray = [...newPlan[fieldName]];
    newArray.splice(index, 1);
    handleChange({ target: { name: fieldName, value: newArray } });
  };

  const handleAddField = (fieldName) => {
    handleChange({ target: { name: fieldName, value: [...(newPlan[fieldName] || []), ''] } });
  };

  const renderArrayField = (field, index) => (
    <div className={`form-group col-span-${field.colSpan || 2}`} key={index}>
      <label className="block text-blue-700 mb-2">{field.label}</label>
      {newPlan[field.name]?.map((item, idx) => (
        <div className="flex items-center mb-2" key={idx}>
          <select
            className="border rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 border-blue-600"
            name={field.name}
            value={item || ''}
            onChange={(e) => {
              const updatedArray = newPlan[field.name].map((val, i) => (i === idx ? e.target.value : val));
              handleChange({ target: { name: field.name, value: updatedArray } });
            }}
          >
            <option value="" disabled>{field.placeholder}</option>
            {field.options.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <button
            type="button"
            className="ml-2 text-red-500"
            onClick={() => handleClearField(field.name, idx)}
          >
            &times;
          </button>
        </div>
      ))}
      <button
        type="button"
        className="text-blue-500"
        onClick={() => handleAddField(field.name)}
      >
        + Add {field.label}
      </button>
    </div>
  );

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
      name: 'secteursMatinal',
      label: 'Secteurs Matinal',
      type: 'arrayDropdown',
      placeholder: 'Search Secteur Matinal',
      colSpan: 1,
      options: secteurs.map(sector => ({ value: sector._id, label: sector.name })),
      value: newPlan.secteursMatinal || [],
    },
    {
      name: 'secteursApresMidi',
      label: 'Secteurs Après Midi',
      type: 'arrayDropdown',
      placeholder: 'Search Secteur Après Midi',
      colSpan: 1,
      options: secteurs.map(sector => ({ value: sector._id, label: sector.name })),
      value: newPlan.secteursApresMidi || [],
    },
    { name: 'totalMatin', label: 'Total Matin', type: 'number', placeholder: 'Total Matin', colSpan: 1, value: newPlan.totalMatin || 0 },
    { name: 'totalMidi', label: 'Total Après Midi', type: 'number', placeholder: 'Total Après Midi', colSpan: 1, value: newPlan.totalMidi || 0 },
  ];

  const renderField = (field, index) => {
    if (field.type === 'arrayDropdown') {
      return renderArrayField(field, index);
    }

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
