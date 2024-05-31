// App.js
import React from 'react';
import Sidebar from '../sidebar/sidebar';
import { FaHome, FaUserAlt, FaStore, FaBox, FaTruck, FaUsers, FaRegChartBar, FaCog } from 'react-icons/fa';

function Dashboard() {
    const sidebarItems = [
        { title: 'Dashboard', icon: FaHome },
        { title: 'Livraison', icon: FaTruck, subItems: [{ title: 'Sub-item 1' }, { title: 'Sub-item 2' }] },
        { title: 'Clients', icon: FaUserAlt },
        { title: 'Magasins', icon: FaStore },
        { title: 'Produits', icon: FaBox },
        { title: 'Chauffeurs', icon: FaTruck, subItems: [{ title: 'Sub-item 3' }, { title: 'Sub-item 4' }] },
        { title: 'Utilisateurs', icon: FaUsers },
        { title: 'Pions', icon: FaRegChartBar, subItems: [{ title: 'Sub-item 5' }, { title: 'Sub-item 6' }] },
        { title: 'Settings', icon: FaCog },
        
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
