import React, { useState, useEffect, useCallback } from 'react';
import { fetchDrivers, deleteDriver, addDriver, searchDrivers, modifyDriver } from '../../../api/Auth';
import Dashboard from '../../dashboard/Dashboard';
import Search from '../../searchbar/Search';
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
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentDriver, setCurrentDriver] = useState(null);
  const [isSearchActive, setIsSearchActive] = useState(false);

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

  const handleModify = (driver) => {
    setCurrentDriver(driver);
    setNewDriver(driver);
    setIsEditMode(true);
    setShowForm(true);
  };

  const handleEditDriver = async (e) => {
    e.preventDefault();
    try {
      await modifyDriver(newDriver);
      fetchDriversData();
      setShowForm(false);
      setIsEditMode(false);
      setCurrentDriver(null);
      setNewDriver({
        first_name: '',
        last_name: '',
        email: '',
        password: ''
      });
    } catch (error) {
      console.error('Error modifying driver', error);
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

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewDriver(prevState => ({
      ...prevState,
      [name]: value
    }));
  }, []);

  const handleSearch = async (searchTerm) => {
    if (searchTerm === '') {
      setFilteredDrivers(drivers);
      setIsSearchActive(false);
    } else {
      try {
        const response = await searchDrivers(searchTerm);
        setFilteredDrivers(response);
        setIsSearchActive(true);
      } catch (error) {
        console.error('Error searching drivers', error);
      }
    }
  };

  return (
    <div className="flex">
      <Dashboard title="Gérer les chauffeurs" />
      <div className="flex-1 container mx-auto p-9 relative mt-20 ">
        <Search setData={handleSearch} />
        <button
          className="custom-color2 text-white px-4 py-2 rounded mb-4 absolute top-0 right-0 mt-4 mr-4 shadow hover:bg-blue-600 transition"
          onClick={() => {
            setShowForm(true);
            setIsEditMode(false);
            setNewDriver({
              first_name: '',
              last_name: '',
              email: '',
              password: ''
            });
          }}>
          Ajouter un chauffeur
        </button>

        {showForm && (
          <DriverForm
            newDriver={newDriver}
            handleChange={handleChange}
            handleAddDriver={handleAddDriver}
            handleEditDriver={handleEditDriver}
            setShowForm={setShowForm}
            isEditMode={isEditMode}
            currentDriver={currentDriver}
          />
        )}

        <DriverTable drivers={filteredDrivers} handleDelete={handleDelete} handleModify={handleModify} />

        {!isSearchActive && <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} />}
      </div>
    </div>
  );
};

export default Chauffeurs;
