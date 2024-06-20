import React, { useState } from "react";
import '../Form/Form.css'; 

const LivraisonForm = ({
    newLivraison,
    handleChange,
    handleAddLivraison,
    handleEditLivraison,
    setShowForm,
    isEditMode,
    clients,
    markets,
    products,
    drivers
}) => {
    const [productList, setProductList] = useState(newLivraison.products.length > 0 ? newLivraison.products : [{ productId: '', quantity: '', dropoff: false, assembly: false, install: false }]);
    const [currentStep, setCurrentStep] = useState(0);

    const handleSubmit = (e) => {
        e.preventDefault();
        const livraisonData = { ...newLivraison, products: productList };
        if (isEditMode) {
            handleEditLivraison(livraisonData);
        } else {
            handleAddLivraison(livraisonData);
        }
    };

    const addProduct = () => {
        setProductList([...productList, { productId: '', quantity: 1, dropoff: false, assembly: false, install: false }]);
    };

    const handleProductChange = (index, field, value) => {
        const newProducts = [...productList];
        newProducts[index][field] = value;
        setProductList(newProducts);
    };

    const steps = [
        {
            title: 'Informations Générales',
            fields: [
                { name: 'NumeroCommande', label: 'Numero de Commande', type: 'text', placeholder: 'Numero de Commande', colSpan: 1 },
                { name: 'Référence', label: 'Référence', type: 'text', placeholder: 'Référence', colSpan: 1 },
                { name: 'part_du_magasin', label: 'Part du Magasin', type: 'text', placeholder: 'Part du Magasin', colSpan: 1 },
                { name: 'Observations', label: 'Observations', type: 'text', placeholder: 'Observations', colSpan: 1 },
                { name: 'Date', label: 'Date', type: 'date', placeholder: 'Date', colSpan: 1 },
                { name: 'Periode', label: 'Periode', type: 'select', options: [{ value: 'Matin', label: 'Matin' }, { value: 'Midi', label: 'Midi' }], placeholder: 'Select Période', colSpan: 1 }
            ]
        },
        {
            title: 'Sélection du Client',
            fields: [
                { name: 'client', label: 'Client', type: 'select', placeholder: 'Select a client', colSpan: 1, options: clients.map(client => ({ value: client._id, label: client.first_name })) }
            ]
        },
        {
            title: 'Sélection des Produits',
            fields: []
        },
        {
            title: 'Détails de la Livraison',
            fields: [
                { name: 'market', label: 'Market', type: 'select', placeholder: 'Select a market', colSpan: 1, options: markets.map(market => ({ value: market._id, label: market.first_name })) },
                { name: 'driver', label: 'Driver', type: 'select', placeholder: 'Select a driver', colSpan: 1, options: drivers.map(driver => ({ value: driver._id, label: driver.first_name })) },
            ]
        }
    ];

    const nextStep = (e) => {
        e.preventDefault();
        setCurrentStep(prevStep => prevStep + 1);
    };

    const prevStep = (e) => {
        e.preventDefault();
        setCurrentStep(prevStep => prevStep - 1);
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-10 rounded-2xl shadow-lg w-1/2 h-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-semibold text-blue-600 font-custom">
                        {isEditMode ? 'Modifier la Livraison' : 'Ajouter une Livraison'}
                    </h2>
                    <button
                        className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-2xl"
                        onClick={() => setShowForm(false)}
                    >
                        &times;
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {steps[currentStep].fields.map((field, index) => (
                        <div className={`form-group col-span-${field.colSpan || 2}`} key={index}>
                            <label className="block text-blue-700 mb-2" htmlFor={field.name}>{field.label}</label>
                            {field.type === 'select' ? (
                                <select
                                    className="border rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 border-blue-600"
                                    name={field.name}
                                    value={newLivraison[field.name] || ''}
                                    onChange={handleChange}
                                    placeholder={field.placeholder}
                                >
                                    <option value="">Select an option</option>
                                    {field.options.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    className="border rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 border-blue-600"
                                    type={field.type}
                                    name={field.name}
                                    value={newLivraison[field.name] || ''}
                                    onChange={handleChange}
                                    placeholder={field.placeholder}
                                />
                            )}
                        </div>
                    ))}
                    {currentStep === 2 && (
                        <>
                            {productList.map((product, index) => (
                                <div key={index} className="mb-4">
                                    <label className="block text-blue-700 mb-2" htmlFor={`product-${index}`}>Produit</label>
                                    <select
                                        className="border rounded-lg w-full py-3 px-4 mb-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 border-blue-600"
                                        name={`product-${index}`}
                                        value={product.productId}
                                        onChange={(e) => handleProductChange(index, 'productId', e.target.value)}
                                    >
                                        <option value="">Select a product</option>
                                        {products.map(prod => (
                                            <option key={prod._id} value={prod._id}>
                                                {prod.name}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        className="border rounded-lg w-full py-3 px-4 mb-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 border-blue-600"
                                        type="number"
                                        placeholder="Quantity"
                                        value={product.quantity}
                                        onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                                    />
                                    <div className="flex items-center mb-2">
                                        <input
                                            type="checkbox"
                                            checked={product.dropoff}
                                            onChange={(e) => handleProductChange(index, 'dropoff', e.target.checked)}
                                        />
                                        <label className="ml-2">Dépôt</label>
                                    </div>
                                    <div className="flex items-center mb-2">
                                        <input
                                            type="checkbox"
                                            checked={product.assembly}
                                            onChange={(e) => handleProductChange(index, 'assembly', e.target.checked)}
                                        />
                                        <label className="ml-2">Montage</label>
                                    </div>
                                    <div className="flex items-center mb-2">
                                        <input
                                            type="checkbox"
                                            checked={product.install}
                                            onChange={(e) => handleProductChange(index, 'install', e.target.checked)}
                                        />
                                        <label className="ml-2">Installation</label>
                                    </div>
                                </div>
                            ))}
                            <button
                                type="button"
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                onClick={addProduct}
                            >
                                Add Product
                            </button>
                        </>
                    )}
                    <div className="flex justify-between mt-4">
                        {currentStep > 0 && (
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded"
                                onClick={prevStep}
                            >
                                Previous
                            </button>
                        )}
                        {currentStep < steps.length - 1 && (
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                onClick={nextStep}
                            >
                                Next
                            </button>
                        )}
                        {currentStep === steps.length - 1 && (
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded"
                                type="submit"
                            >
                                Submit
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LivraisonForm;


