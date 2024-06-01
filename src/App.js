import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Dashboard from './componant/dashboard/dashboard';
import Login from './componant/login/login';
import ProtectedRoute from './ProtectedRoute';
import Livraison from './componant/livraison/livraison';
import Clients from './componant/clients/clients';
import Magasins from './componant/magasins/magasins';
import Produits from './componant/produits/produits';
import Chauffeurs from './componant/chauffeurs/chauffeurs';
import Utilisateurs from './componant/utilisateurs/utilisateurs';
import Pions from './componant/pions/pions';
import Settings from './componant/settings/settings';
import Listes from './componant/livraison/listes';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="/livraison" element={<ProtectedRoute element={<Livraison />} />} />
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