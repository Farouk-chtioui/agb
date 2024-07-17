import React, { useState, useEffect, useCallback } from 'react';
import { fetchDrivers } from '../../../api/driverService';
import Form from '../../Form/Form';

const AddDriverForm = ({ livraisonId, handleChange, handleModify, setShowForm }) => {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({ driver: '' });

    const getDrivers = useCallback(async () => {
        try {
            const data = await fetchDrivers();
            setDrivers(data);
            setLoading(false);
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getDrivers();
    }, [getDrivers]);

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
            options: drivers ? drivers.map(driver => ({ value: driver._id, label: driver.first_name })) : [],
            placeholder: 'Select a driver',
            value: formData.driver 
        }
    ];

    useEffect(() => {
    }, [livraisonId]);

    return (
        <Form
            formData={formData}
            handleChange={handleLocalChange}
            handleSubmit={(e) => {
                e.preventDefault();
                handleModify();
            }}
            setShowForm={setShowForm}
            title="Assign Driver"
            fields={fields}
            loading={loading}
            error={error}
        />
    );
};

export default AddDriverForm;
