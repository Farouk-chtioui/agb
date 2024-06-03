import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Dashboard from './components/dashboard/dashboard';
import Login from './components/login/login';
import ProtectedRoute from './ProtectedRoute';
import Clients from './components/clients/clients';
import Magasins from './components/magasins/magasins';
import Produits from './components/produits/produits';
import Chauffeurs from './components/chauffeurs/chauffeurs';
import Utilisateurs from './components/utilisateurs/utilisateurs';
import Pions from './components/pions/pions';
import Settings from './components/settings/settings';
import Listes from './components/livraison/listes';
import PublicRoute from './publicroute';
function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<PublicRoute element={<Login />} />} />
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="/livraison/listes" element={<ProtectedRoute element={<Listes />} />} />
        <Route path="/clients" element={<ProtectedRoute element={<Clients />} />} />
        <Route path="/magasins" element={<ProtectedRoute element={<Magasins />} />} />
        <Route path="/produits" element={<ProtectedRoute element={<Produits />} />} />
        <Route path="/chauffeurs/*" element={<ProtectedRoute element={<Chauffeurs />} />} />
        <Route path="/utilisateurs" element={<ProtectedRoute element={<Utilisateurs />} />} />
        <Route path="/pions/*" element={<ProtectedRoute element={<Pions />} />} />
        <Route path="/settings" element={<ProtectedRoute element={<Settings />} />} />
      </Routes>
    </Router>
  );
}

export default App;