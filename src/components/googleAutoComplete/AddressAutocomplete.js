import React, { useEffect, useRef, useState, useCallback } from 'react';
import { debounce } from 'lodash';

const AddressAutocomplete = ({ value, onChange }) => {
    const inputRef = useRef(null);
    const autoCompleteRef = useRef(null);
    const initializedRef = useRef(false); // Track initialization
    const [inputValue, setInputValue] = useState(value || ''); 
    const [loaded, setLoaded] = useState(false); 

    useEffect(() => {
        const initializeAutocomplete = () => {
            if (window.google && !initializedRef.current) {
                const autoComplete = new window.google.maps.places.Autocomplete(inputRef.current, {
                    types: ['address'],
                });

                autoCompleteRef.current = autoComplete;

                autoComplete.addListener('place_changed', () => {
                    const place = autoComplete.getPlace();
                    console.log('Place:', place); // Log the place object for debugging

                    const postalCodeComponent = place.address_components.find(component => 
                        component.types.includes('postal_code')
                    );
                    const postalCode = postalCodeComponent ? postalCodeComponent.long_name : '';
                    
                    if (!postalCodeComponent) {
                        console.warn('Postal code not found in address components:', place.address_components);
                    }

                    onChange({
                        target: {
                            name: 'address',
                            value: place.formatted_address,
                        },
                        postalCode: postalCode, // Include postal code in the returned data
                    });

                    setInputValue(place.formatted_address); 
                });

                setLoaded(true);
                initializedRef.current = true; // Mark as initialized
                console.log('Autocomplete is set up');
            }
        };

        initializeAutocomplete();
    }, [onChange]);

    const debouncedChangeHandler = useCallback(
        debounce((e) => {
            onChange({
                target: {
                    name: 'address',
                    value: e.target.value,
                },
            });
        }, 500),
        [onChange] // Recreate debounced function only if onChange changes
    );

    const handleInputChange = (e) => {
        const { value } = e.target;
        setInputValue(value);
        debouncedChangeHandler(e);
    };

    return (
        <input
            ref={inputRef}
            type="text"
            value={inputValue} 
            onChange={handleInputChange} 
            placeholder="Address"
            className="border rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 border-blue-600"
            disabled={!loaded}
            style={{ boxShadow: 'none' }}
        />
    );
};

export default AddressAutocomplete;
