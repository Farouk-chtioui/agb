// addDriverForm.js
import React, { useState, useEffect, useCallback } from 'react';
import { fetchDrivers } from '../../../api/driverService';
import Form from '../../Form/Form';

const AddDriverForm = ({ demandeId, handleChange, handleSubmit, setShowForm }) => {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getDrivers = useCallback(async () => {
        try {
            const { data } = await fetchDrivers();
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

    const fields = [
        {
            name: 'driver',
            label: 'Driver',
            type: 'dropdown',
            options: drivers ? drivers.map(driver => ({ value: driver.id, label: driver.first_name })) : [],
            placeholder: 'Select a driver'
        }
    ];

    return (
        <Form
            formData={{}}
            handleChange={handleChange}
            handleSubmit={(e) => {
                e.preventDefault();
                handleSubmit(demandeId);
            }}
            setShowForm={setShowForm}
            title="Assign Driver"
            fields={fields}
        />
    );
};

export default AddDriverForm;
