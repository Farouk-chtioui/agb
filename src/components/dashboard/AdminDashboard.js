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
import { faUsers, faStore, faBox, faTruck } from '@fortawesome/free-solid-svg-icons';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import './AdminDashboard.css';

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

    const roundedSecteurStats = secteurStats.map(secteur => ({
      name: secteur.name,
      value: Math.round(secteur.value * 10) / 10 // round to 1 decimal place
    }));

    const sumOfValues = roundedSecteurStats.reduce((acc, curr) => acc + curr.value, 0);
    const adjustment = 100 - sumOfValues;

    if (adjustment !== 0) {
      roundedSecteurStats[0].value += adjustment; // adjust the first value to ensure total is 100%
    }

    return roundedSecteurStats;
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
    <div className="dashboard-container">
      <Dashboard title="Dashboard" className="sidebar" />
      <div className="main-content">
        <div className="header-section">
          <h1 className="title">Admin Dashboard</h1>
        </div>
        <div className="calendar-section">
          <ReadOnlyCalendarComponent plans={sectures} />
        </div>
        <div className="stats-section">
          <div className="stat-card">
            <h2 className="stat-title">Secteur</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={secteurStats} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}>
                  {secteurStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="stat-card">
            <h2 className="stat-title">Order Trends</h2>
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
        <div className="summary-section">
          <div className="summary-card">
            <div>
              <h2 className="summary-title">Clients</h2>
              <p className="summary-count">{clientCount}</p>
            </div>
            <FontAwesomeIcon icon={faUsers} className="summary-icon"/>
          </div>
          <div className="summary-card">
            <div>
              <h2 className="summary-title">Magasins</h2>
              <p className="summary-count">{magasinCount}</p>
            </div>
            <FontAwesomeIcon icon={faStore} className="summary-icon"/>
          </div>
          <div className="summary-card">
            <div>
              <h2 className="summary-title">Produits</h2>
              <p className="summary-count">{productCount}</p>
            </div>
            <FontAwesomeIcon icon={faBox} className="summary-icon"/>
          </div>
          <div className="summary-card">
            <div>
              <h2 className="summary-title">Chauffeurs</h2>
              <p className="summary-count">{driverCount}</p>
            </div>
            <FontAwesomeIcon icon={faTruck} className="summary-icon"/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
