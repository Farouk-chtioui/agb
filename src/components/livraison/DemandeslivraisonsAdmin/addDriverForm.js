import React, { useState, useEffect, useCallback } from 'react';
import { fetchDrivers } from '../../../api/driverService';
import Form from '../../Form/Form';
import { toast } from 'react-toastify';

const AddDriverForm = ({ livraisonId, handleChange, handleModify, setShowForm }) => {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({ driver: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const getDrivers = useCallback(async (page) => {
        try {
            const data = await fetchDrivers(page);
            console.log('Fetched drivers:', data); // Log the fetched data
            setDrivers(data.drivers); // Update drivers state with the list of drivers
            setTotalPages(data.totalPages); // Update total pages for pagination
            setLoading(false);
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getDrivers(currentPage);
    }, [getDrivers, currentPage]);

    const handleLocalChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        handleChange(e); // Call the parent's handleChange to keep it updated
    };

    const fields = [
        {
            name: 'driver',
            label: 'Driver',
            type: 'dropdown',
            options: drivers.map(driver => ({ value: driver._id, label: driver.first_name })),
            placeholder: 'Select a driver',
            value: formData.driver 
        }
    ];

    useEffect(() => {
    }, [livraisonId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await handleModify();
            setShowForm(false);
        } catch (error) {
            console.error('Error updating livraison:', error);
            toast.error('Error assigning driver.');
        }
    };

    return (
        <Form
            formData={formData}
            handleChange={handleLocalChange}
            handleSubmit={handleSubmit}
            setShowForm={setShowForm}
            title="Assign Driver"
            fields={fields}
            loading={loading}
            error={error}
        />
    );
};

export default AddDriverForm;
