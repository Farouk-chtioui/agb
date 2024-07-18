import React, { useState, useEffect } from 'react';
import { FaClipboardList, FaUser, FaShoppingCart, FaTruck } from 'react-icons/fa';
import { addLivraison } from '../../api/livraisonService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LivraisonForm = ({ clients, products, secteurs, setShowClientForm }) => {
    const [newLivraison, setNewLivraison] = useState({
        NumeroCommande: '',
        Référence: '',
        part_du_magasin: '',
        Observations: '',
        client: '',
        products: [{ productId: '', quantity: 1, Dépôt: false, Montage: false, Install: false }],
        market: '',
        driver: '',
        Prix: '',
        Date: ''
    });

    const [clientCodePostal, setClientCodePostal] = useState('');

    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        const role = localStorage.getItem('role');
        const userId = localStorage.getItem('userId');
        if (role === 'market' && userId) {
            setNewLivraison((prev) => ({
                ...prev,
                market: userId
            }));
        }
    }, []);

    useEffect(() => {
        if (newLivraison.client) {
            const selectedClient = clients.find(client => client._id === newLivraison.client);
            if (selectedClient) {
                setClientCodePostal(selectedClient.code_postal);
            }
        }
    }, [newLivraison.client, clients]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewLivraison((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleProductChange = (index, field, value) => {
        const newProducts = [...newLivraison.products];
        newProducts[index][field] = field === 'quantity' ? parseInt(value, 10) : value;
        setNewLivraison((prev) => ({
            ...prev,
            products: newProducts
        }));
    };

    const handleCheckboxChange = (index, field) => {
        const newProducts = [...newLivraison.products];
        newProducts[index][field] = !newProducts[index][field];
        setNewLivraison((prev) => ({
            ...prev,
            products: newProducts
        }));
    };

    const addProduct = () => {
        setNewLivraison((prev) => ({
            ...prev,
            products: [...prev.products, { productId: '', quantity: 1, Dépôt: false, Montage: false, Install: false }]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newLivraison.NumeroCommande || !newLivraison.Référence || !newLivraison.client || !newLivraison.Date) {
            toast.error('Veuillez remplir tous les champs obligatoires.');
            return;
        }

        // Check if the client's code_postal is in the secteurs list
        const isCodePostalValid = secteurs.some(secteur => secteur.codesPostaux.includes(parseInt(clientCodePostal)));
        if (!isCodePostalValid) {
            toast.error('Le code postal du client ne fait pas partie des secteurs disponibles.');
            return;
        }

        try {
            const payload = {
                ...newLivraison,
                client: newLivraison.client || undefined,
                products: newLivraison.products.map(product => ({
                    ...product,
                    productId: product.productId || undefined
                })),
            };

            if (!newLivraison.driver) {
                delete payload.driver;
            }

            const response = await addLivraison(payload);
            console.log('Successfully submitted:', response.data);
            toast.success('Livraison soumise avec succès!');
        } catch (error) {
            console.error('Error submitting data:', error.response ? error.response.data : error.message);
            toast.error('Erreur lors de la soumission de la livraison.');
        }
    };

    const scrollToSection = (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <ToastContainer />
            <h2 className="text-3xl font-semibold text-center mb-8 text-blue-600">Demandes de Livraisons</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="col-span-1 space-y-4">
                    <div
                        onClick={() => scrollToSection('informations-generales')}
                        className="bg-blue-50 p-4 rounded-lg flex items-center cursor-pointer hover:bg-blue-100 transition"
                    >
                        <FaClipboardList className="mr-2 text-blue-500" />
                        <h3 className="font-semibold text-blue-600">Informations Générales</h3>
                    </div>
                    <div
                        onClick={() => scrollToSection('client')}
                        className="bg-blue-50 p-4 rounded-lg flex items-center cursor-pointer hover:bg-blue-100 transition"
                    >
                        <FaUser className="mr-2 text-blue-500" />
                        <h3 className="font-semibold text-blue-600">Client</h3>
                    </div>
                    <div
                        onClick={() => scrollToSection('produits')}
                        className="bg-blue-50 p-4 rounded-lg flex items-center cursor-pointer hover:bg-blue-100 transition"
                    >
                        <FaShoppingCart className="mr-2 text-blue-500" />
                        <h3 className="font-semibold text-blue-600">Produits de la Commande</h3>
                    </div>
                    <div
                        onClick={() => scrollToSection('date')}
                        className="bg-blue-50 p-4 rounded-lg flex items-center cursor-pointer hover:bg-blue-100 transition"
                    >
                        <FaTruck className="mr-2 text-blue-500" />
                        <h3 className="font-semibold text-blue-600">Date de la Livraison</h3>
                    </div>
                </div>
                <div className="col-span-3 space-y-8">
                    <form onSubmit={handleSubmit}>
                        <div id="informations-generales" className="mb-8">
                            <h3 className="text-xl font-semibold mb-4 text-blue-600">Informations Générales</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-700">N° de la Commande*</label>
                                    <input
                                        type="text"
                                        name="NumeroCommande"
                                        value={newLivraison.NumeroCommande}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Référence*</label>
                                    <input
                                        type="text"
                                        name="Référence"
                                        value={newLivraison.Référence}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="block text-gray-700">Règlement de la Commande</label>
                                <input
                                    type="text"
                                    name="part_du_magasin"
                                    value={newLivraison.part_du_magasin}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                                />
                            </div>
                            <div className="mt-4">
                                <label className="block text-gray-700">Observation de la Commande</label>
                                <textarea
                                    name="Observations"
                                    value={newLivraison.Observations}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                                ></textarea>
                            </div>
                        </div>

                        <div id="client" className="mb-8">
                            <h3 className="text-xl font-semibold mb-4 text-blue-600">Client</h3>
                            <label className="block text-gray-700">Ajouter un client *</label>
                            <div className="flex items-center">
                                <select
                                    name="client"
                                    value={newLivraison.client}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                                >
                                    <option value="">Choisir un Client</option>
                                    {clients.map((client) => (
                                        <option key={client._id} value={client._id}>
                                            {client.first_name}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
                                    onClick={() => setShowClientForm(true)}
                                >
                                    Ajouter
                                </button>
                            </div>
                        </div>

                        <div id="produits" className="mb-8">
                            <h3 className="text-xl font-semibold mb-4 text-blue-600">Produits de la Commande</h3>
                            {newLivraison.products.map((product, index) => (
                                <div key={index} className="mb-4">
                                    <label className="block text-gray-700">Article *</label>
                                    <select
                                        name="productId"
                                        value={product.productId}
                                        onChange={(e) => handleProductChange(index, 'productId', e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 mb-2"
                                    >
                                        <option value="">Select Product</option>
                                        {products.map((prod) => (
                                            <option key={prod._id} value={prod._id}>
                                                {prod.name}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={product.quantity}
                                        onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                                        placeholder="Quantité *"
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 mb-2"
                                    />
                                    <div className="flex items-center space-x-4">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={product.Dépôt}
                                                onChange={() => handleCheckboxChange(index, 'Dépôt')}
                                                className="mr-2"
                                            />
                                            Dépôt
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={product.Montage}
                                                onChange={() => handleCheckboxChange(index, 'Montage')}
                                                className="mr-2"
                                            />
                                            Montage
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={product.Install}
                                                onChange={() => handleCheckboxChange(index, 'Install')}
                                                className="mr-2"
                                            />
                                            Install
                                        </label>
                                    </div>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addProduct}
                                className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                            >
                                Ajouter un produit
                            </button>
                        </div>

                        <div id="date" className="mb-8">
                            <h3 className="text-xl font-semibold mb-4 text-blue-600">Date de la Livraison</h3>
                            <label className="block text-gray-700">Prix de la livraison (Le prix est calculé automatiquement)</label>
                            <input
                                type="text"
                                name="Prix"
                                value={newLivraison.Prix}
                                readOnly
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 mb-2"
                            />
                            <button
                                type="button"
                                onClick={() => console.log('Calculating price...')}
                                className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition duration-200 mb-4"
                            >
                                Calculez le prix
                            </button>
                            <label className="block text-gray-700">Date de la livraison*</label>
                            <input
                                type="date"
                                name="Date"
                                value={newLivraison.Date}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 mb-2"
                            />
                            <p className="text-sm text-gray-500">
                                Le secteur du client n'est pas planifié. La date peut être changée.
                            </p>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                        >
                            Valider
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LivraisonForm;
