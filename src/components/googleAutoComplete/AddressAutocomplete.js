import React, { useEffect, useRef, useState, useCallback } from 'react';
import { debounce } from 'lodash';
import loadGoogleMapsScript from '../../utils/loadGoogleMaps/loadGoogleMaps'; // Import the utility

const AddressAutocomplete = ({ value, onChange }) => {
  const inputRef = useRef(null);
  const autoCompleteRef = useRef(null);
  const initializedRef = useRef(false);
  const [inputValue, setInputValue] = useState(value || '');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

    const initializeAutocomplete = async () => {
      try {
        await loadGoogleMapsScript(apiKey);
        if (window.google && !initializedRef.current) {
          const autoComplete = new window.google.maps.places.Autocomplete(inputRef.current, {
            types: ['address'],
          });

          autoCompleteRef.current = autoComplete;

          autoComplete.addListener('place_changed', () => {
            const place = autoComplete.getPlace();
            console.log('Place:', place);

            const postalCodeComponent = place.address_components.find(component => 
              component.types.includes('postal_code')
            );
            const postalCode = postalCodeComponent ? postalCodeComponent.long_name : '';

            if (!postalCodeComponent) {
              alert('Please select an address with a postal code.');
            }

            onChange({
              target: {
                name: 'address',
                value: place.formatted_address,
              },
              postalCode: postalCode,
            });

            setInputValue(place.formatted_address);
          });

          setLoaded(true);
          initializedRef.current = true;
          console.log('Autocomplete is set up');
        }
      } catch (error) {
        console.error('Failed to initialize Google Maps Autocomplete:', error);
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
    [onChange]
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
