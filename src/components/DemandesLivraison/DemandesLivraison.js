import React, { useState, useEffect } from 'react';
import LivraisonForm from './LivraisonForm';
import ClientForm from '../clients/ClientForm';
import { fetchAllClients, addClient } from '../../api/clientService';
import { fetchProducts } from '../../api/productService';
import { fetchMagasins } from '../../api/marketService';
import { fetchDrivers } from '../../api/driverService';
import { fetchSectures } from '../../api/sectureService';
import { fetchPlans } from '../../api/plansService'; 
import Dashboard from '../dashboard/Dashboard';
import io from 'socket.io-client';
import { toast } from 'react-toastify';

const socket = io('http://localhost:3001');

const DemandesLivraison = () => {
    const [clients, setClients] = useState([]);
    const [products, setProducts] = useState([]);
    const [markets, setMarkets] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [secteurs, setSecteurs] = useState([]);
    const [plans, setPlans] = useState([]); 
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
                const [clientsData, productsData, marketsData, driversData, secteursData, plansData] = await Promise.all([
                    fetchAllClients(),
                    fetchProducts(),
                    fetchMagasins(),
                    fetchDrivers(),
                    fetchSectures(),
                    fetchPlans() 
                ]);
                setClients(clientsData);
                setProducts(productsData);
                setMarkets(marketsData);
                setDrivers(driversData);
                setSecteurs(secteursData);
                setPlans(plansData);
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
            socket.emit('statusChange', { id: addedClient._id, status: 'added' });
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

    const validateLivraison = (newLivraison, clients, plans) => {
        const extractPostalCode = (address) => {
            const match = address.match(/\d{5}/);
            return match ? parseInt(match[0], 10) : null;
        };

        const selectedDate = newLivraison.Date;
        const selectedPeriod = newLivraison.Periode;
        const client = clients.find(client => client._id === newLivraison.client);
        const clientPostalCode = extractPostalCode(client?.code_postal);
        const clientPostalCode2 = extractPostalCode(client?.code_postal2);



        let isClientCodePostalValid = false;
        let isClientCodePostal2Valid = false;
        let planExists = false;

        plans.forEach(plan => {
            if (plan.Date === selectedDate) {
                planExists = true;
                console.log('Matching Plan:', plan);

                if (selectedPeriod === 'Matin' && plan.secteurMatinal) {
                    isClientCodePostalValid = plan.secteurMatinal.some(secteur => secteur.codesPostaux.includes(clientPostalCode));
                    isClientCodePostal2Valid = plan.secteurMatinal.some(secteur => secteur.codesPostaux.includes(clientPostalCode2));
                } else if (selectedPeriod === 'Midi' && plan.secteurApresMidi) {
                    isClientCodePostalValid = plan.secteurApresMidi.some(secteur => secteur.codesPostaux.includes(clientPostalCode));
                    isClientCodePostal2Valid = plan.secteurApresMidi.some(secteur => secteur.codesPostaux.includes(clientPostalCode2));
                }
            }
        });

     

        if (!planExists || (!isClientCodePostalValid && !isClientCodePostal2Valid)) {
            toast.error('Attendez l\'administrateur.');
            newLivraison.status = 'En attente';
            return false; 
        } else {
            newLivraison.status = 'En attente';
            return true; 
        }
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
                        plans={plans} 
                        setShowClientForm={setShowClientForm}
                        validateLivraison={validateLivraison} 
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
