import React from 'react';
import Sidebar from '../sidebar/Sidebar';
import { FaHome, FaUserAlt, FaStore, FaBox, FaTruck, FaUsers, FaRegChartBar, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function Dashboard({ title }) {
  const navigate = useNavigate();
  const role = localStorage.getItem('role'); // Retrieve the user's role from localStorage

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  // Define the sidebar items with roles
  const sidebarItems = [
    { title: 'Dashboard', icon: FaHome, path: '/dashboard', roles: ['admin', 'market', 'driver', 'user'] },
    {
      title: 'Livraison', icon: FaTruck, roles: ['admin'], subItems: [
        { title: 'Listes des livraisons', path: '/livraison/listes' },
        { title: 'Demandes des livraisons', path: '/livraison/demandes' }
      ]
    },
    { title: 'Clients', icon: FaUserAlt, path: '/clients', roles: ['admin'] },
    { title: 'Magasins', icon: FaStore, path: '/magasins', roles: ['admin'] },
    { title: 'Produits', icon: FaBox, path: '/produits', roles: ['admin', 'market'] },
    {
      title: 'Chauffeurs', icon: FaTruck, roles: ['admin', 'driver'], subItems: [
        { title: 'Gérer les chauffeurs', path: '/chauffeurs/Gérer' },
        { title: 'Fiche de route', path: '/chauffeurs/sub4' }
      ]
    },
    { title: 'Utilisateurs', icon: FaUsers, path: '/utilisateurs', roles: ['admin'] },
    {
      title: 'Plans', icon: FaRegChartBar, roles: ['admin'], subItems: [
        { title: 'Gérer le plans', path: '/plans/sub5' },
        { title: 'Secture', path: '/plans/secture' }
      ]
    },
    { title: 'Settings', icon: FaCog, path: '/settings', roles: ['admin'] },
    { title: 'Logout', icon: FaSignOutAlt, onClick: handleLogout, roles: ['admin', 'market', 'driver', 'user'] }
  ];

  // Filter items based on the user's role
  const filteredItems = sidebarItems.filter(item => item.roles.includes(role));

  return (
    <div className="flex h-screen">
      <Sidebar items={filteredItems} />
      <div className="flex-grow p-6">
        <h1 className="text-3xl font-bold absolute z-50">{title}</h1>
      </div>
    </div>
  );
}

export default Dashboard;
