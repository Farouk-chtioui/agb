import React from 'react';
import Sidebar from '../sidebar/Sidebar';
import { FaHome, FaUserAlt, FaStore, FaBox, FaTruck, FaUsers, FaRegChartBar, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function Dashboard({title}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
};
    const sidebarItems = [
        { title: 'Dashboard', icon: FaHome, path: '/dashboard' },
        { title: 'Livraison', icon: FaTruck, subItems: [
            { title: 'Listes des livraisons', path: '/livraison/listes' }, 
            { title: 'Demandes des livraisons', path: '/livraison/demandes' }
        ]},
        { title: 'Clients', icon: FaUserAlt, path: '/clients' },
        { title: 'Magasins', icon: FaStore, path: '/magasins' },
        { title: 'Produits', icon: FaBox, path: '/produits' },
        { title: 'Chauffeurs', icon: FaTruck,subItems: [
            { title: 'Gérer les chauffeurs', path: '/chauffeurs/Gérer' }, 
            { title: 'Fiche de route', path: '/chauffeurs/sub4' }
        ]},
        { title: 'Utilisateurs', icon: FaUsers, path: '/utilisateurs' },
        { title: 'Plans', icon: FaRegChartBar, subItems: [
            { title: 'Géere le plans', path: '/pions/sub5' }, 
            { title: 'Secture', path: '/pions/sub6' }
        ]},
        { title: 'Settings', icon: FaCog, path: '/settings' },
        { title: 'Logout', icon: FaSignOutAlt, onClick: handleLogout }
    ];

    return (
        <div className="flex">
          <Sidebar items={sidebarItems} />
          <div className="flex-grow p-6">
          <h1 className="text-3xl font-bold absolute z-50">{title}</h1>   
                 </div>
        </div>
    );
}

export default Dashboard;
