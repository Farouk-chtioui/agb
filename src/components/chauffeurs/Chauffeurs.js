// Chauffeurs.js
import React, { useState, useEffect } from 'react';
import { fetchDrivers, deleteDriver, addDriver,searchDrivers} from '../../api/Auth';
import Sidebar from '../dashboard/Dashboard'; 
import Search from '../searchbar/Search';
import DriverForm from './DriverForm';
import DriverTable from './DriverTable';
import Pagination from './Pagination';
import './chauffeurs.css';

const Chauffeurs = () => {
  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [newDriver, setNewDriver] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    fetchDriversData();
  }, [currentPage]);

  const fetchDriversData = async () => {
    try {
      const data = await fetchDrivers(currentPage);
      setDrivers(data);
      setFilteredDrivers(data);
    } catch (error) {
      console.error('Error fetching drivers', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDriver(id);
      fetchDriversData();
    } catch (error) {
      console.error('Error deleting driver', error);
    }
  };

  const handleAddDriver = async (e) => {
    e.preventDefault();
    try {
      await addDriver(newDriver);
      fetchDriversData();
      setShowForm(false);
    } catch (error) {
      console.error('Error adding driver', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewDriver({
      ...newDriver,
      [name]: value
    });
  };

  const handleSearch = async (searchTerm) => {
    if (searchTerm === '') {
      setFilteredDrivers(drivers);
    } else {
      try {
        const response = await searchDrivers(searchTerm);
        setFilteredDrivers(response);
      } catch (error) {
        console.error('Error searching drivers', error);
      }
    }
  };

  return (
    <div className="flex">
      <Sidebar title="Chauffeurs"/>
      <div className="flex-1 container mx-auto p-9 relative mt-20 ">
        <Search setData={handleSearch} />
        <button 
          className="custom-color2 text-white px-4 py-2 rounded mb-4 absolute top-0 right-0 mt-4 mr-4 shadow hover:bg-blue-600 transition"
          onClick={() => setShowForm(true)}>
          Ajouter un chauffeur
        </button>

        {showForm && (
          <DriverForm
            newDriver={newDriver}
            handleChange={handleChange}
            handleAddDriver={handleAddDriver}
            setShowForm={setShowForm}
          />
        )}

        <DriverTable drivers={filteredDrivers} handleDelete={handleDelete} />

        <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </div>
    </div>
  );
};

export default Chauffeurs;
