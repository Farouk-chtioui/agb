import React, { useState, useEffect } from 'react';
import LivraisonForm from './LivraisonForm';
import { fetchClients } from '../../api/clientService';
import { fetchProducts } from '../../api/productService';
import { fetchMagasins } from '../../api/marketService';
import { fetchDrivers } from '../../api/driverService';
import { fetchSectures } from '../../api/sectureService'; // Import fetchSecteurs
import Dashboard from '../dashboard/Dashboard';

const DemandesLivraison = () => {
    const [clients, setClients] = useState([]);
    const [products, setProducts] = useState([]);
    const [markets, setMarkets] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [secteurs, setSecteurs] = useState([]); // Add secteurs state
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [clientsData, productsData, marketsData, driversData, secteursData] = await Promise.all([
                    fetchClients(),
                    fetchProducts(),
                    fetchMagasins(),
                    fetchDrivers(),
                    fetchSectures() // Fetch secteurs data
                ]);
                setClients(clientsData);
                setProducts(productsData);
                setMarkets(marketsData);
                setDrivers(driversData);
                setSecteurs(secteursData); // Set secteurs data
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
        <div className="flex h-screen bg-white-100">
            <Dashboard title="Gestion des Livraisons" />
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-6xl mx-auto p-8">
                    <LivraisonForm clients={clients} products={products} secteurs={secteurs} />
                </div>
            </div>
        </div>
    );
};

export default DemandesLivraison;
