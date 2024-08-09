import React, { useEffect, useRef, useState } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { MdDirections } from 'react-icons/md';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const FicheDeRouteForm = ({ selectedLivraison, drivers, handleDriverSubmit, setShowForm }) => {
  const [selectedDriver, setSelectedDriver] = useState('');
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapContainerRef.current && selectedLivraison) {
      const marketCoords = [
        parseFloat(selectedLivraison.market.longitude),
        parseFloat(selectedLivraison.market.latitude),
      ];
      const clientCoords = [
        parseFloat(selectedLivraison.client.longitude),
        parseFloat(selectedLivraison.client.latitude),
      ];

      // Validate coordinates
      if (
        isNaN(marketCoords[0]) ||
        isNaN(marketCoords[1]) ||
        isNaN(clientCoords[0]) ||
        isNaN(clientCoords[1])
      ) {
        console.error('Invalid coordinates:', {
          marketCoords,
          clientCoords,
        });
        return;
      }

      // Initialize the map or update it if it already exists
      if (mapRef.current) {
        mapRef.current.remove(); // Remove the existing map instance
      }

      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: marketCoords,
        zoom: 10,
      });

      // Fetch and display the route
      const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${marketCoords.join(
        ','
      )};${clientCoords.join(',')}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

      fetch(directionsUrl)
        .then((response) => response.json())
        .then((data) => {
          if (data.routes && data.routes[0]) {
            const route = data.routes[0].geometry.coordinates;

            mapRef.current.addSource('route', {
              type: 'geojson',
              data: {
                type: 'Feature',
                geometry: {
                  type: 'LineString',
                  coordinates: route,
                },
              },
            });

            mapRef.current.addLayer({
              id: 'route',
              type: 'line',
              source: 'route',
              layout: {
                'line-join': 'round',
                'line-cap': 'round',
              },
              paint: {
                'line-color': '#007bff', // Blue color for the route line
                'line-width': 5,
              },
            });

            // Adjust the map to fit both popups and the route
            const bounds = new mapboxgl.LngLatBounds();
            bounds.extend(marketCoords);
            bounds.extend(clientCoords);
            mapRef.current.fitBounds(bounds, {
              padding: 50,
            });
          } else {
            throw new Error('No routes found');
          }
        })
        .catch((error) => {
          console.error('Error fetching directions:', error);
        });
    }
  }, [selectedLivraison]);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleDriverSubmit(selectedDriver);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-5xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold text-blue-700">
            Assign Driver for {selectedLivraison ? selectedLivraison.NumeroCommande : ''}
          </h2>
          <button
            onClick={() => setShowForm(false)}
            className="text-gray-600 hover:text-gray-800 text-2xl"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-6">
            <label htmlFor="driver" className="block text-xl font-semibold text-blue-700">Select Driver</label>
            <select
              id="driver"
              className="w-full border rounded-lg py-2 px-3 text-lg"
              value={selectedDriver}
              onChange={(e) => setSelectedDriver(e.target.value)}
            >
              <option value="">Choose a driver</option>
              {drivers.map((driver) => (
                <option key={driver._id} value={driver._id}>
                  {driver.first_name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-actions flex justify-end mb-6">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition text-lg"
            >
              Assign
            </button>
          </div>
        </form>
        <div className="mt-6 mb-6 text-lg">
          <div className="p-4 border rounded-lg shadow-sm">
            <div className="flex items-center mb-2 text-blue-600">
              <FaMapMarkerAlt className="mr-2 text-xl" />
              <span className="font-semibold">Market: </span> {selectedLivraison ? selectedLivraison.market.first_name : ''}
            </div>
            <div className="flex items-center mb-2 text-blue-600">
              <MdDirections className="mr-2 text-xl" />
              <span className="font-semibold">Client: </span> {selectedLivraison ? selectedLivraison.client.first_name : ''}
            </div>
            <div className="flex items-center text-blue-600">
              <span className="font-semibold">Price: </span> {selectedLivraison ? `${selectedLivraison.price} €` : 'Not available'}
            </div>
          </div>
        </div>
        <div
          ref={mapContainerRef}
          style={{ width: '100%', height: '400px', marginTop: '20px' }}
        />
      </div>
    </div>
  );
};

export default FicheDeRouteForm;