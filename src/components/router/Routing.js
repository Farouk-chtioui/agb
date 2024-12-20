import { Routes, Route } from 'react-router-dom';
import Login from '../login/Login';
import Dashboard from '../dashboard/Dashboard';
import Clients from '../clients/Clients';
import Magasins from '../magasins/Magasins';
import Produits from '../Produit/Produit';
import Chauffeurs from '../chauffeurs/Gérer les chauffeurs/Chauffeurs';
import Utilisateurs from '../utilisateurs/Utilisateurs';
import Secteurs from '../Plans/Secteurs/Secteurs';
import Settings from '../settings/Settings';
import ProtectedRoute from '../../ProtectedRoute';
import PublicRoute from '../../publicroute';
import Livraison from '../livraison/Livraison';
import InvoicePDF from '../livraison/pdf/Invoice';
import Plans from '../Plans/Plans';
import { Provider } from 'react-redux';
import store from '../../redux/store';
import DemandesLivraison from '../DemandesLivraison/DemandesLivraison';
import Demandes from '../livraison/DemandeslivraisonsAdmin/Demande';
import AdminDashboard from '../dashboard/AdminDashboard';
import FicheDeRoute from '../FicheDeRoute/FicheDeRoute';
import Profile from '../Profile/Profile';
import MarketDashboard from '../dashboard/MarketDashboard';
import RouteSheetPDF from '../livraison/pdf/RouteSheetPDF';
import MarketList from '../ListeLivraisonMarket/MarketList';

function Routing() {
  return (
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<PublicRoute element={<Login />} />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute element={<AdminDashboard />} requiredRoles={['admin']} />} />
        <Route path="/market/dashboard" element={<ProtectedRoute element={<MarketDashboard />} requiredRoles={['market']} />} />
        <Route path="/livraison/listes" element={<ProtectedRoute element={<Livraison />} requiredRoles={['admin']} />} />
        <Route path="/commands/pending" element={<ProtectedRoute element={<Demandes />} requiredRoles={['admin']} />} />
        <Route path="/clients" element={<ProtectedRoute element={<Clients />} requiredRoles={['admin']} />} />
        <Route path="/magasins" element={<ProtectedRoute element={<Magasins />} requiredRoles={['admin']} />} />
        <Route path="/produits" element={<ProtectedRoute element={<Produits />} requiredRoles={['admin', 'market']} />} />
        <Route path="/chauffeurs/Gérer" element={<ProtectedRoute element={<Chauffeurs />} requiredRoles={['admin']} />} />
        <Route path="/utilisateurs" element={<ProtectedRoute element={<Utilisateurs />} requiredRoles={['admin']} />} />
        <Route path="/plans/secteurs" element={<ProtectedRoute element={<Secteurs />} requiredRoles={['admin']} />} />
        <Route path="/settings" element={<ProtectedRoute element={<Settings />} requiredRoles={['admin']} />} />
        <Route path="/invoice/:NumeroCommande" element={<InvoicePDF />} />
        <Route path="/route/:reference" element={<RouteSheetPDF />} />
        <Route path="/commands/propositions" element={<DemandesLivraison />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/route" element={<ProtectedRoute element={<FicheDeRoute />} requiredRoles={['admin']} />} />
        <Route path="/profile" element={<ProtectedRoute element={<Profile />} requiredRoles={['admin','market']} />} />
        <Route path="/route-sheet/driver/:driverId/date/:date" element={<ProtectedRoute element={<RouteSheetPDF />} requiredRoles={['admin', 'market']} />} />
        <Route path="/livraison/demandes" element={<ProtectedRoute element={<MarketList />} requiredRoles={['admin', 'market']} />} />

      </Routes>
    </Provider>
  );
}

export default Routing;
