import React, { useEffect, useState } from 'react';
import Dashboard from './Dashboard'; 
import ReadOnlyCalendarComponent from '../Calendar/ReadOnly/ReadOnlyCalendarComponent';
import { fetchClients } from '../../api/clientService'; 
import { fetchMagasins } from '../../api/marketService'; 
import { fetchProducts } from '../../api/productService';
import { fetchDrivers } from '../../api/driverService';
import { fetchSectures } from '../../api/sectureService';
import { fetchLivraisons } from '../../api/livraisonService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faStore, faBox, faTruck, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AdminDashboard = () => {
  const [clientCount, setClientCount] = useState(0);
  const [magasinCount, setMagasinCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [driverCount, setDriverCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [sectures, setSectures] = useState([]);
  const [livraisons, setLivraisons] = useState([]);
  const [orderTimeData, setOrderTimeData] = useState([]);
  const [secteurStats, setSecteurStats] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const clients = await fetchClients(1);
      const magasins = await fetchMagasins(1);
      const products = await fetchProducts(1);
      const drivers = await fetchDrivers(1);
      const secturesData = await fetchSectures(1);
      const orders = await fetchLivraisons(1);

      console.log('Fetched Clients:', clients);
      console.log('Fetched Magasins:', magasins);
      console.log('Fetched Products:', products);
      console.log('Fetched Drivers:', drivers);
      console.log('Fetched Sectures:', secturesData);
      console.log('Fetched Orders:', orders);

      setClientCount(clients.total || 0);
      setMagasinCount(magasins.total || 0);
      setProductCount(products.total || 0);
      setDriverCount(drivers.total || 0);
      setOrderCount(orders.total || 0);
      setSectures(secturesData || []);
      setLivraisons(orders.data || []);

      const orderTimes = calculateOrderTimes(orders.data || []);
      console.log('Calculated Order Times:', orderTimes);
      setOrderTimeData(orderTimes);

      const secteurs = calculateSecteurStats(orders.data || [], secturesData || []);
      console.log('Calculated Secteur Stats:', secteurs);
      setSecteurStats(secteurs);
    };

    fetchData();
  }, []);

  const calculateSecteurStats = (livraisons, sectures) => {
    const secteurCounts = {};

    livraisons.forEach((livraison) => {
      const secteur = livraison.client.code_postal;
      if (sectures.find(s => s.codesPostaux.includes(Number(secteur)))) {
        if (secteurCounts[secteur]) {
          secteurCounts[secteur]++;
        } else {
          secteurCounts[secteur] = 1;
        }
      }
    });

    const totalLivraisons = livraisons.length;
    const secteurStats = Object.keys(secteurCounts).map((secteur) => ({
      name: secteur,
      value: (secteurCounts[secteur] / totalLivraisons) * 100,
    }));
    return secteurStats;
  };

  const calculateOrderTimes = (livraisons) => {
    const orderTimes = { Matin: 0, Midi: 0 };

    livraisons.forEach((livraison) => {
      if (livraison.Periode === 'Matin') {
        orderTimes.Matin++;
      } else if (livraison.Periode === 'Midi') {
        orderTimes.Midi++;
      }
    });

    return [
      { name: 'Morning (8AM)', value: orderTimes.Matin },
      { name: 'Afternoon (12PM)', value: orderTimes.Midi }
    ];
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Dashboard title="Dashboard" />
      <div className="content p-4 w-full">
        <div className="dashboard-header mb-4">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
        </div>
        <div className="calendar-section mb-8">
          <ReadOnlyCalendarComponent plans={sectures} />
        </div>
        <div className="statistics-section grid grid-cols-2 gap-4 mt-4">
          <div className="stat-item bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-2">Secteur</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={secteurStats} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8">
                  {secteurStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="stat-item bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-2">Order Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={orderTimeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8">
                  {orderTimeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="statistics-section grid grid-cols-4 gap-4 mt-4">
          <div className="stat-item bg-white p-6 rounded-lg shadow flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium">Clients</h2>
              <p className="text-2xl font-bold">{clientCount}</p>
            </div>
            <FontAwesomeIcon icon={faUsers} className="h-10 w-10 text-blue-500"/>
          </div>
          <div className="stat-item bg-white p-6 rounded-lg shadow flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium">Magasins</h2>
              <p className="text-2xl font-bold">{magasinCount}</p>
            </div>
            <FontAwesomeIcon icon={faStore} className="h-10 w-10 text-blue-500"/>
          </div>
          <div className="stat-item bg-white p-6 rounded-lg shadow flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium">Produits</h2>
              <p className="text-2xl font-bold">{productCount}</p>
            </div>
            <FontAwesomeIcon icon={faBox} className="h-10 w-10 text-blue-500"/>
          </div>
          <div className="stat-item bg-white p-6 rounded-lg shadow flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium">Chauffeurs</h2>
              <p className="text-2xl font-bold">{driverCount}</p>
            </div>
            <FontAwesomeIcon icon={faTruck} className="h-10 w-10 text-blue-500"/>
          </div>
          <div className="stat-item bg-white p-6 rounded-lg shadow flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium">Orders</h2>
              <p className="text-2xl font-bold">{orderCount}</p>
            </div>
            <FontAwesomeIcon icon={faChartLine} className="h-10 w-10 text-blue-500"/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
