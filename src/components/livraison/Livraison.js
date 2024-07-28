import React, { useEffect, useState, useCallback } from 'react';
import { fetchAllClients } from '../../api/clientService'; // Updated import
import { fetchDrivers } from '../../api/driverService';
import { fetchMagasins } from '../../api/marketService';
import { fetchProductsNoPage } from '../../api/productService';
import { addLivraison, fetchLivraisons, searchLivraisons, deleteLivraison } from '../../api/livraisonService';
import { fetchSectures } from '../../api/sectureService';
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
  const [totalPages, setTotalPages] = useState(1);
  const [filteredLivraisons, setFilteredLivraisons] = useState([]);
  const [livraisons, setLivraisons] = useState([]);
  const [currentLivraison, setCurrentLivraison] = useState(null);
  const [isSearchActive, setIsSearchActive] = useState(false);

  useEffect(() => {
    fetchAllClientsData();
    fetchDriversData();
    fetchMarketsData();
    fetchLivraisonsData();
    fetchProductsData();
    fetchSecteursData();
  }, [currentPage]);

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

  const handleAddLivraison = async (livraisonData) => {
    try {
      livraisonData.status = 'À la livraison';
      await addLivraison(livraisonData);
      fetchLivraisonsData();
      setShowForm(false);
      resetForm();
      toast.success('Livraison ajoutée avec succès!');
    } catch (error) {
      console.error('Error adding livraison', error);
      toast.error('Erreur lors de l\'ajout de la livraison.');
    }
  };

  const handleEditLivraison = async (livraisonData) => {
    try {
      fetchLivraisonsData();
      setShowForm(false);
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
        <ToastContainer />
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
          />
        )}

        <LivraisonTable livraisons={filteredLivraisons} handleDelete={handleDelete} handleModify={handleModify} />

        {!isSearchActive && <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />}
      </div>
    </div>
  );
}

export default Livraison;
