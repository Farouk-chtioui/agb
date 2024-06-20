import React, { useEffect, useState, useCallback } from 'react';
import { fetchClients } from '../../api/clientService';
import { fetchDrivers } from '../../api/driverService';
import { fetchMagasins } from '../../api/marketService';
import { fetchProducts } from '../../api/productService';
import { addLivraison, fetchLivraisons, searchLivraisons } from '../../api/livraisonService';
import LivraisonForm from './LivraisonForm'; // Adjust the path if needed
import LivraisonTable from './LivraisonTable'; // Assuming you have this component
import Search from '../searchbar/Search'; // Assuming you have this component
import Pagination from '../Pagination/Pagination'; // Assuming you have this component
import Dashboard from '../dashboard/Dashboard';

function Livraison() {
  const [clients, setClients] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [products, setProducts] = useState([]);
  const [newLivraison, setNewLivraison] = useState({
    NumeroCommande: '',
    Référence: '',
    part_du_magasin: '',
    Observations: '',
    Date: '',
    Periode: '',
    client: '',
    products: [],
    market: '',
    driver: '',
    status: false,
    quantity: 1,
    Dépôt: false,
    Montage: false,
    Install: false
  });
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredLivraisons, setFilteredLivraisons] = useState([]);
  const [livraisons, setLivraisons] = useState([]);
  const [currentLivraison, setCurrentLivraison] = useState(null);
  const [isSearchActive, setIsSearchActive] = useState(false);

  useEffect(() => {
    fetchClientsData();
    fetchDriversData();
    fetchMarketsData();
    fetchLivraisonsData();
    fetchProductsData();
  }, [currentPage]);

  const fetchClientsData = async () => {
    try {
      const data = await fetchClients();
      setClients(data);
    } catch (error) {
      console.error('Error fetching clients', error);
    }
  };

  const fetchDriversData = async () => {
    try {
      const data = await fetchDrivers();
      setDrivers(data);
    } catch (error) {
      console.error('Error fetching drivers', error);
    }
  };

  const fetchProductsData = async () => {
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products', error);
    }
  };

  const fetchMarketsData = async () => {
    try {
      const data = await fetchMagasins();
      setMarkets(data);
    } catch (error) {
      console.error('Error fetching markets', error);
    }
  };

  const fetchLivraisonsData = async () => {
    try {
      const data = await fetchLivraisons(currentPage);
      setLivraisons(data);
      setFilteredLivraisons(data);
    } catch (error) {
      console.error('Error fetching livraisons', error);
    }
  };

  const handleAddLivraison = async (e) => {
    e.preventDefault();
    console.log('Adding livraison:', newLivraison); // Log to see what data is being sent
    try {
      await addLivraison(newLivraison);
      fetchLivraisonsData();
      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error('Error adding livraison', error);
    }
  };

  const handleEditLivraison = async (e) => {
    e.preventDefault();
    // Implement edit logic here
  };

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'products' || name === 'market' || name === 'driver') {
        // Convert comma-separated string to array of IDs
        const ids = value.split(',').map(id => id.trim());
        setNewLivraison((prevState) => ({
            ...prevState,
            [name]: ids
        }));
    } else if (type === 'checkbox') {
        // Handle checkbox inputs
        setNewLivraison((prevState) => ({
            ...prevState,
            [name]: checked // true or false
        }));
    } else {
        // Handle all other inputs
        setNewLivraison((prevState) => ({
            ...prevState,
            [name]: value
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

  const resetForm = () => {
    setNewLivraison({
      NumeroCommande: '',
      Référence: '',
      part_du_magasin: '',
      Observations: '',
      Date: '',
      Periode: '',
      client: '', 
      products: [],
      market: '', 
      driver: '', 
      status: false,
      quantity: 1,
      Dépôt: false,
      Montage: false,
      Install: false
    });
    setIsEditMode(false);
    setCurrentLivraison(null);
  };

  return (
    <div className="flex">
      <Dashboard />
      <div className="flex-1 container mx-auto p-9 relative mt-20">
        <Search setData={handleSearch} title={"Tout les livraisons"} />
        <button
          className="custom-color2 text-white px-4 py-2 rounded mb-4 absolute top-0 right-0 mt-4 mr-4 shadow hover:bg-blue-600 transition"
          onClick={() => {
            setShowForm(true);
            resetForm();
          }}>
          Ajouter une livraison
        </button>

        {showForm && (
          <LivraisonForm
            newLivraison={newLivraison}
            handleChange={handleChange}
            handleAddLivraison={handleAddLivraison}
            handleEditLivraison={handleEditLivraison}
            setShowForm={setShowForm}
            isEditMode={isEditMode}
            clients={clients}
            markets={markets}
            products={products}
            drivers={drivers}
          />
        )}

        <LivraisonTable livraisons={filteredLivraisons} />

        {!isSearchActive && <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} />}
      </div>
    </div>
  );
}

export default Livraison;
