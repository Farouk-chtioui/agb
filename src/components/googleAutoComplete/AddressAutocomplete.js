import React, { useEffect, useRef, useState, useCallback } from 'react';
import { debounce } from 'lodash';

const AddressAutocomplete = ({ value, onChange }) => {
    const inputRef = useRef(null);
    const autoCompleteRef = useRef(null);
    const [inputValue, setInputValue] = useState(value || ''); 
    const [loaded, setLoaded] = useState(false); 

    useEffect(() => {
        const loadScript = (url) => {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = url;
                script.async = true;
                script.defer = true;
                script.onload = () => {
                    resolve();
                    setLoaded(true);
                };
                script.onerror = reject;
                document.head.appendChild(script);
            });
        };

        const initializeAutocomplete = () => {
            if (window.google) {
                const autoComplete = new window.google.maps.places.Autocomplete(inputRef.current, {
                    types: ['address'],
                });

                autoCompleteRef.current = autoComplete;

                autoComplete.addListener('place_changed', () => {
                    const place = autoComplete.getPlace();
                    onChange({
                        target: {
                            name: 'address',
                            value: place.formatted_address,
                        },
                    });
                    setInputValue(place.formatted_address); 
                });

                console.log('Autocomplete is set up');
            }
        };

        const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
        if (apiKey) {
            loadScript(`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`)
                .then(initializeAutocomplete)
                .catch((error) => {
                    console.error('Error loading Google Maps script:', error);
                });
        } else {
            console.error('Google Maps API key is not defined');
        }
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
        [] // Only recreate the debounced function when the component mounts
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
