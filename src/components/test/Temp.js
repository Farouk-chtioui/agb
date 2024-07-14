import React, { useState, useEffect } from 'react';
import LivraisonForm from './Test'; // Adjust the import path as needed
import { fetchClients } from '../../api/clientService'; // Adjust the import path as needed
import { fetchProducts } from '../../api/productService'; // Adjust the import path as needed
import { fetchMagasins } from '../../api/marketService'; // Adjust the import path as needed
import { fetchDrivers } from '../../api/driverService'; // Adjust the import path as needed
import Dashboard from '../dashboard/Dashboard'; // Adjust the import path as needed

const ParentComponent = () => {
    const [clients, setClients] = useState([]);
    const [products, setProducts] = useState([]);
    const [markets, setMarkets] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [clientsData, productsData, marketsData, driversData] = await Promise.all([
                    fetchClients(),
                    fetchProducts(),
                    fetchMagasins(),
                    fetchDrivers()
                ]);
                setClients(clientsData);
                setProducts(productsData);
                setMarkets(marketsData);
                setDrivers(driversData);
                setLoading(false);
            } catch (error) {
                console.error('Error loading data', error);
            }
        };

        loadData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex h-screen">
            <Dashboard title="Gestion des Livraisons" />
            <div className="parent-component flex-1 overflow-y-auto">
                <div className="max-w-6xl mx-auto p-4">
                    <LivraisonForm clients={clients} products={products} markets={markets} drivers={drivers} />
                </div>
            </div>
        </div>
    );
};

export default ParentComponent;
