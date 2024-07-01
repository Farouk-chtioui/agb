import React, { useEffect, useState, useCallback } from 'react';
import { fetchClients } from '../../api/clientService';
import { fetchDrivers } from '../../api/driverService';
import { fetchMagasins } from '../../api/marketService';
import { fetchProductsNoPage } from '../../api/productService';
import { addLivraison, fetchLivraisons, searchLivraisons, deleteLivraison } from '../../api/livraisonService';
import LivraisonForm from './LivraisonForm';
import LivraisonTable from './LivraisonTable';
import Search from '../searchbar/Search';
import Pagination from '../Pagination/Pagination';
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
      const data = await fetchProductsNoPage();
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

  const handleAddLivraison = async (livraisonData) => {
    try {
      livraisonData.status = 'En attente'; // Ensure status is set
      await addLivraison(livraisonData);
      fetchLivraisonsData();
      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error('Error adding livraison', error);
    }
  };

  const handleEditLivraison = async (livraisonData) => {
    try {
      // Implement the edit logic here, for example:
      // await editLivraison(livraisonData.id, livraisonData);
      fetchLivraisonsData();
      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error('Error editing livraison', error);
    }
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
    try {
      await deleteLivraison(id);
      fetchLivraisonsData();
    } catch (error) {
      console.error('Error deleting livraison', error);
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
    });
    setIsEditMode(false);
    setCurrentLivraison(null);
  };

  return (
    <div className="flex">
      <Dashboard />
      <div className="flex-1 container mx-auto p-9 relative mt-20">
        <Search setData={handleSearch} title={'Tout les livraisons'} />
        <button
          className="custom-color2 text-white px-4 py-2 rounded mb-4 absolute top-0 right-0 mt-4 mr-4 shadow hover:bg-blue-600 transition"
          onClick={() => {
            setShowForm(true);
            resetForm();
          }}
        >
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

        <LivraisonTable livraisons={filteredLivraisons} handleDelete={handleDelete} handleModify={setCurrentLivraison} />

        {!isSearchActive && <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} />}
      </div>
    </div>
  );
}

export default Livraison;
