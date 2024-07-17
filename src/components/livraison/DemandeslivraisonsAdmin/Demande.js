import React, { useState, useEffect, useCallback } from 'react';
import { fetchLivraisons, deleteLivraison, modifyDriver,updateStatus } from '../../../api/livraisonService';
import DemandeTable from './DemandeTable';
import Dashboard from '../../dashboard/Dashboard';
import Search from '../../searchbar/Search';
import Pagination from '../../Pagination/Pagination';
import AddDriverForm from './addDriverForm'; // Adjust the import path as needed

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
        <div className="flex h-screen bg-white-100">
            <Dashboard />
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-6xl mx-auto p-8">
                    <Search setData={handleSearch} title="Tout les demandes de livraison" />
                    <DemandeTable
                        demandes={currentPageData}
                        handleDelete={handleDelete}
                        handleAddDriver={handleAddDriver}
                    />
                    <Pagination pageCount={pageCount} currentPage={currentPage} handlePaginationChange={handlePaginationChange} />
                </div>
            </div>
            {isModalOpen && (
                <AddDriverForm
                    livraisonId={selectedDemande ? selectedDemande._id : ''}
                    handleChange={handleChange}
                    handleModify={handleModify}
                    setShowForm={setIsModalOpen}
                />
            )}
        </div>
    );
}

export default Demandes;
