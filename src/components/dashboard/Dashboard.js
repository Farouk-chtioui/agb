import React, { useEffect, useState } from 'react';
import Sidebar from '../sidebar/Sidebar';
import Header from '../Header/Header';
import { FaHome, FaUserAlt, FaStore, FaBox, FaTruck, FaUsers, FaRegChartBar, FaSignOutAlt } from 'react-icons/fa';
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

  // Retrieve sidebar state from localStorage
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const savedSidebarState = localStorage.getItem('sidebarOpen');
    return savedSidebarState === 'true';
  });

  const [isHovering, setIsHovering] = useState(false);

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
      console.log('Received updatePendingCount event:', data);
      setPendingDeliveriesCount(data.count);
    });

    socket.on('statusChange', (data) => {
      fetchPendingDeliveries(); 
    });

    socket.on('addLivraison', (data) => {
      fetchPendingDeliveries();
    });

    return () => {
      socket.off('updatePendingCount');
      socket.off('statusChange');
      socket.off('addLivraison');
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
      localStorage.setItem('openIndexes', JSON.stringify(newOpenIndexes));
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
        { title: 'Fiche de route', path: '/route' }
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

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    localStorage.setItem('sidebarOpen', newState);
  };

  return (
    <div>
      <Sidebar 
        items={filteredItems} 
        openIndexes={openIndexes} 
        toggleDropdown={toggleDropdown} 
        isOpen={sidebarOpen || isHovering}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen || isHovering ? 'ml-64' : 'ml-16'} sm:ml-0`}>
        <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen || isHovering} />
      </div>
    </div>
  );
}

export default Dashboard;
