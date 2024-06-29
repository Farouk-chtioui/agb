// src/routes/Routing.js
import { Routes, Route } from 'react-router-dom';
import Login from '../login/Login';
import Dashboard from '../dashboard/Dashboard';
import Clients from '../clients/Clients';
import Magasins from '../magasins/Magasins';
import Produits from '../Produit/Produit';
import Chauffeurs from '../chauffeurs/Gérer les chauffeurs/Chauffeurs';
import Utilisateurs from '../utilisateurs/Utilisateurs';
import Secture from '../Plans/Secteurs/Secteurs';
import Settings from '../settings/Settings';
import ProtectedRoute from '../../ProtectedRoute';
import PublicRoute from '../../publicroute';
import Livraison from '../livraison/Livraison';
import InvoicePDF from '../livraison/pdf/Invoice';
import Plans from '../Plans/Plans';

function Routing() {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute element={<Login />} />} />
      <Route path="admin/dashboard" element={<ProtectedRoute element={<Dashboard title="Dashboard" />} requiredRoles={['admin']} />} />
      <Route path="/livraison/listes" element={<ProtectedRoute element={<Livraison />} requiredRoles={['admin']} />} />
      <Route path="/clients" element={<ProtectedRoute element={<Clients />} requiredRoles={['admin']} />} />
      <Route path="/magasins" element={<ProtectedRoute element={<Magasins />} requiredRoles={['admin']} />} />
      <Route path="/produits" element={<ProtectedRoute element={<Produits />} requiredRoles={['admin', 'market']} />} />
      <Route path="/chauffeurs/Gérer" element={<ProtectedRoute element={<Chauffeurs />} requiredRoles={['driver']} />} />
      <Route path="/utilisateurs" element={<ProtectedRoute element={<Utilisateurs />} requiredRoles={['admin']} />} />
      <Route path="/plans/secture" element={<ProtectedRoute element={<Secture />} requiredRoles={['admin']} />} />
      <Route path="/settings" element={<ProtectedRoute element={<Settings />} requiredRoles={['admin']} />} />
      <Route path="/invoice/:NumeroCommande" element={<InvoicePDF />} />
      <Route path="/test" element={<ProtectedRoute element={<Plans />} requiredRoles={['admin']} />} />
    </Routes>
  );
}

export default Routing;
