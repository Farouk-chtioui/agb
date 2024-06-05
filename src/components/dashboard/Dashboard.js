import React from 'react';
import Sidebar from '../sidebar/Sidebar';
import { FaHome, FaUserAlt, FaStore, FaBox, FaTruck, FaUsers, FaRegChartBar, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
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
        { title: 'Chauffeurs', icon: FaTruck, path: '/chauffeurs', subItems: [
            { title: 'Sub-item 3', path: '/chauffeurs/sub3' }, 
            { title: 'Sub-item 4', path: '/chauffeurs/sub4' }
        ]},
        { title: 'Utilisateurs', icon: FaUsers, path: '/utilisateurs' },
        { title: 'Pions', icon: FaRegChartBar, subItems: [
            { title: 'Sub-item 5', path: '/pions/sub5' }, 
            { title: 'Sub-item 6', path: '/pions/sub6' }
        ]},
        { title: 'Settings', icon: FaCog, path: '/settings' },
        { title: 'Logout', icon: FaSignOutAlt, onClick: handleLogout }
    ];

    return (
        <div className="flex">
          <Sidebar items={sidebarItems} />
          <div className="flex-grow p-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>
          </div>
        </div>
    );
}

export default Dashboard;
