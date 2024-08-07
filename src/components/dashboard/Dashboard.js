import React, { useEffect, useState } from 'react';
import Sidebar from '../sidebar/Sidebar';
import { FaHome, FaUserAlt, FaStore, FaBox, FaTruck, FaUsers, FaRegChartBar, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { pendingCount } from '../../api/livraisonService';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

function Dashboard({ title }) {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const [pendingDeliveriesCount, setPendingDeliveriesCount] = useState(0);
  const [openIndexes, setOpenIndexes] = useState(() => {
    const savedOpenIndexes = localStorage.getItem('openIndexes');
    return savedOpenIndexes ? JSON.parse(savedOpenIndexes) : {};
  });

  const fetchPendingDeliveries = async () => {
    try {
      const data = await pendingCount();
      setPendingDeliveriesCount(data.count);
    } catch (error) {
      console.error('Error fetching pending deliveries count', error);
    }
  };

  useEffect(() => {
    fetchPendingDeliveries();

    socket.on('updatePendingCount', (data) => {
      setPendingDeliveriesCount(data.count);
    });

    socket.on('statusChange', () => {
      console.log('Received statusChange event in Dashboard');
      fetchPendingDeliveries(); // Reload the pending deliveries count
    });

    return () => {
      socket.off('updatePendingCount');
      socket.off('statusChange');
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('openIndexes');
    navigate('/');
  };

  const toggleDropdown = (index) => {
    setOpenIndexes((prevState) => {
      const newOpenIndexes = { ...prevState, [index]: !prevState[index] };
      localStorage.setItem('openIndexes', JSON.stringify(newOpenIndexes)); // Save the state to local storage
      return newOpenIndexes;
    });
  };

  const sidebarItems = [
    { title: 'Dashboard', icon: FaHome, path: `/${role}/dashboard`, roles: ['admin', 'market'] },
    {
      title: 'Livraison', icon: FaTruck, roles: ['admin'], subItems: [
        { title: 'Listes des livraisons', path: '/livraison/listes' },
        { 
          title: 'Demandes des livraisons', 
          path: '/commands/pending', 
          counter: pendingDeliveriesCount 
        }
      ]
    },
    { title: 'Clients', icon: FaUserAlt, path: '/clients', roles: ['admin'] },
    { title: 'Magasins', icon: FaStore, path: '/magasins', roles: ['admin'] },
    { title: 'Produits', icon: FaBox, path: '/produits', roles: ['admin', 'market'] },
    {
      title: 'Demande Livraison', icon: FaTruck, roles: ['market'], subItems: [
        { title: 'Liste des livraisons', path: '/livraison/demandes' },
        { title: 'Proposer une livraison', path: '/commands/propositions' }
      ]
    },
    {
      title: 'Chauffeurs', icon: FaTruck, roles: ['admin', 'driver'], subItems: [
        { title: 'Gérer les chauffeurs', path: '/chauffeurs/Gérer' },
        { title: 'Fiche de route', path: '/chauffeurs/sub4' }
      ]
    },
    { title: 'Utilisateurs', icon: FaUsers, path: '/utilisateurs', roles: ['admin'] },
    {
      title: 'Plans', icon: FaRegChartBar, roles: ['admin'], subItems: [
        { title: 'Gérer le plans', path: '/plans' },
        { title: 'Secture', path: '/plans/secteurs' }
      ]
    },
    { title: 'Logout', icon: FaSignOutAlt, onClick: handleLogout, roles: ['admin', 'market', 'driver', 'user'] },
  ];

  const filteredItems = sidebarItems.filter(item => item.roles.includes(role));

  return (
    <div className="flex h-screen">
      <Sidebar items={filteredItems} openIndexes={openIndexes} toggleDropdown={toggleDropdown} />
    </div>
  );
}

export default Dashboard;
