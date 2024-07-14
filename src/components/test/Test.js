import React, { useState } from 'react';
import { FaClipboardList, FaUser, FaShoppingCart, FaTruck } from 'react-icons/fa';
import { addDemande_de_Livraison } from '../../api/Demandes_de_Livraisons'; // Adjust the import path as needed

const LivraisonForm = ({ clients, products, markets, drivers }) => {
    const [newLivraison, setNewLivraison] = useState({
        NumeroCommande: '',
        Référence: '',
        part_du_magasin: '',
        Observations: '',
        client: '',
        products: [{ productId: '', quantity: 1, Depose: false, Montage: false, Install: false }],
        market: '',
        driver: '',
        Prix: '',
        Date: ''
    });

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
            products: [...prev.products, { productId: '', quantity: 1, Depose: false, Montage: false, Install: false }]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Construct payload with nested objects
            const payload = {
                ...newLivraison,
                client: newLivraison.client || undefined,
                market: newLivraison.market || undefined,
                driver: newLivraison.driver || undefined,
                products: newLivraison.products.map(product => ({
                    ...product,
                    productId: product.productId || undefined
                }))
            };

            const response = await addDemande_de_Livraison(payload);
            console.log('Successfully submitted:', response.data);
        } catch (error) {
            console.error('Error submitting data:', error.response ? error.response.data : error.message);
        }
    };

    const scrollToSection = (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="p-8 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-center mb-6">Demandes de Livraisons</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="col-span-1">
                    <div
                        onClick={() => scrollToSection('informations-generales')}
                        className="bg-gray-100 p-4 rounded-lg mb-4 flex items-center cursor-pointer"
                    >
                        <FaClipboardList className="mr-2 text-blue-500" />
                        <h3 className="font-semibold">Informations Générales</h3>
                    </div>
                    <div
                        onClick={() => scrollToSection('client')}
                        className="bg-gray-100 p-4 rounded-lg mb-4 flex items-center cursor-pointer"
                    >
                        <FaUser className="mr-2 text-green-500" />
                        <h3 className="font-semibold">Client</h3>
                    </div>
                    <div
                        onClick={() => scrollToSection('produits')}
                        className="bg-gray-100 p-4 rounded-lg mb-4 flex items-center cursor-pointer"
                    >
                        <FaShoppingCart className="mr-2 text-blue-500" />
                        <h3 className="font-semibold">Produits de la Commande</h3>
                    </div>
                    <div
                        onClick={() => scrollToSection('date')}
                        className="bg-gray-100 p-4 rounded-lg flex items-center cursor-pointer"
                    >
                        <FaTruck className="mr-2 text-pink-500" />
                        <h3 className="font-semibold">Date de la Livraison</h3>
                    </div>
                </div>
                <div className="col-span-3 space-y-8">
                    <form onSubmit={handleSubmit}>
                        <div id="informations-generales" className="mb-6">
                            <h3 className="text-xl font-semibold mb-4">Informations Générales</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700">N° de la Commande</label>
                                    <input
                                        type="text"
                                        name="NumeroCommande"
                                        value={newLivraison.NumeroCommande}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Référence </label>
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

                        <div id="client" className="mb-6">
                            <h3 className="text-xl font-semibold mb-4">Client</h3>
                            <label className="block text-gray-700">Ajouter un client</label>
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
                        </div>

                        <div id="produits" className="mb-6">
                            <h3 className="text-xl font-semibold mb-4">Produits de la Commande</h3>
                            {newLivraison.products.map((product, index) => (
                                <div key={index} className="mb-4">
                                    <label className="block text-gray-700">Article</label>
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
                                        placeholder="Quantité"
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 mb-2"
                                    />
                                    <div className="flex items-center space-x-4">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={product.Depose}
                                                onChange={() => handleCheckboxChange(index, 'Depose')}
                                                className="mr-2"
                                            />
                                            Depose
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

                        <div id="market" className="mb-6">
                            <h3 className="text-xl font-semibold mb-4">Market</h3>
                            <label className="block text-gray-700">Choisir un Market</label>
                            <select
                                name="market"
                                value={newLivraison.market}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                            >
                                <option value="">Choisir un Market</option>
                                {markets.map((market) => (
                                    <option key={market._id} value={market._id}>
                                        {market.first_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div id="driver" className="mb-6">
                            <h3 className="text-xl font-semibold mb-4">Driver</h3>
                            <label className="block text-gray-700">Choisir un Driver</label>
                            <select
                                name="driver"
                                value={newLivraison.driver}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                            >
                                <option value="">Choisir un Driver</option>
                                {drivers.map((driver) => (
                                    <option key={driver._id} value={driver._id}>
                                        {driver.first_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div id="date" className="mb-6">
                            <h3 className="text-xl font-semibold mb-4">Date de la Livraison</h3>
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
                            <label className="block text-gray-700">Date de la livraison</label>
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
                            className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-700 transition duration-200"
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
