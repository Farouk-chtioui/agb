import { Routes, Route } from 'react-router-dom';
import Login from '../login/Login';
import Dashboard from '../dashboard/Dashboard';
import Clients from '../clients/Clients';
import Magasins from '../magasins/Magasins';
import Produits from '../Produit/Produit'
import Chauffeurs from '../chauffeurs/Gérer les chauffeurs/Chauffeurs';
import Utilisateurs from '../utilisateurs/Utilisateurs';
import Secture from '../Plans/Secteurs/Secteurs';
import Settings from '../settings/Settings';
import ProtectedRoute from '../../ProtectedRoute';
import PublicRoute from '../../publicroute';
import Livraison from '../livraison/Livraison';
import InvoicePDF from '../livraison/pdf/Invoice';
import Plans from '../Plans/Plans';
function Routing(){
  return (
    <Routes>
      <Route path="/" element={<PublicRoute element={<Login />} />} />
      <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard title="Dashboard" />} />} />
      <Route path="/livraison/listes" element={<ProtectedRoute element={<Livraison />} />} />
      <Route path="/clients" element={<ProtectedRoute element={<Clients />} />} />
      <Route path="/magasins" element={<ProtectedRoute element={<Magasins />} />} />
      <Route path="/produits" element={<ProtectedRoute element={<Produits />} />} />
      <Route path="/chauffeurs/Gérer" element={<ProtectedRoute element={<Chauffeurs />} />} />
      <Route path="/utilisateurs" element={<ProtectedRoute element={<Utilisateurs />} />} />
      <Route path="/plans/secture" element={<ProtectedRoute element={<Secture />} />} />
      <Route path="/settings" element={<ProtectedRoute element={<Settings />} />} />
      <Route path="/invoice/:NumeroCommande" element={<InvoicePDF />} />
      <Route path="/test" element={<ProtectedRoute element={<Plans />} />} />

    </Routes>
  );
}

export default Routing;