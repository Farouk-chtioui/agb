import React, { useEffect, useRef, useState } from 'react';

const AddressAutocomplete = ({ value, onChange }) => {
    const inputRef = useRef(null);
    const autoCompleteRef = useRef(null);
    const [inputValue, setInputValue] = useState(value || ''); 
    const [loaded, setLoaded] = useState(false);
    const debounce = (func, delay) => {
        let timer;
        return function(...args) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    };


    useEffect(() => {
        const loadScript = (url) => {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = url;
                script.async = true;
                script.defer = true;
                script.onload = resolve;
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
                    setInputValue(place.formatted_address); // Update local state with the selected address
                });

                console.log('Autocomplete is set up');
                setLoaded(true);
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

    // Update local state and call onChange prop with manually typed value
    const handleInputChange = (e) => {
        const { value } = e.target;
        setInputValue(value);
        onChange({
            target: {
                name: 'address',
                value: value,
            },
        });
    };

    return (
        <input
            ref={inputRef}
            type="text"
            value={inputValue} // Use local state for input value
            onChange={handleInputChange} // Update local state on change
            placeholder="Address"
            className="border rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 border-blue-600"
            disabled={!loaded}
            style={{ boxShadow: 'none', }}
            
        />
    );
};

export default AddressAutocomplete;