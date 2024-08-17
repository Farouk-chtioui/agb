import React, { useCallback, useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UtilisateursForm from "./UtilisateursForm";
import Utilisateurstable from "./Utilisateurstable";
import {
  fetchAdminData,
  createAdmin,
} from "../../api/adminService";
import {
  fetchDrivers,
  addDriver,
  modifyDriver,
  deleteDriver,
} from "../../api/driverService";
import {
  fetchMagasins,
  addMagasin,
  modifyMagasin,
  deleteMagasin,
} from "../../api/marketService";
import Pagination from "../Pagination/Pagination";
import Dashboard from "../dashboard/Dashboard";
import Search from "../searchbar/Search";

const Utilisateurs = () => {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [filteredUtilisateurs, setFilteredUtilisateurs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [newUtilisateur, setNewUtilisateur] = useState({
    role: 'Market',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    address: '',
    codePostal: '',  // Ensure codePostal is initialized here
    numberMa: '',
    numberMi: ''
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);

  useEffect(() => {
    fetchUtilisateursData();
  }, [currentPage]);

  const fetchUtilisateursData = async () => {
    try {
      const [adminData, driverData, marketData] = await Promise.all([
        fetchAdminData(),
        fetchDrivers(currentPage),
        fetchMagasins(currentPage),
      ]);

      const normalizedAdmins = (adminData.admins || adminData || []).map(admin => ({
        ...admin,
        role: 'Admin',
      }));

      const normalizedDrivers = (driverData.drivers || driverData || []).map(driver => ({
        ...driver,
        role: 'Driver',
      }));

      const normalizedMarkets = (marketData.markets || marketData || []).map(market => ({
        ...market,
        role: 'Market',
      }));

      const combinedData = [...normalizedAdmins, ...normalizedDrivers, ...normalizedMarkets];

      setUtilisateurs(combinedData);
      setFilteredUtilisateurs(combinedData);
      setTotalPages(Math.max(adminData.totalPages || 1, driverData.totalPages || 1, marketData.totalPages || 1));
    } catch (error) {
      console.error('Error fetching utilisateurs', error);
      toast.error('Erreur lors du chargement des utilisateurs');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur?')) {
      try {
        switch (newUtilisateur.role) {
          case 'Admin':
            // Implement deleteAdmin if necessary
            break;
          case 'Driver':
            await deleteDriver(id);
            break;
          case 'Market':
            await deleteMagasin(id);
            break;
          default:
            throw new Error('Invalid role');
        }
        fetchUtilisateursData();
        toast.success('Utilisateur supprimé avec succès!');
      } catch (error) {
        console.error('Error deleting utilisateur', error);
        toast.error('Erreur lors de la suppression de l\'utilisateur.');
      }
    }
  };

  const handleModify = (utilisateur) => {
    setNewUtilisateur(utilisateur);
    setIsEditMode(true);
    setShowForm(true);
  };

  const handleEditUtilisateur = async (updatedUtilisateur) => {
    try {
      switch (updatedUtilisateur.role) {
        case 'Admin':
          // Implement modifyAdmin if necessary
          break;
        case 'Driver':
          await modifyDriver(updatedUtilisateur);
          break;
        case 'Market':
          await modifyMagasin(updatedUtilisateur._id, updatedUtilisateur);
          break;
        default:
          throw new Error('Invalid role');
      }
      fetchUtilisateursData();
      setShowForm(false);
      toast.success('Utilisateur modifié avec succès!');
    } catch (error) {
      console.error('Error modifying utilisateur', error);
      toast.error('Erreur lors de la modification de l\'utilisateur.');
    }
  };

  const handleSearch = async (searchTerm) => {
    if (searchTerm) {
      setIsSearchActive(true);
      setFilteredUtilisateurs(utilisateurs.filter(u => 
        u.first_name.includes(searchTerm) || 
        u.last_name.includes(searchTerm) ||
        u.email.includes(searchTerm)
      ));
    } else {
      setIsSearchActive(false);
      setFilteredUtilisateurs(utilisateurs);
    }
  };

  const handleAddUtilisateur = async (newUtilisateur) => {
    try {
        let response;
        switch (newUtilisateur.role) {
            case 'Admin':
                response = await createAdmin({
                    name: newUtilisateur.name,
                    email: newUtilisateur.email,
                    password: newUtilisateur.password
                });
                break;
            case 'Driver':
                response = await addDriver({
                    first_name: newUtilisateur.first_name,
                    last_name: newUtilisateur.last_name,
                    email: newUtilisateur.email,
                    password: newUtilisateur.password
                });
                break;
            case 'Market':
                response = await addMagasin({
                    first_name: newUtilisateur.first_name,
                    last_name: newUtilisateur.last_name,
                    email: newUtilisateur.email,
                    password: newUtilisateur.password,
                    address: newUtilisateur.address,
                    codePostal: newUtilisateur.codePostal,  // Ensure codePostal is included
                    numberMa: newUtilisateur.numberMa,
                    numberMi: newUtilisateur.numberMi
                });
                break;
            default:
                throw new Error('Invalid role');
        }
        console.log("Utilisateur created successfully:", response.data);
        fetchUtilisateursData();
    } catch (error) {
        console.error('Error adding utilisateur:', error);
        toast.error('Une erreur est survenue lors de l\'ajout de l\'utilisateur.');
    }
  };

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewUtilisateur(prevState => ({
      ...prevState,
      [name]: value
    }));
  }, []);

  return (
    <div className="flex">
      <Dashboard />
      <div className="flex-1 container mx-auto p-9 relative mt-20">
        <ToastContainer />
        <Search setData={handleSearch} title={"Tous les utilisateurs"} />
        <button
          className="custom-color2 text-white px-4 py-2 rounded mb-4 absolute top-0 right-0 mt-4 mr-4 shadow hover:bg-blue-600 transition"
          onClick={() => {
            setShowForm(true);
            setIsEditMode(false);
            setNewUtilisateur({
              role: 'Market',
              first_name: '',
              last_name: '',
              email: '',
              password: '',
              address: '',
              codePostal: '',  // Ensure this is reset when adding new Market
              numberMa: '',
              numberMi: ''
            });
          }}
        >
          Ajouter un utilisateur
        </button>
        {showForm && (
          <UtilisateursForm
            newUtilisateur={newUtilisateur}
            handleChange={handleChange}
            handleAddUtilisateur={handleAddUtilisateur}
            handleEditUtilisateur={handleEditUtilisateur}
            setShowForm={setShowForm}
            isEditMode={isEditMode}
          />
        )}
        <Utilisateurstable
          utilisateurs={isSearchActive ? filteredUtilisateurs : utilisateurs}
          handleDelete={handleDelete}
          handleModify={handleModify}
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

export default Utilisateurs;
