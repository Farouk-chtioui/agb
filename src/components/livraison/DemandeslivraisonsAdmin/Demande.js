import React, { useState, useEffect, useCallback } from 'react';
import { fetchLivraisons, deleteLivraison, modifyDriver, updateStatus } from '../../../api/livraisonService';
import DemandeTable from './DemandeTable';
import Dashboard from '../../dashboard/Dashboard';
import Search from '../../searchbar/Search';
import Pagination from '../../Pagination/Pagination';
import AddDriverForm from './addDriverForm'; // Adjust the import path as needed
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); // Replace with your server URL

function Demandes() {
    const [demandes, setDemandes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [filteredDemandes, setFilteredDemandes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDemande, setSelectedDemande] = useState(null); // Hold the entire demande object
    const [formData, setFormData] = useState({ driver: '' });

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchLivraisons();
                setDemandes(data);
                setLoading(false);
            } catch (error) {
                console.error('Error loading data', error);
            }
        };
        loadData();
    }, []);

    const handleDelete = async (demandeId) => {
        try {
            await deleteLivraison(demandeId);
            const data = await fetchLivraisons();
            setDemandes(data);
            socket.emit('statusChange'); // Emit WebSocket event after deletion
        } catch (error) {
            console.error('Error deleting demande', error);
        }
    };

    const handleAddDriver = (demande) => {
        console.log('handleAddDriver - Selected Demande:', demande); // Log the entire demande object
        setSelectedDemande(demande);
        setIsModalOpen(true);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleModify = async () => {
        try {
            await modifyDriver({ id: selectedDemande._id, driver: formData.driver });
            await updateStatus(selectedDemande._id, 'À la livraison');
    
            const data = await fetchLivraisons();
            setDemandes(data);
            socket.emit('statusChange', { id: selectedDemande._id, status: 'À la livraison' }); // Emit WebSocket event after status change
    
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error updating livraison:', error);
        }
    };

    const handleSearch = useCallback((searchTerm) => {
        setSearchTerm(searchTerm);
        setIsSearchActive(true);
        setCurrentPage(1);
    }, []);

    const handlePaginationChange = useCallback((page) => {
        setCurrentPage(page);
    }, []);

    useEffect(() => {
        if (searchTerm === '') {
            setIsSearchActive(false);
            return;
        }
        const filteredData = demandes.filter((demande) => {
            return demande.reference.toLowerCase().includes(searchTerm.toLowerCase());
        });
        setFilteredDemandes(filteredData);
    }, [searchTerm, demandes]);

    const currentData = isSearchActive ? filteredDemandes : demandes;
    const pageSize = 10;
    const pageCount = Math.ceil(currentData.length / pageSize);
    const currentPageData = currentData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div className="flex h-screen">
          <Dashboard />
          <div className="flex-1 flex flex-col h-screen overflow-y-auto">
            <div className="container mx-auto p-9 relative mt-20">
              <Search setData={handleSearch} title="Toutes les demandes de livraison" />
              <DemandeTable
                demandes={currentPageData}
                handleDelete={handleDelete}
                handleAddDriver={handleAddDriver}
              />
              <Pagination pageCount={pageCount} currentPage={currentPage} handlePaginationChange={handlePaginationChange} />
              {isModalOpen && (
                <AddDriverForm
                  livraisonId={selectedDemande ? selectedDemande._id : ''}
                  handleChange={handleChange}
                  handleModify={handleModify}
                  setShowForm={setIsModalOpen}
                />
              )}
            </div>
          </div>
        </div>
      );
    }      
    export default Demandes;
      