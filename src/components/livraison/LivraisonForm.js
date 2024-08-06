import React, { useState, useEffect } from "react";
import ClientForm from '../clients/ClientForm';
import { addClient } from "../../api/clientService";
import { toast } from 'react-toastify';
import './style.css';

const LivraisonForm = ({
    newLivraison,
    setNewLivraison,
    handleChange,
    handleAddLivraison,
    handleEditLivraison,
    setShowForm,
    isEditMode,
    clients,
    markets,
    products,
    drivers,
    secteurs = [],
    currentLivraison,
    plans // Pass plans as a prop
}) => {
    const [productList, setProductList] = useState(newLivraison.products.length > 0 ? newLivraison.products : [{ productId: '', quantity: 1, Dépôt: false, Montage: false, Install: false }]);
    const [currentStep, setCurrentStep] = useState(0);
    const [showClientForm, setShowClientForm] = useState(false);
    const [newClient, setNewClient] = useState({
        first_name: '',
        last_name: '',
        address1: '',
        code_postal: '',
        address2: '',
        code_postal2: '',
        phone: ''
    });
    const [clientCodePostal, setClientCodePostal] = useState('');
    const [clientCodePostal2, setClientCodePostal2] = useState('');

    useEffect(() => {
        if (isEditMode && currentLivraison) {
            setProductList(currentLivraison.products.length > 0 ? currentLivraison.products : [{ productId: '', quantity: 1, Dépôt: false, Montage: false, Install: false }]);
        }
    }, [currentLivraison, isEditMode]);

    useEffect(() => {
        if (newLivraison.client) {
            const selectedClient = clients.find(client => client._id === newLivraison.client);
            if (selectedClient) {
                setClientCodePostal(selectedClient.code_postal);
                setClientCodePostal2(selectedClient.code_postal2);
            }
        }
    }, [newLivraison.client, clients]);

    useEffect(() => {
        console.log('Plans in LivraisonForm:', plans); // Log plans data in LivraisonForm
    }, [plans]);

    const extractPostalCode = (address) => {
        const match = address.match(/\d{5}/);
        return match ? parseInt(match[0], 10) : null;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newLivraison.NumeroCommande || !newLivraison.Référence || !newLivraison.client || !newLivraison.Date) {
            toast.error('Veuillez remplir tous les champs obligatoires.');
            return;
        }

        const selectedDate = newLivraison.Date;
        const selectedPeriod = newLivraison.Periode;
        const clientPostalCode = extractPostalCode(clientCodePostal);

        let isClientCodePostalValid = false;
        let planExists = false;

        plans.forEach(plan => {
            if (plan.Date === selectedDate) {
                planExists = true;
                if (selectedPeriod === 'Matin' && plan.secteurMatinal) {
                    isClientCodePostalValid = plan.secteurMatinal.some(secteur => secteur.codesPostaux.includes(clientPostalCode));
                } else if (selectedPeriod === 'Midi' && plan.secteurApresMidi) {
                    isClientCodePostalValid = plan.secteurApresMidi.some(secteur => secteur.codesPostaux.includes(clientPostalCode));
                }
            }
        });

        if (!planExists) {
            newLivraison.status = 'En attente';
        } else if (!isClientCodePostalValid) {
            toast.error('Le code postal du client ne fait pas partie des secteurs disponibles.');
            return;
        } else {
            newLivraison.status = 'À la livraison';
        }

        const livraisonData = { ...newLivraison, products: productList };
        if (isEditMode) {
            handleEditLivraison(livraisonData);
        } else {
            handleAddLivraison(livraisonData);
        }
        setShowForm(false);
    };

    const handleClientAdd = async () => {
        try {
            const addedClient = await addClient(newClient);
            clients.push(addedClient);
            setShowClientForm(false);
            setNewLivraison((prevState) => ({
                ...prevState,
                client: addedClient._id
            }));
            toast.success('Client ajouté avec succès!');
        } catch (error) {
            console.error('Error adding client:', error);
            toast.error('Erreur lors de l\'ajout du client.');
        }
    };

    const handleClientChange = (e) => {
        const { name, value } = e.target;
        setNewClient(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const addProduct = () => {
        setProductList([...productList, { productId: '', quantity: 1, Dépôt: false, Montage: false, Install: false }]);
    };

    const handleProductChange = (index, field, value) => {
        const newProducts = [...productList];
        newProducts[index][field] = field === 'quantity' ? parseInt(value, 10) : value;
        setProductList(newProducts);
    };

    const steps = [
        'Informations Générales',
        'Client',
        'Produits de la commande',
        'Chauffeur & Livraison'
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
            <div className="bg-white p-10 rounded-2xl shadow-lg custom-width h-auto max-h-screen overflow-auto">
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
                <div className="mb-6">
                    <div className="flex justify-between items-center steps-container">
                        {steps.map((step, index) => (
                            <React.Fragment key={index}>
                                <div className={`step-item ${index <= currentStep ? 'active' : ''}`}>
                                    <div className="step-number">{index + 1}</div>
                                    <div className={`step-title ${index <= currentStep ? 'active' : ''}`}>{step}</div>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`step-line ${index < currentStep ? 'active' : ''}`}></div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
                <div className="scrollable-form-content">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {currentStep === 0 && (
                            <>
                                <div className="flex space-x-4">
                                    <div className="form-group flex-1">
                                        <label className="block text-blue-700 mb-2" htmlFor="NumeroCommande">N° Commande</label>
                                        <input
                                            className="border rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 border-blue-600"
                                            type="text"
                                            name="NumeroCommande"
                                            value={newLivraison.NumeroCommande || ''}
                                            onChange={handleChange}
                                            placeholder="0000000000"
                                        />
                                    </div>
                                    <div className="form-group flex-1">
                                        <label className="block text-blue-700 mb-2" htmlFor="Référence">Référence</label>
                                        <input
                                            className="border rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 border-blue-600"
                                            type="text"
                                            name="Référence"
                                            value={newLivraison.Référence || ''}
                                            onChange={handleChange}
                                            placeholder="0000000000"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="block text-blue-700 mb-2" htmlFor="part_du_magasin">A régler de la part du magasin</label>
                                    <input
                                        className="border rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 border-blue-600"
                                        type="text"
                                        name="part_du_magasin"
                                        value={newLivraison.part_du_magasin || ''}
                                        onChange={handleChange}
                                        placeholder="32.123"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="block text-blue-700 mb-2" htmlFor="Observations">Observation</label>
                                    <textarea
                                        className="border rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 border-blue-600"
                                        name="Observations"
                                        value={newLivraison.Observations || ''}
                                        onChange={handleChange}
                                        placeholder="Message"
                                    ></textarea>
                                </div>
                                <div className="flex space-x-4">
                                    <div className="form-group flex-1">
                                        <label className="block text-blue-700 mb-2" htmlFor="Date">Date de la livraison</label>
                                        <input
                                            className="border rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 border-blue-600"
                                            type="date"
                                            name="Date"
                                            value={newLivraison.Date || ''}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group flex-1">
                                        <label className="block text-blue-700 mb-2">Période</label>
                                        <div className="flex space-x-1">
                                            <button
                                                type="button"
                                                className={`border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 ${newLivraison.Periode === 'Matin' ? 'bg-blue-500 text-white' : 'bg-white border-blue-600'}`}
                                                onClick={() => handleChange({ target: { name: 'Periode', value: 'Matin' } })}
                                            >
                                                Matin
                                            </button>
                                            <button
                                                type="button"
                                                className={`border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 ${newLivraison.Periode === 'Midi' ? 'bg-blue-500 text-white' : 'bg-white border-blue-600'}`}
                                                onClick={() => handleChange({ target: { name: 'Periode', value: 'Midi' } })}
                                            >
                                                Midi
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                        {currentStep === 1 && (
                            <div className="form-group">
                                <label className="block text-blue-700 mb-2" htmlFor="client">Client</label>
                                <select
                                    className="border rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 border-blue-600"
                                    name="client"
                                    value={newLivraison.client || ''}
                                    onChange={handleChange}
                                >
                                    <option value="">Select a client</option>
                                    {clients.map(client => (
                                        <option key={client._id} value={client._id}>
                                            {client.first_name}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                                    onClick={() => setShowClientForm(true)}
                                >
                                    Ajouter un client
                                </button>
                            </div>
                        )}
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
                                            onChange={(e) => handleProductChange(index, 'quantity', parseInt(e.target.value, 10))}
                                        />
                                        <div className="flex space-x-1">
                                            <button
                                                type="button"
                                                className={`border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 ${product.Dépôt ? 'bg-blue-500 text-white' : 'bg-white border-blue-600'}`}
                                                onClick={() => handleProductChange(index, 'Dépôt', !product.Dépôt)}
                                            >
                                                Dépôt
                                            </button>
                                            <button
                                                type="button"
                                                className={`border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 ${product.Montage ? 'bg-blue-500 text-white' : 'bg-white border-blue-600'}`}
                                                onClick={() => handleProductChange(index, 'Montage', !product.Montage)}
                                            >
                                                Montage
                                            </button>
                                            <button
                                                type="button"
                                                className={`border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 ${product.Install ? 'bg-blue-500 text-white' : 'bg-white border-blue-600'}`}
                                                onClick={() => handleProductChange(index, 'Install', !product.Install)}
                                            >
                                                Installation
                                            </button>
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
                        {currentStep === 3 && (
                            <>
                                <div className="form-group">
                                    <label className="block text-blue-700 mb-2" htmlFor="market">Market</label>
                                    <select
                                        className="border rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 border-blue-600"
                                        name="market"
                                        value={newLivraison.market || ''}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select a market</option>
                                        {markets.map(market => (
                                            <option key={market._id} value={market._id}>
                                                {market.first_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="block text-blue-700 mb-2" htmlFor="driver">Driver</label>
                                    <select
                                        className="border rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 border-blue-600"
                                        name="driver"
                                        value={newLivraison.driver || ''}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select a driver</option>
                                        {drivers.map(driver => (
                                            <option key={driver._id} value={driver._id}>
                                                {driver.first_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
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
                                    className="bg-blue-500 text-white px-4 py-2 rounded mx-auto"
                                    onClick={nextStep}
                                >
                                    Suivant
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
                {showClientForm && (
                    <ClientForm
                        newClient={newClient}
                        handleChange={handleClientChange}
                        handleAddClient={handleClientAdd}
                        setShowForm={setShowClientForm}
                        isEditMode={false}
                    />
                )}
            </div>
        </div>
    );
};

export default LivraisonForm;
