import React, { useState, useEffect } from 'react';
import LivraisonForm from './Test'; // Adjust the import path as needed
import { fetchClients } from '../../api/clientService'; // Adjust the import path as needed
import { fetchProductsNoPage } from '../../api/productService'; // Adjust the import path as needed
import Dashboard from '../dashboard/Dashboard'; // Adjust the import path as needed


const ParentComponent = () => {
    const [clients, setClients] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [clientsData, productsData] = await Promise.all([fetchClients(1), fetchProductsNoPage()]);
                setClients(clientsData);
                setProducts(productsData);
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
            <Dashboard title="Gestion des Livraisons"/>
                <div className="flex justify-center items-center w-full p-6">
                
                        <LivraisonForm clients={clients} products={products} />
                   
                </div>
           
        </div>
    );
};

export default ParentComponent;