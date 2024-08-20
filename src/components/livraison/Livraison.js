import React, { useEffect, useState, useCallback } from 'react';
import { fetchAllClients, addClient } from '../../api/clientService';
import { fetchDrivers } from '../../api/driverService';
import { fetchMagasins, decreaseMarketTotals } from '../../api/marketService';
import { fetchProductsNoPage } from '../../api/productService';
import { addLivraison, fetchLivraisons, searchLivraisons, deleteLivraison } from '../../api/livraisonService';
import { fetchSectures } from '../../api/sectureService';
import { fetchPlans, decreasePlanTotals } from '../../api/plansService';
import LivraisonForm from './LivraisonForm';
import LivraisonTable from './LivraisonTable';
import Search from '../searchbar/Search';
import Pagination from '../Pagination/Pagination';
import Dashboard from '../dashboard/Dashboard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Livraison() {
    const [clients, setClients] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [markets, setMarkets] = useState([]);
    const [products, setProducts] = useState([]);
    const [secteurs, setSecteurs] = useState([]);
    const [plans, setPlans] = useState([]);
    const [newLivraison, setNewLivraison] = useState({
        NumeroCommande: '',
        reference: '',
        part_du_magasin: '',
        Observations: '',
        Date: '',
        Periode: '',
        client: '',
        products: [],
        market: '',
        driver: '',
        price: ''
    });
    const [showForm, setShowForm] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filteredLivraisons, setFilteredLivraisons] = useState([]);
    const [livraisons, setLivraisons] = useState([]);
    const [currentLivraison, setCurrentLivraison] = useState(null);
    const [isSearchActive, setIsSearchActive] = useState(false);

    const fetchAllData = useCallback(async () => {
        await Promise.all([
            fetchAllClientsData(),
            fetchDriversData(),
            fetchMarketsData(),
            fetchProductsData(),
            fetchSecteursData(),
            fetchPlansData(),
            fetchLivraisonsData()
        ]);
    }, [currentPage]);

    useEffect(() => {
        fetchAllData();
    }, [currentPage, fetchAllData]);

    const fetchAllClientsData = async () => {
        try {
            const data = await fetchAllClients();
            setClients(data);
        } catch (error) {
            console.error('Error fetching clients', error);
        }
    };

    const fetchDriversData = async () => {
        try {
            const data = await fetchDrivers();
            setDrivers(Array.isArray(data.drivers) ? data.drivers : []);
        } catch (error) {
            console.error('Error fetching drivers', error);
            setDrivers([]);
        }
    };

    const fetchProductsData = async () => {
        try {
            const data = await fetchProductsNoPage();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products', error);
        }
    };

    const fetchMarketsData = async () => {
        try {
            const data = await fetchMagasins();
            setMarkets(Array.isArray(data.markets) ? data.markets : []);
        } catch (error) {
            console.error('Error fetching markets', error);
        }
    };

    const fetchLivraisonsData = async () => {
        try {
            const { livraisons, totalPages } = await fetchLivraisons(currentPage);
            setLivraisons(livraisons);
            setTotalPages(totalPages);
            setFilteredLivraisons(livraisons);
        } catch (error) {
            console.error('Error fetching livraisons', error);
        }
    };

    const fetchSecteursData = async () => {
        try {
            const data = await fetchSectures();
            setSecteurs(data);
        } catch (error) {
            console.error('Error fetching secteurs', error);
        }
    };

    const fetchPlansData = async () => {
        try {
            const data = await fetchPlans();
            setPlans(data);
        } catch (error) {
            console.error('Error fetching plans', error);
        }
    };

    const handleAddLivraison = async (livraisonData) => {
        try {
            await addLivraison(livraisonData);
            fetchLivraisonsData();
            resetForm();
            toast.success('Livraison ajoutée avec succès!');

            // Decrease totals for the selected market and plans
            const selectedPlan = plans.find(plan => plan.Date === livraisonData.Date);
            if (selectedPlan) {
                await decreasePlanTotals(selectedPlan._id, livraisonData.Periode);
                await decreaseMarketTotals(livraisonData.market, livraisonData.Periode);
            }
        } catch (error) {
            console.error('Error adding livraison', error);
            toast.error('Erreur lors de l\'ajout de la livraison.');
        }
    };

    const handleEditLivraison = async (livraisonData) => {
        try {
            fetchLivraisonsData();
            resetForm();
            toast.success('Livraison modifiée avec succès!');
        } catch (error) {
            console.error('Error editing livraison', error);
            toast.error('Erreur lors de la modification de la livraison.');
        }
    };

    const handleModify = (livraison) => {
        setCurrentLivraison(livraison);
        setNewLivraison(livraison);
        setIsEditMode(true);
        setShowForm(true);
    };

    const handleChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;

        if (name === 'products') {
            const ids = value.split(',').map((id) => id.trim());
            const updatedProducts = ids.map(productId => ({
                productId,
                quantity: 0,
                Dépôt: false,
                Montage: false,
                Install: false
            }));
            setNewLivraison((prevState) => ({
                ...prevState,
                [name]: updatedProducts,
            }));
        } else if (type === 'checkbox') {
            setNewLivraison((prevState) => ({
                ...prevState,
                [name]: checked,
            }));
        } else if (type === 'number') {
            setNewLivraison((prevState) => ({
                ...prevState,
                [name]: parseInt(value, 10),
            }));
        } else {
            setNewLivraison((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }
    }, []);
    
    const handleSearch = async (searchTerm) => {
        if (searchTerm === '') {
            setFilteredLivraisons(livraisons);
            setIsSearchActive(false);
        } else {
            try {
                const response = await searchLivraisons(searchTerm);
                setFilteredLivraisons(response);
                setIsSearchActive(true);
            } catch (error) {
                console.error('Error searching livraisons', error);
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette livraison?')) {
            try {
                await deleteLivraison(id);
                fetchLivraisonsData();
                toast.success('Livraison supprimée avec succès!');
            } catch (error) {
                console.error('Error deleting livraison', error);
                toast.error('Erreur lors de la suppression de la livraison.');
            }
        }
    };

    const resetForm = () => {
        setNewLivraison({
            NumeroCommande: '',
            reference: '',
            part_du_magasin: '',
            Observations: '',
            Date: '',
            Periode: '',
            client: '',
            products: [],
            market: '',
            driver: '',
            price: ''
        });
        setIsEditMode(false);
        setCurrentLivraison(null);
    };

    return (
        <div className="flex">
            <Dashboard />
            <div className="flex-1 container mx-auto p-9 relative mt-20">
                <ToastContainer />
                <Search setData={handleSearch} title={"Toutes les livraisons"} />
                <button
                    className="custom-color2 text-white px-4 py-2 rounded mb-4 absolute top-0 right-0 mt-4 mr-4 shadow hover:bg-blue-600 transition"
                    onClick={() => {
                        setShowForm(true);
                        setIsEditMode(false);
                        resetForm();
                    }}
                >
                    Ajouter une livraison
                </button>
                {showForm && (
                    <LivraisonForm
                        newLivraison={newLivraison}
                        setNewLivraison={setNewLivraison}
                        handleChange={handleChange}
                        handleAddLivraison={handleAddLivraison}
                        handleEditLivraison={handleEditLivraison}
                        setShowForm={setShowForm}
                        isEditMode={isEditMode}
                        clients={clients}
                        markets={markets}
                        products={products}
                        drivers={drivers}
                        secteurs={secteurs}
                        currentLivraison={currentLivraison}
                        plans={plans}
                    />
                )}
                <LivraisonTable
                    livraisons={isSearchActive ? filteredLivraisons : livraisons}
                    handleModify={handleModify}
                    handleDelete={handleDelete}
                />
                {!isSearchActive && (
                    <Pagination
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        totalPages={totalPages}
                    />
                )}
            </div>
        </div>
    );
}

export default Livraison;
