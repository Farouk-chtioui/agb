import React, { useState, useEffect, useCallback } from 'react';
import { getDemandes_de_Livraisons, modifyDemande_de_Livraison, deleteDemande_de_Livraison } from '../../../api/Demandes_de_Livraisons';
import DemandeTable from './DemandeTable';
import Dashboard from '../../dashboard/Dashboard';
import Search from '../../searchbar/Search';
import Pagination from '../../Pagination/Pagination';

function Demandes() {
    const [demandes, setdemandes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [filteredDemandes, setFilteredDemandes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await getDemandes_de_Livraisons();
                setdemandes(data);
                setLoading(false);
            } catch (error) {
                console.error('Error loading data', error);
            }
        };
        loadData();
    }, []);

    const handleDelete = async (demandeId) => {
        try {
            await deleteDemande_de_Livraison(demandeId);
            const data = await getDemandes_de_Livraisons();
            setdemandes(data);
        } catch (error) {
            console.error('Error deleting demande', error);
        }
    };

    const handleModify = async (demandeId, demande) => {
        try {
            await modifyDemande_de_Livraison(demandeId, demande);
            const data = await getDemandes_de_Livraisons();
            setdemandes(data);
        } catch (error) {
            console.error('Error modifying demande', error);
        }
    };

    const handleView = (demandeId) => {
        console.log('View demande details for ID:', demandeId);
        // Add your view logic here
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
    const pageSize = 5;
    const pageCount = Math.ceil(currentData.length / pageSize);
    const currentPageData = currentData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div className="flex h-screen bg-white-100">
            <Dashboard title="Gestion des Livraisons" />
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-6xl mx-auto p-8">
                    <Search setData={handleSearch} title="Tout les demandes de livraison" />
                    <DemandeTable demandes={currentPageData} handleDelete={handleDelete} handleModify={handleModify} handleView={handleView} />
                    <Pagination pageCount={pageCount} currentPage={currentPage} handlePaginationChange={handlePaginationChange} />
                </div>
            </div>
        </div>
    );
}

export default Demandes;
