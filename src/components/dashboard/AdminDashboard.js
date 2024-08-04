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
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import './AdminDashboard.css'; // Import custom CSS for styles

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AdminDashboard = () => {
  const [clientCount, setClientCount] = useState(0);
  const [magasinCount, setMagasinCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [driverCount, setDriverCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [sectures, setSectures] = useState([]);
  const [livraisons, setLivraisons] = useState([]);
  const [secteurStats, setSecteurStats] = useState([]);
  const [orderTrendData, setOrderTrendData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clients = await fetchClients();
        const magasins = await fetchMagasins();
        const products = await fetchProducts();
        const drivers = await fetchDrivers();
        const secturesData = await fetchSectures();
        const orders = await fetchLivraisons();

        setClientCount(clients.total || clients.length || 0);
        setMagasinCount(magasins.total || magasins.length || 0);
        setProductCount(products.total || products.length || 0);
        setDriverCount(drivers.total || drivers.length || 0);
        setOrderCount(orders.total || orders.length || 0);
        setSectures(secturesData || []);
        const livraisonsData = Array.isArray(orders.livraisons) ? orders.livraisons : orders;
        setLivraisons(livraisonsData || []);

        console.log('Fetched Livraisons:', livraisonsData);

        const secteurs = calculateSecteurStats(livraisonsData || [], secturesData || []);
        setSecteurStats(secteurs);

        const trends = calculateOrderTrends(livraisonsData || []);
        setOrderTrendData(trends);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const calculateSecteurStats = (livraisons, sectures) => {
    const secteurCounts = {};

    if (!Array.isArray(livraisons)) return [];

    livraisons.forEach((livraison) => {
      const secteur = sectures.find(s => s.codesPostaux.includes(parseInt(livraison.client.code_postal)));
      if (secteur) {
        if (secteurCounts[secteur.name]) {
          secteurCounts[secteur.name]++;
        } else {
          secteurCounts[secteur.name] = 1;
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

  const calculateOrderTrends = (livraisons) => {
    if (!Array.isArray(livraisons)) return [];

    const trends = [];

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;

    const ordersByMonth = livraisons.reduce((acc, livraison) => {
      const date = new Date(livraison.Date);
      const month = date.getMonth();
      const year = date.getFullYear();

      if (!acc[year]) acc[year] = new Array(12).fill(0);
      acc[year][month]++;
      return acc;
    }, {});

    for (let i = 0; i < 12; i++) {
      trends.push({
        name: months[i],
        'Last Year': ordersByMonth[previousYear] ? ordersByMonth[previousYear][i] : 0,
        'This Year': ordersByMonth[currentYear] ? ordersByMonth[currentYear][i] : 0,
      });
    }

    return trends;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Dashboard title="Dashboard" className="w-1/4" />
      <div className="flex-1 p-4 overflow-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
        </div>
        <div className="mb-8 flex justify-center">
          <ReadOnlyCalendarComponent plans={sectures} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-4 text-center">Secteur</h2>
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
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-4 text-center">Order Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={orderTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Last Year" stroke="#8884d8" />
                <Line type="monotone" dataKey="This Year" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-white p-6 rounded-lg shadow flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium">Clients</h2>
              <p className="text-4xl font-bold">{clientCount}</p>
              <p className="text-green-500 text-sm">+4% (30 days)</p>
            </div>
            <FontAwesomeIcon icon={faUsers} className="h-16 w-16 text-blue-500"/>
          </div>
          <div className="bg-white p-6 rounded-lg shadow flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium">Magasins</h2>
              <p className="text-4xl font-bold">{magasinCount}</p>
              <p className="text-green-500 text-sm">+4% (30 days)</p>
            </div>
            <FontAwesomeIcon icon={faStore} className="h-16 w-16 text-blue-500"/>
          </div>
          <div className="bg-white p-6 rounded-lg shadow flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium">Produits</h2>
              <p className="text-4xl font-bold">{productCount}</p>
              <p className="text-red-500 text-sm">-25% (30 days)</p>
            </div>
            <FontAwesomeIcon icon={faBox} className="h-16 w-16 text-blue-500"/>
          </div>
          <div className="bg-white p-6 rounded-lg shadow flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium">Chauffeurs</h2>
              <p className="text-4xl font-bold">{driverCount}</p>
              <p className="text-red-500 text-sm">-12% (30 days)</p>
            </div>
            <FontAwesomeIcon icon={faTruck} className="h-16 w-16 text-blue-500"/>
          </div>
          <div className="bg-white p-6 rounded-lg shadow flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium">Orders</h2>
              <p className="text-4xl font-bold">{orderCount}</p>
            </div>
            <FontAwesomeIcon icon={faChartLine} className="h-16 w-16 text-blue-500"/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
