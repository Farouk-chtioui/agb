import React, { useCallback, useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UtilisateursForm from "./UtilisateursForm";
import Utilisateurstable from "./Utilisateurstable";
import { createAdmin, deleteAdmin, updateAdmin } from "../../api/adminService";
import { addDriver, modifyDriver, deleteDriver } from "../../api/driverService";
import { addMagasin, modifyMagasin, deleteMagasin } from "../../api/marketService";
import { fetchUsers, searchUsers } from "../../api/UsersService";
import Pagination from "../Pagination/Pagination";
import Dashboard from "../dashboard/Dashboard";
import Search from "../searchbar/Search";
import bcrypt from 'bcryptjs';

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
    codePostal: '',
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
      const data = await fetchUsers(currentPage);
      const normalizedUsers = data.users.map(user => ({
        ...user,
        role: user.role || 'User',
      }));
      setUtilisateurs(normalizedUsers);
      setFilteredUtilisateurs(normalizedUsers);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching utilisateurs', error);
      toast.error('Erreur lors du chargement des utilisateurs');
    }
  };

  const handleDelete = async (utilisateur) => {
    if (!utilisateur || !utilisateur._id || !utilisateur.role) {
      console.error("Utilisateur _id or role is undefined:", utilisateur);
      toast.error('Erreur: utilisateur introuvable.');
      return;
    }

    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur?')) {
      try {
        switch (utilisateur.role) {
          case 'Admin':
            await deleteAdmin(utilisateur._id);
            break;
          case 'Driver':
            await deleteDriver(utilisateur._id);
            break;
          case 'Market':
            await deleteMagasin(utilisateur._id);
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
          await updateAdmin(updatedUtilisateur._id, updatedUtilisateur);
          break;
        case 'Driver':
          await modifyDriver(updatedUtilisateur); // Pass the entire object
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
    if (searchTerm && searchTerm.trim()) {
      setIsSearchActive(true);
      try {
        const data = await searchUsers(searchTerm.trim());
        const users = data.map(item => {
          const _doc = item && item._doc ? item._doc : {};
          return {
            _id: _doc._id || 'N/A',
            displayName: item && item.displayName ? item.displayName : 'Unnamed User',
            email: _doc.email || 'No Email Provided',
            role: item && item.role ? item.role : 'No Role',
          };
        });
        setFilteredUtilisateurs(users);
      } catch (error) {
        console.error('Error searching utilisateurs', error);
        toast.error('Erreur lors de la recherche des utilisateurs');
        setFilteredUtilisateurs([]);
      }
    } else {
      setIsSearchActive(false);
      setFilteredUtilisateurs(utilisateurs);
    }
  };

  const handleAddUtilisateur = async (newUtilisateur) => {
    try {
      if (newUtilisateur.password) {
        const hashedPassword = await bcrypt.hash(newUtilisateur.password, 10);
        newUtilisateur.password = hashedPassword;
      }

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
            codePostal: newUtilisateur.codePostal,
            numberMa: newUtilisateur.numberMa,
            numberMi: newUtilisateur.numberMi
          });
          break;
        default:
          throw new Error('Invalid role');
      }

      console.log("Utilisateur created successfully:", response.data);
      fetchUtilisateursData();
      setShowForm(false); // Close the form after adding a user
      toast.success('Utilisateur ajouté avec succès!');
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
      [name]: value || '' // Ensure value is always a string
    }));
  }, []);

  return (
    <div className="flex h-screen">
      <Dashboard />
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <div className="container mx-auto p-9 relative mt-20">
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
                codePostal: '',
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
    </div>
  );
};

export default Utilisateurs;
