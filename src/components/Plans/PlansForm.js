import React, { useEffect, useState } from 'react';
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
  const [tempSecteurMatinal, setTempSecteurMatinal] = useState('');
  const [tempSecteurApresMidi, setTempSecteurApresMidi] = useState('');

  useEffect(() => {
    if (isEditMode && newPlan.Date) {
      const formattedDate = new Date(newPlan.Date).toISOString().substr(0, 10);
      if (newPlan.Date !== formattedDate) {
        handleChange({ target: { name: 'Date', value: formattedDate } });
      }
    }
  }, [isEditMode, newPlan.Date, handleChange]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedPlan = {
      ...newPlan,
      Date: new Date(newPlan.Date),
      market: newPlan.market?._id || newPlan.market,
      secteurMatinal: newPlan.secteurMatinal?.filter(Boolean).map(item => item._id || item) || [],
      secteurApresMidi: newPlan.secteurApresMidi?.filter(Boolean).map(item => item._id || item) || [],
      totalMatin: parseInt(newPlan.totalMatin, 10),
      totalMidi: parseInt(newPlan.totalMidi, 10),
      notes: newPlan.notes // Ensure notes field is included
    };

    if (isEditMode) {
      await handleEditPlan(newPlan._id.toString(), updatedPlan);
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

  const handleAddField = (fieldName, valueToAdd) => {
    if (valueToAdd) {
      const updatedArray = [...(newPlan[fieldName] || []), valueToAdd];
      handleChange({ target: { name: fieldName, value: updatedArray } });
      if (fieldName === 'secteurMatinal') setTempSecteurMatinal('');
      else setTempSecteurApresMidi('');
    }
  };

  const renderArrayField = (field) => (
    <div className={`form-group col-span-${field.colSpan || 2}`} key={field.name}>
      <label className="block text-blue-700 mb-2">{field.label}</label>
      {Array.isArray(newPlan[field.name]) && newPlan[field.name].map((item, idx) => (
        <div className="flex items-center mb-2" key={idx}>
          <select
            className="border rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 border-blue-600"
            name={`${field.name}_${idx}`}
            value={item._id || item || ''}
            onChange={(e) => {
              const updatedArray = [...newPlan[field.name]];
              updatedArray[idx] = e.target.value;
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
      <div className="flex items-center">
        <select
          className="border rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 border-blue-600"
          value={field.name === 'secteurMatinal' ? tempSecteurMatinal : tempSecteurApresMidi}
          onChange={(e) => {
            if (field.name === 'secteurMatinal') {
              setTempSecteurMatinal(e.target.value);
              handleAddField(field.name, e.target.value);
            } else {
              setTempSecteurApresMidi(e.target.value);
              handleAddField(field.name, e.target.value);
            }
          }}
        >
          <option value="" disabled>{field.placeholder}</option>
          {field.options.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
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
      label: 'Magasin bloqué',
      type: 'dropdown',
      placeholder: 'Search Magasin',
      colSpan: 1,
      options: markets.map(market => ({ value: market._id, label: market.first_name })),
      value: newPlan.market?._id || newPlan.market || '',
    },
    {
      name: 'secteurMatinal',
      label: 'Secteurs Matinal',
      type: 'arrayDropdown',
      placeholder: 'Search Secteur Matinal',
      colSpan: 1,
      options: secteurs.map(sector => ({ value: sector._id, label: sector.name })),
      value: newPlan.secteurMatinal || [],
    },
    {
      name: 'secteurApresMidi',
      label: 'Secteurs Après Midi',
      type: 'arrayDropdown',
      placeholder: 'Search Secteur Après Midi',
      colSpan: 1,
      options: secteurs.map(sector => ({ value: sector._id, label: sector.name })),
      value: newPlan.secteurApresMidi || [],
    },
    { name: 'totalMatin', label: 'Total Matin', type: 'number', placeholder: 'Total Matin', colSpan: 1, value: newPlan.totalMatin || 0 },
    { name: 'totalMidi', label: 'Total Après Midi', type: 'number', placeholder: 'Total Après Midi', colSpan: 1, value: newPlan.totalMidi || 0 },
    { name: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Add your notes here...', colSpan: 2, value: newPlan.notes || '' }, // Added notes field
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
              value={newPlan[field.name]?._id || newPlan[field.name] || ''}
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
        ) : field.type === 'textarea' ? (
          <textarea
            className="border rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 border-blue-600"
            name={field.name}
            value={newPlan[field.name] || ''}
            onChange={handleChange}
            placeholder={field.placeholder}
          ></textarea>
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
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-1/2 h-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-blue-600 font-custom">
            {isEditMode ? 'Modifier le Plan' : 'Ajouter un Plan'}
          </h2>
          <button
            className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-2xl"
            onClick={() => setShowForm(false)}
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {fields.map(renderField)}
          </div>
          <div className="flex justify-center">
            <button
              className="bg-blue-500 text-white px-12 py-3 rounded-full shadow hover:bg-blue-600 transition"
              type="submit"
            >
              {isEditMode ? 'Modifier' : 'Créer'}
            </button>
            {isEditMode && (
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-500 text-white px-6 py-3 rounded-full ml-4 shadow hover:bg-red-600 transition"
              >
                Supprimer
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanForm;
