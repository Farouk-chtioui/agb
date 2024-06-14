import React from "react";
import Form from "../Form/Form";
import AddressAutocomplete from "../googleAutoComplete/AddressAutocomplete";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css'; // Import the default style
import "../Form/Form.css";

const ClientForm = ({
    newClient,
    handleChange,
    handleAddClient,
    handleEditClient,
    setShowForm,
    isEditMode,
}) => {
    const fields = [
        {name: "first_name", label: "Nom", type: "text", placeholder: "Nom", colSpan: 1},
        {name: "last_name", label: "Prenom", type: "text", placeholder: "Prenom", colSpan: 1},
        {name:"address1", label: "Address1", type: "autocomplete", placeholder: "Address1", colSpan: 2},
        {name:"address2", label: "Address2", type: "autocomplete", placeholder: "Address2", colSpan: 2},
        {name:"phone", label: "Phone", type: "phone", placeholder: "Phone", colSpan: 2},
    ].filter(Boolean);

    const handlePhoneChange = (value) => {
        handleChange({ target: { name: 'phone', value } });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditMode) {
            handleEditClient(e);
        } else {
            handleAddClient(e);
        }
    };

    return (
        <Form
            formData={newClient}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            setShowForm={setShowForm}
            fields={fields}
            title={isEditMode ? "Modifier le Client" : "Ajouter un Client"}
            renderField={(field) => {
                if (field.type === "autocomplete") {
                    return (
                        <div className={`form-group col-span-${field.colSpan}`} key={field.name}>
                            <label htmlFor={field.name}>{field.label}</label>
                            <AddressAutocomplete
                                value={newClient[field.name]}
                                onChange={handleChange}
                            />
                        </div>
                    );
                } else if (field.type === "phone") {
                    return (
                        <div className={`form-group col-span-${field.colSpan}`} key={field.name}>
                            <label htmlFor={field.name}>{field.label}</label>
                            <PhoneInput
                                international
                                defaultCountry="US"
                                value={newClient[field.name]}
                                onChange={handlePhoneChange}
                            />
                        </div>
                    );
                }
                return (
                    <div className={`form-group col-span-${field.colSpan}`} key={field.name}>
                        <label htmlFor={field.name}>{field.label}</label>
                        <input
                            type={field.type}
                            name={field.name}
                            value={newClient[field.name]}
                            onChange={handleChange}
                            placeholder={field.placeholder}
                        />
                    </div>
                );
            }}
        />
    );
}   
export default ClientForm;