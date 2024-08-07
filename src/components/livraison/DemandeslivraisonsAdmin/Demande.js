import React, { useState, useEffect, useCallback } from 'react';
import { deleteLivraison, modifyDriver, updateStatus, findByStatus } from '../../../api/livraisonService';
import DemandeTable from './DemandeTable';
import Dashboard from '../../dashboard/Dashboard';
import Search from '../../searchbar/Search';
import Pagination from '../../Pagination/Pagination';
import AddDriverForm from './addDriverForm';
import io from 'socket.io-client';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const socket = io('http://localhost:3001');

function Demandes() {
    const [demandes, setDemandes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [filteredDemandes, setFilteredDemandes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDemande, setSelectedDemande] = useState(null);
    const [formData, setFormData] = useState({ driver: '' });

    const loadData = useCallback(async (page) => {
        try {
            const response = await findByStatus('En attente');
            const pendingDemandes = response.length > 0 ? response : [];
            setDemandes(pendingDemandes);
            setTotalPages(Math.ceil(pendingDemandes.length / 10));
        } catch (error) {
            console.error('Error loading data', error);
        }
    }, []);

    useEffect(() => {
        loadData(currentPage);

        socket.on('statusChange', () => loadData(currentPage));
        socket.on('addLivraison', () => loadData(currentPage));

        return () => {
            socket.off('statusChange', () => loadData(currentPage));
            socket.off('addLivraison', () => loadData(currentPage));
        };
    }, [currentPage, loadData]);

    const handleDelete = async (demandeId) => {
        try {
            await deleteLivraison(demandeId);
            socket.emit('statusChange', { id: demandeId, status: 'deleted' });
            toast.success('Demande supprimée avec succès!', { toastId: 'delete1' });
            loadData(currentPage);
        } catch (error) {
            console.error('Error deleting demande', error);
            toast.error('Erreur lors de la suppression de la demande.');
        }
    };

    const handleModify = async () => {
        try {
            console.log('handleModify called');
            await modifyDriver({ id: selectedDemande._id, driver: formData.driver });
            await updateStatus(selectedDemande._id, 'À la livraison');
            socket.emit('statusChange', { id: selectedDemande._id, status: 'À la livraison' });

            setIsModalOpen(false);
            toast.success('Driver assigned successfully!', { toastId: 'modify1' });
        } catch (error) {
            console.error('Error updating livraison:', error);
            toast.error('Error assigning driver.');
        }
    };

    const handleAddDriver = (demande) => {
        setSelectedDemande(demande);
        setIsModalOpen(true);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
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
        const filteredData = demandes.filter((demande) => demande.reference.toLowerCase().includes(searchTerm.toLowerCase()));
        setFilteredDemandes(filteredData);
        setTotalPages(Math.ceil(filteredData.length / 10));
    }, [searchTerm, demandes]);

    const currentData = isSearchActive
        ? filteredDemandes.slice((currentPage - 1) * 10, currentPage * 10)
        : demandes.slice((currentPage - 1) * 10, currentPage * 10);

    return (
        <div className="flex h-screen">
            <Dashboard />
            <div className="flex-1 flex flex-col h-screen overflow-y-auto">
                <div className="container mx-auto p-9 relative mt-20">
                    <ToastContainer />
                    <Search setData={handleSearch} title="Toutes les demandes de livraison" />
                    <DemandeTable
                        demandes={currentData}
                        handleDelete={handleDelete}
                        handleAddDriver={handleAddDriver}
                    />
                    <Pagination
                        currentPage={currentPage}
                        setCurrentPage={handlePaginationChange}
                        totalPages={totalPages}
                    />
                    {isModalOpen && (
                        <AddDriverForm
                            livraisonId={selectedDemande ? selectedDemande._id : ''}
                            handleChange={handleChange}
                            handleSubmit={handleModify}
                            setShowForm={setIsModalOpen}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default Demandes;
