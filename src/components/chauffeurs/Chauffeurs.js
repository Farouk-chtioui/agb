import React, { useState, useEffect } from 'react';
import { fetchDrivers, deleteDriver, addDriver } from '../../api/Auth';
import Sidebar from '../dashboard/Dashboard'; 
import { FaTrash } from 'react-icons/fa';


const Chauffeurs = () => {
  const [drivers, setDrivers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [newDriver, setNewDriver] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    fetchDriversData();
  }, [currentPage]);

  const fetchDriversData = async () => {
    try {
      const data = await fetchDrivers(currentPage);
      setDrivers(data);
    } catch (error) {
      console.error('Error fetching drivers', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDriver(id);
      fetchDriversData();
    } catch (error) {
      console.error('Error deleting driver', error);
    }
  };

  const handleAddDriver = async (e) => {
    e.preventDefault();
    try {
      await addDriver(newDriver);
      fetchDriversData();
      setShowForm(false);
    } catch (error) {
      console.error('Error adding driver', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewDriver({
      ...newDriver,
      [name]: value
    });
  };

  return (
    <div className="flex" >
      <Sidebar title="Chauffeurs"/>
      <div className="flex-1 container mx-auto p-9 relative mt-40 ">
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4 absolute top-0 right-0 mt-4 mr-4 shadow hover:bg-blue-600 transition"
          onClick={() => setShowForm(true)}>
          Ajouter un chauffeur
        </button>

        {showForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-1/3 h-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Ajouter un Chauffeur</h2>
                <button className="text-gray-700 text-xl" onClick={() => setShowForm(false)}>&times;</button>
              </div>
              <form onSubmit={handleAddDriver} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Nom</label>
                    <input
                      className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      type="text"
                      name="last_name"
                      value={newDriver.last_name}
                      onChange={handleChange}
                      placeholder="Nom"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Prénom</label>
                    <input
                      className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      type="text"
                      name="first_name"
                      value={newDriver.first_name}
                      onChange={handleChange}
                      placeholder="Prénom"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Email Adresse</label>
                  <input
                    className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="email"
                    name="email"
                    value={newDriver.email}
                    onChange={handleChange}
                    placeholder="E-mail"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Mot de passe</label>
                  <input
                    className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="password"
                    name="password"
                    onChange={handleChange}
                    placeholder="Mot de passe"
                  />
                </div>
                <div className="flex justify-center">
                  <button 
                    className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
                    type="submit">
                    Créer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <table className="min-w-full bg-white border border-gray-200 mt-8 shadow-lg rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-blue-100 text-blue-700">
              <th className="py-3 px-4 border-b border-gray-200">ID</th>
              <th className="py-3 px-4 border-b border-gray-200">Nom de chauffeur</th>
              <th className="py-3 px-4 border-b border-gray-200">E-mail</th>
              <th className="py-3 px-4 border-b border-gray-200">Créé le</th>
              <th className="py-3 px-4 border-b border-gray-200">Action</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map(driver => (
              <tr key={driver._id} className="text-center even:bg-gray-50">
                <td className="py-2 px-4 border-b border-gray-200">{driver._id}</td>
                <td className="py-2 px-4 border-b border-gray-200">{driver.first_name + " " + driver.last_name}</td>
                <td className="py-2 px-4 border-b border-gray-200">{driver.email}</td>
                <td className="py-2 px-4 border-b border-gray-200">{new Date(driver.createdAt).toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b border-gray-200">
                  <button 
                    className="text-blue-500 hover:text-red-700 transition"
                    onClick={() => handleDelete(driver._id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between items-center mt-8">
          <button 
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded shadow hover:bg-gray-400 transition"
            onClick={() => setCurrentPage(currentPage - 1)} 
            disabled={currentPage === 1}>
            &lt; Previous
          </button>
          <span>Page {currentPage}</span>
          <button 
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded shadow hover:bg-gray-400 transition"
            onClick={() => setCurrentPage(currentPage + 1)}>
            Next &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chauffeurs;
