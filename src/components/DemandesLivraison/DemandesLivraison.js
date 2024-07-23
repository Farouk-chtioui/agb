import React, { useState, useEffect } from 'react';
import LivraisonForm from './LivraisonForm';
import ClientForm from '../clients/ClientForm'; 
import { fetchClients, addClient } from '../../api/clientService';
import { fetchProducts } from '../../api/productService';
import { fetchMagasins } from '../../api/marketService';
import { fetchDrivers } from '../../api/driverService';
import { fetchSectures } from '../../api/sectureService'; 
import Dashboard from '../dashboard/Dashboard';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

const DemandesLivraison = () => {
    const [clients, setClients] = useState([]);
    const [products, setProducts] = useState([]);
    const [markets, setMarkets] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [secteurs, setSecteurs] = useState([]); 
    const [loading, setLoading] = useState(true);
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

    const handleAddClient = async (e) => {
        e.preventDefault();
        try {
            const addedClient = await addClient(newClient);
            setClients([...clients, addedClient]);
            setShowClientForm(false);
            setNewClient({
                first_name: '',
                last_name: '',
                address1: '',
                code_postal: '',
                address2: '',
                code_postal2: '',
                phone: ''
            });
            socket.emit('statusChange', { id: addedClient._id, status: 'added' }); // Emit WebSocket event after adding client
        } catch (error) {
            console.error('Error adding client', error);
        }
    };

    const handleClientChange = (e) => {
        const { name, value } = e.target;
        setNewClient((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex h-screen bg-white-100">
            <Dashboard title="Gestion des Livraisons" />
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-6xl mx-auto p-8">
                    <LivraisonForm 
                        clients={clients} 
                        products={products} 
                        secteurs={secteurs} 
                        setShowClientForm={setShowClientForm}
                    />
                    {showClientForm && (
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white p-10 rounded-2xl shadow-lg custom-width h-auto max-h-screen overflow-auto">
                                <ClientForm
                                    newClient={newClient}
                                    handleChange={handleClientChange}
                                    handleAddClient={handleAddClient}
                                    setShowForm={setShowClientForm}
                                    isEditMode={false}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DemandesLivraison;
