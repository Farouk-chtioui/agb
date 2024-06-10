import { Routes, Route } from 'react-router-dom';
import Login from '../login/Login';
import Dashboard from '../dashboard/Dashboard';
import Listes from '../livraison/Listes';
import Clients from '../clients/Clients';
import Magasins from '../magasins/Magasins';
import Produits from '../produits/Proudits';
import Chauffeurs from '../chauffeurs/Gérer les chauffeurs/Chauffeurs';
import Utilisateurs from '../utilisateurs/Utilisateurs';
import Pions from '../pions/Pions';
import Settings from '../settings/Settings';
import ProtectedRoute from '../../ProtectedRoute';
import PublicRoute from '../../publicroute';

function Routing(){
  return (
    <Routes>
      <Route path="/" element={<PublicRoute element={<Login />} />} />
      <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard title="Dashboard" />} />} />
      <Route path="/livraison/listes" element={<ProtectedRoute element={<Listes />} />} />
      <Route path="/clients" element={<ProtectedRoute element={<Clients />} />} />
      <Route path="/magasins" element={<ProtectedRoute element={<Magasins />} />} />
      <Route path="/produits" element={<ProtectedRoute element={<Produits />} />} />
      <Route path="/chauffeurs/Gérer" element={<ProtectedRoute element={<Chauffeurs />} />} />
      <Route path="/utilisateurs" element={<ProtectedRoute element={<Utilisateurs />} />} />
      <Route path="/pions/*" element={<ProtectedRoute element={<Pions />} />} />
      <Route path="/settings" element={<ProtectedRoute element={<Settings />} />} />
    </Routes>
  );
}

export default Routing;