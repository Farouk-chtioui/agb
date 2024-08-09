import React, { useState, useEffect, useCallback } from 'react';
import { fetchLivraisons, modifyDriver } from '../../api/livraisonService';
import { fetchDrivers } from '../../api/driverService';
import Livraison1Form from './FicheDeRouteForm';
import Livraison1Table from './FicheDeRouteTable';
import Dashboard from '../dashboard/Dashboard';
import { ToastContainer, toast } from 'react-toastify';
import Search from '../searchbar/Search';
import Pagination from '../Pagination/Pagination';
import 'react-toastify/dist/ReactToastify.css';

const FicheDeRoute = () => {
  const [livraisons, setLivraisons] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [selectedLivraison, setSelectedLivraison] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [filteredLivraisons, setFilteredLivraisons] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getLivraisons = useCallback(async () => {
    try {
      const data = await fetchLivraisons(currentPage);
      setLivraisons(data.livraisons.filter(l => !l.driver));
      setTotalPages(Math.ceil(data.total / 10)); // Assuming 10 items per page
    } catch (error) {
      toast.error('Error fetching livraisons');
    }
  }, [currentPage]);

  const getDrivers = useCallback(async () => {
    try {
      const data = await fetchDrivers();
      setDrivers(data.drivers);
    } catch (error) {
      toast.error('Error fetching drivers');
    }
  }, []);

  useEffect(() => {
    getLivraisons();
    getDrivers();
  }, [getLivraisons, getDrivers]);

  const handleSearch = (searchTerm) => {
    if (searchTerm) {
      setIsSearchActive(true);
      const filtered = livraisons.filter(livraison =>
        livraison.NumeroCommande.includes(searchTerm) ||
        livraison.Référence.includes(searchTerm) ||
        livraison.client.first_name.includes(searchTerm) ||
        livraison.market.first_name.includes(searchTerm)
      );
      setFilteredLivraisons(filtered);
    } else {
      setIsSearchActive(false);
      setFilteredLivraisons([]);
    }
  };

  const handleAssignDriver = (livraison) => {
    setSelectedLivraison(livraison);
    setShowForm(true);
  };

  const handleDriverSubmit = async (driverId) => {
    if (!selectedLivraison) {
      toast.error('No livraison selected');
      return;
    }

    try {
      await modifyDriver({ id: selectedLivraison._id, driver: driverId });
      setShowForm(false);
      setSelectedLivraison(null);
      getLivraisons();
      toast.success('Driver assigned successfully');
    } catch (error) {
      toast.error('Error assigning driver');
    }
  };

  return (
    <div className="flex">
      <Dashboard />
      <div className="flex-1 container mx-auto p-9 relative mt-20">
        <ToastContainer />
        <Search setData={handleSearch} title={"Tous les livraisons"} />
        {showForm && selectedLivraison && (
          <Livraison1Form
            selectedLivraison={selectedLivraison}
            drivers={drivers}
            handleDriverSubmit={handleDriverSubmit}
            setShowForm={setShowForm}
          />
        )}
        <Livraison1Table
          livraisons={isSearchActive ? filteredLivraisons : livraisons}
          handleAssignDriver={handleAssignDriver}
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
};

export default FicheDeRoute;
