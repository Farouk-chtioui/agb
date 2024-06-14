import React, { useState, useEffect, useCallback } from 'react';
import { fetchMagasins, deleteMagasin, addMagasin, searchMagasins, modifyMagasin } from '../../api/Auth';
import Dashboard from '../dashboard/Dashboard';
import Search from '../searchbar/Search';
import MagasinForm from './MagasinForm';
import MagasinTable from './MagasinTable';
import Pagination from '../Pagination/Pagination';


const Magasins = () => {
  const [magasins, setMagasins] = useState([]);
  const [filteredMagasins, setFilteredMagasins] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [newMagasin, setNewMagasin] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    address: '',
    numberMa: '',
    numberMi: ''
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentMagasin, setCurrentMagasin] = useState(null);
  const [isSearchActive, setIsSearchActive] = useState(false);

  useEffect(() => {
    fetchMagasinsData();
  }, [currentPage]);

  const fetchMagasinsData = async () => {
    try {
      const data = await fetchMagasins(currentPage);
      setMagasins(data);
      setFilteredMagasins(data);
    } catch (error) {
      console.error('Error fetching magasins', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMagasin(id);
      fetchMagasinsData();
    } catch (error) {
      console.error('Error deleting magasin', error);
    }
  };

  const handleModify = (magasin) => {
    setCurrentMagasin(magasin);
    setNewMagasin(magasin);
    setIsEditMode(true);
    setShowForm(true);
  };

  const handleEditMagasin = async (e) => {
    e.preventDefault();
    try {
      await modifyMagasin(newMagasin);
      fetchMagasinsData();
      setShowForm(false);
      setIsEditMode(false);
      setCurrentMagasin(null);
      setNewMagasin({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        address: '',
        numberMa: '',
        numberMi: ''
      });
    } catch (error) {
      console.error('Error modifying magasin', error);
    }
  };

  const handleAddMagasin = async (e) => {
    e.preventDefault();
    try {
      await addMagasin(newMagasin);
      fetchMagasinsData();
      setShowForm(false);
    } catch (error) {
      console.error('Error adding magasin', error);
    }
  };

  const handleChange = useCallback((e) => {
    const { name, value,type} = e.target;
    setNewMagasin(prevState => ({
      ...prevState,
      [name]: type === 'number' ? Number(value) : value,
    }));
  }, []);

  const handleSearch = async (searchTerm) => {
    if (searchTerm === '') {
      setFilteredMagasins(magasins);
      setIsSearchActive(false);
    } else {
      try {
        const response = await searchMagasins(searchTerm);
        setFilteredMagasins(response);
        setIsSearchActive(true);
      } catch (error) {
        console.error('Error searching magasins', error);
      }
    }
  };

  return (
    <div className="flex">
      <Dashboard title="Gérer les magasins" />
      <div className="flex-1 container mx-auto p-9 relative mt-20 ">
        <Search setData={handleSearch} title={"Tous les magasins"} />
        <button
          className="custom-color2 text-white px-4 py-2 rounded mb-4 absolute top-0 right-0 mt-4 mr-4 shadow hover:bg-blue-600 transition"
          onClick={() => {
            setShowForm(true);
            setIsEditMode(false);
            setNewMagasin({
              first_name: '',
              last_name: '',
              email: '',
              password: '',
              address: '',
              numberMa: '',
              numberMi: ''
            });
          }}>
          Ajouter un magasin
        </button>

        {showForm && (
          <MagasinForm
            newMagasin={newMagasin}
            handleChange={handleChange}
            handleAddMagasin={handleAddMagasin}
            handleEditMagasin={handleEditMagasin}
            setShowForm={setShowForm}
            isEditMode={isEditMode}
          />
        )}

        <MagasinTable magasins={filteredMagasins} handleDelete={handleDelete} handleModify={handleModify} />

        {!isSearchActive && <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} />}
      </div>
    </div>
  );
};

export default Magasins;
